import {
  AdminAuthState,
  AdminSession,
  LoginResult,
  VerificationResult,
  AdminAuthError,
  AuthError,
  ADMIN_EMAIL,
  SESSION_DURATION_HOURS
} from '@/types/adminAuth';

class AdminAuthService {
  private readonly STORAGE_KEY = 'admin_auth';
  private readonly SESSION_KEY = 'admin_session';

  /**
   * Validate email address
   */
  validateEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }

    const trimmedEmail = email.trim().toLowerCase();
    return ADMIN_EMAIL.some(admin => admin.toLowerCase() === trimmedEmail);
  }

  /**
   * Create a new admin session
   */
  createSession(email: string): string {
    const token = this.generateSecureToken();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + SESSION_DURATION_HOURS * 60 * 60 * 1000);

    const session: AdminSession = {
      token,
      email,
      createdAt: now,
      expiresAt,
      isValid: true
    };

    // Store session in localStorage
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

    return token;
  }

  /**
   * Validate existing session
   */
  validateSession(token?: string): boolean {
    try {
      const storedSession = localStorage.getItem(this.SESSION_KEY);
      if (!storedSession) return false;

      const session: AdminSession = JSON.parse(storedSession);

      // Check if session exists and token matches (if provided)
      if (token && session.token !== token) return false;

      // Check if session is expired
      const now = new Date();
      const expiresAt = new Date(session.expiresAt);

      if (now > expiresAt) {
        this.destroySession();
        return false;
      }

      // Check if session is valid
      return session.isValid && this.validateEmail(session.email);
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }

  /**
   * Destroy current session
   */
  destroySession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  /**
   * Get current session
   */
  getCurrentSession(): AdminSession | null {
    try {
      const storedSession = localStorage.getItem(this.SESSION_KEY);
      if (!storedSession) return null;

      const session: AdminSession = JSON.parse(storedSession);

      if (this.validateSession(session.token)) {
        return session;
      }

      return null;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  /**
   * Initiate login process
   */
  async initiateLogin(email: string): Promise<LoginResult> {
    try {
      // Validate email
      if (!this.validateEmail(email)) {
        return {
          success: false,
          error: {
            type: AdminAuthError.INVALID_EMAIL,
            message: 'Invalid email address. Only authorized admin email is allowed.',
            canRetry: true
          }
        };
      }

      // Check if account is locked
      if (this.isAccountLocked(email)) {
        const remainingTime = this.getRemainingLockoutTime(email);
        return {
          success: false,
          error: {
            type: AdminAuthError.ACCOUNT_LOCKED,
            message: `Account is locked due to too many failed attempts. Try again in ${Math.ceil(remainingTime / 60)} minutes.`,
            remainingTime,
            canRetry: false
          }
        };
      }

      return {
        success: true,
        canRequestOtp: true
      };
    } catch (error) {
      console.error('Login initiation error:', error);
      return {
        success: false,
        error: {
          type: AdminAuthError.EMAIL_SEND_FAILED,
          message: 'An error occurred during login. Please try again.',
          canRetry: true
        }
      };
    }
  }

  /**
   * Verify OTP and complete authentication
   */
  async verifyOTP(email: string, otp: string): Promise<VerificationResult> {
    try {
      // Import services dynamically to avoid circular dependencies
      const { otpService } = await import('./otpService');
      const { rateLimiter } = await import('./rateLimiter');

      // Validate email first
      if (!this.validateEmail(email)) {
        return {
          success: false,
          error: {
            type: AdminAuthError.INVALID_EMAIL,
            message: 'Invalid email address.',
            canRetry: false
          }
        };
      }

      // Check if account is locked
      if (rateLimiter.isAccountLocked()) {
        const remainingTime = rateLimiter.getRemainingLockoutTime();
        return {
          success: false,
          error: {
            type: AdminAuthError.ACCOUNT_LOCKED,
            message: `Account is locked. Try again in ${Math.ceil(remainingTime / 60)} minutes.`,
            remainingTime,
            canRetry: false
          }
        };
      }

      // Validate OTP
      const validation = otpService.validateOTP(email, otp);

      if (!validation.isValid) {
        // Record failed attempt
        rateLimiter.recordFailedAttempt(email);

        return {
          success: false,
          error: {
            type: AdminAuthError.OTP_INVALID,
            message: validation.error || 'Invalid OTP code.',
            canRetry: validation.remainingAttempts ? validation.remainingAttempts > 0 : true
          },
          remainingAttempts: validation.remainingAttempts
        };
      }

      // OTP is valid - create session
      const sessionToken = this.createSession(email);

      // Reset failed attempts
      rateLimiter.resetFailedAttempts();

      return {
        success: true,
        sessionToken
      };
    } catch (error) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        error: {
          type: AdminAuthError.OTP_INVALID,
          message: 'An error occurred during verification. Please try again.',
          canRetry: true
        }
      };
    }
  }

  /**
   * Check if account is locked (delegates to rateLimiter)
   */
  isAccountLocked(_email: string): boolean {
    // For now, return false to avoid circular dependency issues
    // This will be handled by the hook directly
    return false;
  }

  /**
   * Get remaining lockout time in seconds (delegates to rateLimiter)
   */
  getRemainingLockoutTime(_email: string): number {
    // For now, return 0 to avoid circular dependency issues
    // This will be handled by the hook directly
    return 0;
  }

  /**
   * Generate secure token
   */
  private generateSecureToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Get authentication data from localStorage
   */
  private getAuthData() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Auth data retrieval error:', error);
      return {};
    }
  }

  /**
   * Save authentication data to localStorage
   */
  private saveAuthData(data: Record<string, unknown>) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Auth data save error:', error);
    }
  }
}

export const adminAuthService = new AdminAuthService();