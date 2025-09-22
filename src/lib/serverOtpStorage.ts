// Global OTP storage that persists across requests
// In production, use Redis or database

interface StoredOTPData {
  code: string;
  email: string;
  createdAt: Date;
  expiresAt: Date;
  attempts: number;
  isUsed: boolean;
}

declare global {
  var otpStorage: Map<string, StoredOTPData> | undefined;
}

const otpStorage = globalThis.otpStorage ?? new Map<string, StoredOTPData>();

if (process.env.NODE_ENV !== "production") {
  globalThis.otpStorage = otpStorage;
}

// Store OTP (called from send-otp route)
export function storeOTP(email: string, otp: string): Date {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

  const key = email.toLowerCase().trim();
  otpStorage.set(key, {
    code: otp,
    email,
    createdAt: now,
    expiresAt,
    attempts: 0,
    isUsed: false,
  });

  return expiresAt;
}

// Get stored OTP
export function getStoredOTP(email: string): StoredOTPData | undefined {
  const key = email.toLowerCase().trim();
  return otpStorage.get(key);
}

// Delete stored OTP
export function deleteStoredOTP(email: string): void {
  const key = email.toLowerCase().trim();
  otpStorage.delete(key);
}

// Update stored OTP
export function updateStoredOTP(email: string, otp: StoredOTPData): void {
  const key = email.toLowerCase().trim();
  otpStorage.set(key, otp);
}

// Get storage size for debugging
export function getStorageSize(): number {
  return otpStorage.size;
}

// Get all keys for debugging
export function getStorageKeys(): string[] {
  return Array.from(otpStorage.keys());
}
