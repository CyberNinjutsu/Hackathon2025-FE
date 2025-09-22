import { OTP_EXPIRY_MINUTES } from "@/types/adminAuth";

interface OTPMetadata {
  email: string;
  sentAt: Date;
  expiresAt: Date;
  attempts: number;
}

class OTPService {
  private readonly STORAGE_KEY = "admin_otp_metadata";

  /**
   * Generate a secure 6-digit OTP
   */
  generateOTP(): string {
    const array = new Uint8Array(3);
    crypto.getRandomValues(array);

    // Convert to 6-digit number
    const num = (array[0] << 16) | (array[1] << 8) | array[2];
    const otp = ((num % 900000) + 100000).toString();

    return otp;
  }

  /**
   * Store OTP metadata in localStorage (not the actual OTP code)
   */
  storeOTPMetadata(email: string): Date {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);

    const metadata: OTPMetadata = {
      email,
      sentAt: now,
      expiresAt,
      attempts: 0,
    };

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(metadata));
      return expiresAt;
    } catch (error) {
      throw new Error("Failed to store OTP metadata");
    }
  }

  /**
   * Get OTP metadata from localStorage
   */
  getOTPMetadata(): OTPMetadata | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const metadata = JSON.parse(stored);
      return {
        ...metadata,
        sentAt: new Date(metadata.sentAt),
        expiresAt: new Date(metadata.expiresAt),
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Get OTP expiration time (for countdown display)
   */
  getOTPExpirationTime(): Date {
    const metadata = this.getOTPMetadata();
    if (metadata) {
      return metadata.expiresAt;
    }

    const now = new Date();
    return new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);
  }

  /**
   * Validate OTP via server API
   */
  async validateOTP(
    email: string,
    inputOtp: string
  ): Promise<{ isValid: boolean; error?: string; remainingAttempts?: number }> {
    try {
      // Update attempt count in metadata
      const metadata = this.getOTPMetadata();
      if (metadata && metadata.email === email) {
        metadata.attempts += 1;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(metadata));
      }

      const response = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: inputOtp }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          isValid: false,
          error: data.error || "OTP validation failed",
          remainingAttempts: data.remainingAttempts,
        };
      }

      // Clear metadata on successful validation
      this.invalidateOTP();

      return {
        isValid: true,
      };
    } catch (error) {
      return {
        isValid: false,
        error: "Network error during OTP validation",
      };
    }
  }

  /**
   * Get remaining OTP time in seconds (for display purposes)
   */
  getRemainingOTPTime(email: string): number {
    const metadata = this.getOTPMetadata();
    if (!metadata || metadata.email !== email) {
      return 0;
    }

    const now = new Date();
    const remainingMs = metadata.expiresAt.getTime() - now.getTime();
    return Math.max(0, Math.ceil(remainingMs / 1000));
  }

  /**
   * Clear OTP metadata from localStorage
   */
  invalidateOTP(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      // Ignore localStorage errors
    }
  }

  /**
   * Check if OTP metadata exists and is valid
   */
  hasValidOTP(email: string): boolean {
    const metadata = this.getOTPMetadata();
    if (!metadata || metadata.email !== email) {
      return false;
    }

    const now = new Date();
    return now <= metadata.expiresAt;
  }

  /**
   * Get OTP attempts count from metadata
   */
  getOTPAttempts(email: string): number {
    const metadata = this.getOTPMetadata();
    if (!metadata || metadata.email !== email) {
      return 0;
    }
    return metadata.attempts;
  }

  /**
   * Check if OTP is expired based on metadata
   */
  isOTPExpired(email: string): boolean {
    const metadata = this.getOTPMetadata();
    if (!metadata || metadata.email !== email) {
      return true;
    }

    const now = new Date();
    return now > metadata.expiresAt;
  }

  /**
   * Clean up expired OTP metadata
   */
  cleanupExpiredOTPs(): void {
    const metadata = this.getOTPMetadata();
    if (metadata) {
      const now = new Date();
      if (now > metadata.expiresAt) {
        this.invalidateOTP();
      }
    }
  }
}

export const otpService = new OTPService();
