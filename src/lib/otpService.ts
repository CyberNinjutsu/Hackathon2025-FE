import {
  OTP_EXPIRY_MINUTES,
  StoredOTP
} from '@/types/adminAuth';

class OTPService {
  private readonly STORAGE_KEY = 'admin_otp';

  /**
   * Generate a secure 6-digit OTP
   */
  generateOTP(): string {
    const array = new Uint8Array(3);
    crypto.getRandomValues(array);

    // Convert to 6-digit number
    const num = (array[0] << 16) | (array[1] << 8) | array[2];
    const otp = (num % 900000 + 100000).toString();

    return otp;
  }

  /**
   * Store OTP for email with expiration
   */
  storeOTP(email: string, otp: string): Date {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);

    const storedOTP: StoredOTP = {
      code: otp,
      email,
      createdAt: now,
      expiresAt,
      attempts: 0,
      isUsed: false
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storedOTP));
      return expiresAt;
    } catch (error) {
      console.error('OTP storage error:', error);
      throw new Error('Failed to store OTP');
    }
  }

  /**
   * Validate OTP against stored value
   */
  validateOTP(email: string, inputOtp: string): { isValid: boolean; error?: string; remainingAttempts?: number } {
    try {
      const storedOTP = this.getStoredOTP();

      if (!storedOTP) {
        return {
          isValid: false,
          error: 'No OTP found. Please request a new one.'
        };
      }

      // Check if OTP is for the correct email
      if (storedOTP.email !== email) {
        return {
          isValid: false,
          error: 'OTP not found for this email.'
        };
      }

      // Check if OTP is already used
      if (storedOTP.isUsed) {
        return {
          isValid: false,
          error: 'OTP has already been used. Please request a new one.'
        };
      }

      // Check if OTP is expired
      const now = new Date();
      const expiresAt = new Date(storedOTP.expiresAt);

      if (now > expiresAt) {
        this.invalidateOTP();
        return {
          isValid: false,
          error: 'OTP has expired. Please request a new one.'
        };
      }

      // Increment attempt count
      storedOTP.attempts += 1;
      this.updateStoredOTP(storedOTP);

      // Check if OTP matches
      if (storedOTP.code === inputOtp.trim()) {
        // Mark as used
        storedOTP.isUsed = true;
        this.updateStoredOTP(storedOTP);

        return {
          isValid: true
        };
      } else {
        const remainingAttempts = Math.max(0, 3 - storedOTP.attempts);

        if (remainingAttempts === 0) {
          this.invalidateOTP();
          return {
            isValid: false,
            error: 'Too many failed attempts. OTP has been invalidated.',
            remainingAttempts: 0
          };
        }

        return {
          isValid: false,
          error: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
          remainingAttempts
        };
      }
    } catch (error) {
      console.error('OTP validation error:', error);
      return {
        isValid: false,
        error: 'An error occurred during OTP validation.'
      };
    }
  }

  /**
   * Check if OTP exists and is valid
   */
  hasValidOTP(email: string): boolean {
    try {
      const storedOTP = this.getStoredOTP();

      if (!storedOTP || storedOTP.email !== email || storedOTP.isUsed) {
        return false;
      }

      const now = new Date();
      const expiresAt = new Date(storedOTP.expiresAt);

      return now <= expiresAt;
    } catch (error) {
      console.error('OTP validity check error:', error);
      return false;
    }
  }

  /**
   * Get OTP expiration time
   */
  getOTPExpirationTime(email: string): Date | null {
    try {
      const storedOTP = this.getStoredOTP();

      if (!storedOTP || storedOTP.email !== email || storedOTP.isUsed) {
        return null;
      }

      return new Date(storedOTP.expiresAt);
    } catch (error) {
      console.error('OTP expiration check error:', error);
      return null;
    }
  }

  /**
   * Get remaining OTP time in seconds
   */
  getRemainingOTPTime(email: string): number {
    try {
      const expiresAt = this.getOTPExpirationTime(email);
      if (!expiresAt) return 0;

      const now = new Date();
      const remainingMs = expiresAt.getTime() - now.getTime();

      return Math.max(0, Math.ceil(remainingMs / 1000));
    } catch (error) {
      console.error('Remaining OTP time calculation error:', error);
      return 0;
    }
  }

  /**
   * Invalidate current OTP
   */
  invalidateOTP(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('OTP invalidation error:', error);
    }
  }

  /**
   * Check if OTP is expired
   */
  isOTPExpired(email: string): boolean {
    try {
      const storedOTP = this.getStoredOTP();

      if (!storedOTP || storedOTP.email !== email) {
        return true;
      }

      const now = new Date();
      const expiresAt = new Date(storedOTP.expiresAt);

      return now > expiresAt;
    } catch (error) {
      console.error('OTP expiration check error:', error);
      return true;
    }
  }

  /**
   * Get stored OTP from localStorage
   */
  private getStoredOTP(): StoredOTP | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('OTP retrieval error:', error);
      return null;
    }
  }

  /**
   * Update stored OTP in localStorage
   */
  private updateStoredOTP(otp: StoredOTP): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(otp));
    } catch (error) {
      console.error('OTP update error:', error);
    }
  }

  /**
   * Get OTP attempts count
   */
  getOTPAttempts(email: string): number {
    try {
      const storedOTP = this.getStoredOTP();

      if (!storedOTP || storedOTP.email !== email) {
        return 0;
      }

      return storedOTP.attempts;
    } catch (error) {
      console.error('OTP attempts check error:', error);
      return 0;
    }
  }

  /**
   * Clean up expired OTPs
   */
  cleanupExpiredOTPs(): void {
    try {
      const storedOTP = this.getStoredOTP();

      if (storedOTP) {
        const now = new Date();
        const expiresAt = new Date(storedOTP.expiresAt);

        if (now > expiresAt) {
          this.invalidateOTP();
        }
      }
    } catch (error) {
      console.error('OTP cleanup error:', error);
    }
  }
}

export const otpService = new OTPService();