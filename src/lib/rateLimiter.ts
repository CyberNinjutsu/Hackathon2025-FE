import {
  RateLimitState,
  OTP_REQUEST_COOLDOWN_MINUTES,
  MAX_OTP_REQUESTS_PER_HOUR,
  MAX_FAILED_ATTEMPTS,
  LOCKOUT_DURATION_HOURS,
} from "@/types/adminAuth";

class RateLimiter {
  private readonly STORAGE_KEY = "admin_rate_limit";

  /**
   * Get lockout duration in milliseconds
   */
  private getLockoutDuration(): number {
    return LOCKOUT_DURATION_HOURS * 60 * 60 * 1000; // Convert hours to milliseconds
  }

  /**
   * Check if user can request a new OTP
   */
  canRequestOTP(_email: string): boolean {
    try {
      const rateLimitData = this.getRateLimitData();
      const now = new Date();

      // Check if account is locked due to failed attempts
      if (this.isAccountLocked()) {
        console.log("OTP request blocked: Account is locked");
        return false;
      }

      // Check if user has exceeded hourly OTP request limit
      if (this.hasExceededHourlyLimit()) {
        console.log("OTP request blocked: Exceeded hourly limit");
        return false;
      }

      // Check cooldown period between requests (only if there was a previous request)
      if (rateLimitData.lastOtpRequest) {
        const lastRequest = new Date(rateLimitData.lastOtpRequest);
        const timeSinceLastRequest = now.getTime() - lastRequest.getTime();
        const cooldownMs = OTP_REQUEST_COOLDOWN_MINUTES * 60 * 1000;

        if (timeSinceLastRequest < cooldownMs) {
          console.log("OTP request blocked: Cooldown period active", {
            timeSinceLastRequest: Math.floor(timeSinceLastRequest / 1000),
            cooldownSeconds: OTP_REQUEST_COOLDOWN_MINUTES * 60,
            remainingSeconds: Math.ceil(
              (cooldownMs - timeSinceLastRequest) / 1000
            ),
          });
          return false;
        }
      }

      console.log("OTP request allowed", {
        hasLastRequest: !!rateLimitData.lastOtpRequest,
        otpRequests: rateLimitData.otpRequests,
        isLocked: this.isAccountLocked(),
      });
      return true;
    } catch (error) {
      console.error("OTP request check error:", error);
      return true; // Allow request on error to avoid blocking users
    }
  }

  /**
   * Record an OTP request
   */
  recordOTPRequest(_email: string): void {
    try {
      const rateLimitData = this.getRateLimitData();
      const now = new Date();

      // Clean up old requests (older than 1 hour)
      this.cleanupOldRequests();

      // Increment request count
      rateLimitData.otpRequests = (rateLimitData.otpRequests || 0) + 1;
      rateLimitData.lastOtpRequest = now.toISOString();

      // Check if user has exceeded the hourly limit
      if (rateLimitData.otpRequests >= MAX_OTP_REQUESTS_PER_HOUR) {
        // Lock account
        const lockoutUntil = new Date(
          now.getTime() + this.getLockoutDuration()
        );
        rateLimitData.lockoutUntil = lockoutUntil.toISOString();
      }

      this.saveRateLimitData(rateLimitData);
    } catch (error) {
      console.error("OTP request recording error:", error);
    }
  }

  /**
   * Get remaining wait time for next OTP request in seconds
   */
  getRemainingWaitTime(_email: string): number {
    try {
      const rateLimitData = this.getRateLimitData();

      if (!rateLimitData.lastOtpRequest) {
        return 0;
      }

      const now = new Date();
      const lastRequest = new Date(rateLimitData.lastOtpRequest);
      const cooldownMs = OTP_REQUEST_COOLDOWN_MINUTES * 60 * 1000;
      const timeSinceLastRequest = now.getTime() - lastRequest.getTime();

      if (timeSinceLastRequest >= cooldownMs) {
        return 0;
      }

      return Math.ceil((cooldownMs - timeSinceLastRequest) / 1000);
    } catch (error) {
      console.error("Wait time calculation error:", error);
      return 0;
    }
  }

  /**
   * Record a failed OTP attempt
   */
  recordFailedAttempt(_email: string): void {
    try {
      const rateLimitData = this.getRateLimitData();
      const now = new Date();

      rateLimitData.failedOtpAttempts =
        (rateLimitData.failedOtpAttempts || 0) + 1;

      // Check if user has exceeded failed attempt limit
      if (rateLimitData.failedOtpAttempts >= MAX_FAILED_ATTEMPTS) {
        // Lock account
        const lockoutUntil = new Date(
          now.getTime() + this.getLockoutDuration()
        );
        rateLimitData.lockoutUntil = lockoutUntil.toISOString();
      }

      this.saveRateLimitData(rateLimitData);
    } catch (error) {
      console.error("Failed attempt recording error:", error);
    }
  }

