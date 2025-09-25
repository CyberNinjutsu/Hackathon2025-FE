import { useState, useEffect, useCallback } from "react";
import {
  AdminAuthState,
  LoginResult,
  VerificationResult,
  OTPRequestResult,
  AdminAuthError,
  ADMIN_EMAIL,
} from "@/types/adminAuth";
import { adminAuthService } from "@/lib/adminAuth";
import { otpService } from "@/lib/otpService";
import { rateLimiter } from "@/lib/rateLimiter";
import { emailService } from "@/lib/emailService";

export const useAdminAuth = () => {
  const [state, setState] = useState<AdminAuthState>({
    isAuthenticated: false,
    isLoading: true,
    step: "email",
    email: null,
    error: null,
    lockoutUntil: null,
    otpSentAt: null,
    failedAttempts: 0,
    canRequestOtp: true,
    nextOtpRequestAt: null,
  });

  const [otpCountdown, setOtpCountdown] = useState<number>(0);
  const [lockoutCountdown, setLockoutCountdown] = useState<number>(0);

  /**
   * Initialize authentication state
   */
  const initializeAuth = useCallback(() => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      // Check existing session
      const isAuthenticated = adminAuthService.validateSession();

      if (isAuthenticated) {
        const session = adminAuthService.getCurrentSession();
        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          step: "authenticated",
          email: session?.email || null,
          isLoading: false,
          error: null,
        }));
        return;
      }

      // Check if account is locked
      const isLocked = rateLimiter.isAccountLocked();
      const lockoutTime = rateLimiter.getRemainingLockoutTime();
      const rateLimitStatus = rateLimiter.getStatusSummary();

      console.log("Auth initialization - Rate limit status:", {
        isLocked,
        lockoutTime,
        rateLimitStatus,
      });

      setState((prev) => ({
        ...prev,
        isAuthenticated: false,
        step: "email",
        isLoading: false,
        lockoutUntil: isLocked
          ? new Date(Date.now() + lockoutTime * 1000)
          : null,
      }));

      if (isLocked) {
        setLockoutCountdown(lockoutTime);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Failed to initialize authentication",
      }));
    }
  }, []);

  /**
   * Submit email for authentication
   */
  const submitEmail = useCallback(
    async (email: string): Promise<LoginResult> => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Validate email
        if (!adminAuthService.validateEmail(email)) {
          const result: LoginResult = {
            success: false,
            error: {
              type: AdminAuthError.INVALID_EMAIL,
              message:
                "Invalid email address. Only authorized admin email is allowed.",
              canRetry: true,
            },
          };

          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: result.error?.message || "Invalid email",
          }));

          return result;
        }

        // Check rate limiting
        const canRequest = rateLimiter.canRequestOTP(email);
        console.log("Rate limit check result:", {
          canRequest,
          email,
          rateLimitStatus: rateLimiter.getStatusSummary(),
        });

        if (!canRequest) {
          const isLocked = rateLimiter.isAccountLocked();
          const waitTime = isLocked
            ? rateLimiter.getRemainingLockoutTime()
            : rateLimiter.getRemainingWaitTime(email);

          console.log("OTP request blocked:", {
            isLocked,
            waitTime,
            rateLimitData: rateLimiter.getStatusSummary(),
          });

          const result: LoginResult = {
            success: false,
            error: {
              type: isLocked
                ? AdminAuthError.ACCOUNT_LOCKED
                : AdminAuthError.RATE_LIMITED,
              message: isLocked
                ? `Account is locked. Try again in ${Math.ceil(
                  waitTime / 60
                )} minutes.`
                : `Please wait ${waitTime} seconds before requesting another OTP.`,
              remainingTime: waitTime,
              canRetry: false,
            },
          };

          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: result.error?.message || "Rate limited",
            lockoutUntil: isLocked
              ? new Date(Date.now() + waitTime * 1000)
              : null,
          }));

          if (isLocked) {
            setLockoutCountdown(waitTime);
          }

          return result;
        }

        // Send OTP request (OTP generated server-side)
        const emailResult = await emailService.sendOTP(email);

        if (!emailResult.success) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: emailResult.error?.message || "Failed to send OTP",
          }));
          return {
            success: false,
            error: emailResult.error,
          };
        }

        // Store OTP metadata in localStorage for tracking
        const expiresAt = otpService.storeOTPMetadata(email);

        // Record the OTP request
        rateLimiter.recordOTPRequest(email);

        const now = new Date();
        const nextRequestAt = new Date(now.getTime() + 60 * 1000); // 1 minute cooldown

        setState((prev) => ({
          ...prev,
          isLoading: false,
          step: "otp",
          email,
          error: null,
          otpSentAt: now,
          nextOtpRequestAt: nextRequestAt,
          canRequestOtp: false,
        }));

        // Start OTP expiry countdown based on actual expiration time
        const expiryTime = Math.floor(
          (expiresAt.getTime() - now.getTime()) / 1000
        );
        setOtpCountdown(expiryTime);

        return {
          success: true,
          canRequestOtp: false,
          nextRequestAt,
        };
      } catch (error) {
        console.error("Email submission error:", error);
        const errorMessage = "An error occurred. Please try again.";

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        return {
          success: false,
          error: {
            type: AdminAuthError.EMAIL_SEND_FAILED,
            message: errorMessage,
            canRetry: true,
          },
        };
      }
    },
    []
  );

  /**
   * Verify OTP code
   */
  const verifyOTP = useCallback(
    async (otp: string): Promise<VerificationResult> => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        if (!state.email) {
          const result: VerificationResult = {
            success: false,
            error: {
              type: AdminAuthError.INVALID_EMAIL,
              message: "Email not found. Please start over.",
              canRetry: false,
            },
          };

          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: result.error?.message || "Email not found",
            step: "email",
          }));

          return result;
        }

        // Validate OTP server-side
        const validation = await otpService.validateOTP(state.email, otp);

        if (!validation.isValid) {
          // Record failed attempt
          rateLimiter.recordFailedAttempt(state.email);

          const failedAttempts = rateLimiter.getCurrentFailedAttempts();
          const isNowLocked = rateLimiter.isAccountLocked();

          if (isNowLocked) {
            const lockoutTime = rateLimiter.getRemainingLockoutTime();

            setState((prev) => ({
              ...prev,
              isLoading: false,
              error: `Too many failed attempts. Account locked for ${Math.ceil(
                lockoutTime / 60
              )} minutes.`,
              lockoutUntil: new Date(Date.now() + lockoutTime * 1000),
              step: "email",
            }));

            setLockoutCountdown(lockoutTime);
            otpService.invalidateOTP(); // Clear current OTP
          } else {
            setState((prev) => ({
              ...prev,
              isLoading: false,
              error: validation.error || "Invalid OTP",
              failedAttempts,
            }));
          }

          return {
            success: false,
            error: {
              type: AdminAuthError.OTP_INVALID,
              message: validation.error || "Invalid OTP",
              canRetry: !isNowLocked,
            },
            remainingAttempts: validation.remainingAttempts,
          };
        }

        // OTP is valid - create session
        const sessionToken = adminAuthService.createSession(state.email);

        // Reset rate limiting counters
        rateLimiter.resetFailedAttempts();

        // Clear OTP
        otpService.invalidateOTP();

        setState((prev) => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false,
          step: "authenticated",
          error: null,
          failedAttempts: 0,
          lockoutUntil: null,
        }));

        return {
          success: true,
          sessionToken,
        };
      } catch (error) {
        console.error("OTP verification error:", error);
        const errorMessage =
          "An error occurred during verification. Please try again.";

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        return {
          success: false,
          error: {
            type: AdminAuthError.OTP_INVALID,
            message: errorMessage,
            canRetry: true,
          },
        };
      }
    },
    [state.email]
  );

  /**
   * Request new OTP
   */
  const requestNewOTP = useCallback(async (): Promise<OTPRequestResult> => {
    if (!state.email) {
      return {
        success: false,
        error: {
          type: AdminAuthError.INVALID_EMAIL,
          message: "Email not found. Please start over.",
          canRetry: false,
        },
      };
    }

    return await submitEmail(state.email);
  }, [state.email, submitEmail]);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    adminAuthService.destroySession();
    otpService.invalidateOTP();

    setState({
      isAuthenticated: false,
      isLoading: false,
      step: "email",
      email: null,
      error: null,
      lockoutUntil: null,
      otpSentAt: null,
      failedAttempts: 0,
      canRequestOtp: true,
      nextOtpRequestAt: null,
    });

    setOtpCountdown(0);
    setLockoutCountdown(0);
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Handle countdowns
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (otpCountdown > 0) {
      interval = setInterval(() => {
        setOtpCountdown((prev) => {
          if (prev <= 1) {
            setState((current) => ({
              ...current,
              canRequestOtp: true,
              error: "OTP has expired. Please request a new one.",
            }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpCountdown]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (lockoutCountdown > 0) {
      interval = setInterval(() => {
        setLockoutCountdown((prev) => {
          if (prev <= 1) {
            setState((current) => ({
              ...current,
              lockoutUntil: null,
              canRequestOtp: true,
              error: null,
            }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [lockoutCountdown]);

  // Update canRequestOtp based on cooldown
  useEffect(() => {
    if (state.nextOtpRequestAt && !state.canRequestOtp) {
      const checkCooldown = () => {
        const now = new Date();
        if (now >= state.nextOtpRequestAt!) {
          setState((prev) => ({ ...prev, canRequestOtp: true }));
        }
      };

      const interval = setInterval(checkCooldown, 1000);
      return () => clearInterval(interval);
    }
  }, [state.nextOtpRequestAt, state.canRequestOtp]);

  return {
    // State
    ...state,
    otpCountdown,
    lockoutCountdown,

    // Actions
    submitEmail,
    verifyOTP,
    requestNewOTP,
    logout,
    clearError,

    // Utilities
    isValidEmail: (email: string) => adminAuthService.validateEmail(email),
    getRateLimitStatus: () => rateLimiter.getStatusSummary(),
  };
};
