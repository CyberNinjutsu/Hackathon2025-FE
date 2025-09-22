// Admin Authentication Types

export interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  step: 'email' | 'otp' | 'authenticated';
  email: string | null;
  error: string | null;
  lockoutUntil: Date | null;
  otpSentAt: Date | null;
  failedAttempts: number;
  canRequestOtp: boolean;
  nextOtpRequestAt: Date | null;
}

export interface OTPState {
  code: string;
  expiresAt: Date;
  attempts: number;
  isValid: boolean;
}

export interface RateLimitState {
  otpRequests: number;
  lastOtpRequest: string | null;
  failedOtpAttempts: number;
  lockoutUntil: string | null;
}

export interface AdminSession {
  token: string;
  email: string;
  createdAt: Date;
  expiresAt: Date;
  isValid: boolean;
}

export interface StoredOTP {
  code: string;
  email: string;
  createdAt: Date;
  expiresAt: Date;
  attempts: number;
  isUsed: boolean;
}

export interface AdminAuthStorage {
  sessionToken?: string;
  email?: string;
  lockoutUntil?: string;
  otpRequestCount?: number;
  lastOtpRequest?: string;
  failedAttempts?: number;
}

export enum AdminAuthError {
  INVALID_EMAIL = 'INVALID_EMAIL',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  OTP_EXPIRED = 'OTP_EXPIRED',
  OTP_INVALID = 'OTP_INVALID',
  RATE_LIMITED = 'RATE_LIMITED',
  EMAIL_SEND_FAILED = 'EMAIL_SEND_FAILED',
  SESSION_EXPIRED = 'SESSION_EXPIRED'
}

export interface AuthError {
  type: AdminAuthError;
  message: string;
  remainingTime?: number;
  canRetry?: boolean;
}

export interface LoginResult {
  success: boolean;
  error?: AuthError;
  canRequestOtp?: boolean;
  nextRequestAt?: Date;
}

export interface VerificationResult {
  success: boolean;
  error?: AuthError;
  sessionToken?: string;
  remainingAttempts?: number;
}

export interface OTPRequestResult {
  success: boolean;
  error?: AuthError;
  sentAt?: Date;
  expiresAt?: Date;
  canResendAt?: Date;
}

// Constants
export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_EMAIL_ACCESS
  ? process.env.NEXT_PUBLIC_EMAIL_ACCESS.split(" ").filter(Boolean)
  : [];;
export const OTP_EXPIRY_MINUTES = 5;
export const OTP_REQUEST_COOLDOWN_MINUTES = 1;
export const MAX_OTP_REQUESTS_PER_HOUR = 3;
export const MAX_FAILED_ATTEMPTS = 3;
export const LOCKOUT_DURATION_HOURS = 1;
export const SESSION_DURATION_HOURS = 24;