  /**
   * Check if account is currently locked
   */
  isAccountLocked(): boolean {
    try {
      const rateLimitData = this.getRateLimitData();

      if (!rateLimitData.lockoutUntil) {
        return false;
      }

      const now = new Date();
      const lockoutUntil = new Date(rateLimitData.lockoutUntil);

      if (now >= lockoutUntil) {
        // Lockout period has expired, reset counters
        this.resetCounters();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Account lock check error:", error);
      return false;
    }
  }

  /**
   * Get remaining lockout time in seconds
   */
  getRemainingLockoutTime(): number {
    try {
      const rateLimitData = this.getRateLimitData();

      if (!rateLimitData.lockoutUntil) {
        return 0;
      }

      const now = new Date();
      const lockoutUntil = new Date(rateLimitData.lockoutUntil);
      const remainingMs = lockoutUntil.getTime() - now.getTime();

      return Math.max(0, Math.ceil(remainingMs / 1000));
    } catch (error) {
      console.error("Lockout time calculation error:", error);
      return 0;
    }
  }

  /**
   * Reset failed attempts counter (called on successful authentication)
   */
  resetFailedAttempts(): void {
    try {
      const rateLimitData = this.getRateLimitData();
      rateLimitData.failedOtpAttempts = 0;

      // Also clear lockout if it was due to failed attempts
      if (rateLimitData.lockoutUntil) {
        rateLimitData.lockoutUntil = null;
      }

      this.saveRateLimitData(rateLimitData);
    } catch (error) {
      console.error("Failed attempts reset error:", error);
    }
  }

  /**
   * Reset all counters (called when lockout expires)
   */
  resetCounters(): void {
    try {
      const rateLimitData: RateLimitState = {
        otpRequests: 0,
        lastOtpRequest: null,
        failedOtpAttempts: 0,
        lockoutUntil: null,
      };

      this.saveRateLimitData(rateLimitData);
    } catch (error) {
      console.error("Counter reset error:", error);
    }
  }

  /**
   * Get current OTP request count
   */
  getCurrentOTPRequestCount(): number {
    try {
      const rateLimitData = this.getRateLimitData();
      return rateLimitData.otpRequests || 0;
    } catch (error) {
      console.error("OTP request count error:", error);
      return 0;
    }
  }

  /**
   * Get current failed attempts count
   */
  getCurrentFailedAttempts(): number {
    try {
      const rateLimitData = this.getRateLimitData();
      return rateLimitData.failedOtpAttempts || 0;
    } catch (error) {
      console.error("Failed attempts count error:", error);
      return 0;
    }
  }

  /**
   * Check if user has exceeded hourly OTP request limit
   */
  private hasExceededHourlyLimit(): boolean {
    try {
      const rateLimitData = this.getRateLimitData();

      // Clean up old requests first
      this.cleanupOldRequests();

      return (rateLimitData.otpRequests || 0) >= MAX_OTP_REQUESTS_PER_HOUR;
    } catch (error) {
      console.error("Hourly limit check error:", error);
      return false;
    }
  }

  /**
   * Clean up old OTP requests (older than 1 hour)
   */
  private cleanupOldRequests(): void {
    try {
      const rateLimitData = this.getRateLimitData();

      if (!rateLimitData.lastOtpRequest) {
        return;
      }

      const now = new Date();
      const lastRequest = new Date(rateLimitData.lastOtpRequest);
      const hourInMs = 60 * 60 * 1000;

      // If last request was more than 1 hour ago, reset the counter
      if (now.getTime() - lastRequest.getTime() >= hourInMs) {
        rateLimitData.otpRequests = 0;
        rateLimitData.lastOtpRequest = null;
        this.saveRateLimitData(rateLimitData);
      }
    } catch (error) {
      console.error("Old requests cleanup error:", error);
    }
  }

  /**
   * Get rate limit data from localStorage
   */
  private getRateLimitData(): RateLimitState {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored
        ? JSON.parse(stored)
        : {
            otpRequests: 0,
            lastOtpRequest: null,
            failedOtpAttempts: 0,
            lockoutUntil: null,
          };
    } catch (error) {
      console.error("Rate limit data retrieval error:", error);
      return {
        otpRequests: 0,
        lastOtpRequest: null,
        failedOtpAttempts: 0,
        lockoutUntil: null,
      };
    }
  }

  /**
   * Save rate limit data to localStorage
   */
  private saveRateLimitData(data: RateLimitState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Rate limit data save error:", error);
    }
  }

  /**
   * Clear all rate limit data (for debugging/reset purposes)
   */
  clearAllData(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log("Rate limit data cleared");
    } catch (error) {
      console.error("Failed to clear rate limit data:", error);
    }
  }

  /**
   * Get status summary
   */
  getStatusSummary(): {
    canRequestOTP: boolean;
    isLocked: boolean;
    otpRequests: number;
    failedAttempts: number;
    remainingWaitTime: number;
    remainingLockoutTime: number;
  } {
    return {
      canRequestOTP: this.canRequestOTP(""),
      isLocked: this.isAccountLocked(),
      otpRequests: this.getCurrentOTPRequestCount(),
      failedAttempts: this.getCurrentFailedAttempts(),
      remainingWaitTime: this.getRemainingWaitTime(""),
      remainingLockoutTime: this.getRemainingLockoutTime(),
    };
  }
}

export const rateLimiter = new RateLimiter();
