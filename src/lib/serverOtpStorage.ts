// Stateless OTP system for Vercel serverless environment
// Uses signed tokens that are passed between client and server

import crypto from "crypto";

interface StoredOTPData {
  code: string;
  email: string;
  createdAt: Date;
  expiresAt: Date;
  attempts: number;
  isUsed: boolean;
}

// Get secret key for signing
function getSecretKey(): string {
  return (
    process.env.OTP_SECRET_KEY || "default-secret-key-change-in-production"
  );
}

// Create a signed verification token
export function createVerificationToken(
  email: string,
  otp: string,
  expiresAt: Date
): string {
  const payload = {
    email: email.toLowerCase().trim(),
    otp,
    expiresAt: expiresAt.getTime(),
    createdAt: Date.now(),
  };

  const payloadString = JSON.stringify(payload);
  const signature = crypto
    .createHmac("sha256", getSecretKey())
    .update(payloadString)
    .digest("hex");

  return Buffer.from(
    JSON.stringify({ payload: payloadString, signature })
  ).toString("base64");
}

// Verify OTP against a signed token
export function verifyOTPWithToken(
  token: string,
  inputOtp: string,
  email: string
): {
  isValid: boolean;
  error?: string;
  expired?: boolean;
} {
  try {
    const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf8"));
    const { payload: payloadString, signature } = decoded;

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", getSecretKey())
      .update(payloadString)
      .digest("hex");

    if (signature !== expectedSignature) {
      return { isValid: false, error: "Invalid verification token" };
    }

    const payload = JSON.parse(payloadString);

    // Check if email matches
    if (payload.email !== email.toLowerCase().trim()) {
      return { isValid: false, error: "Email mismatch" };
    }

    // Check expiration
    if (Date.now() > payload.expiresAt) {
      return { isValid: false, error: "OTP has expired", expired: true };
    }

    // Check OTP
    if (payload.otp !== inputOtp.trim()) {
      return { isValid: false, error: "Invalid OTP code" };
    }

    return { isValid: true };
  } catch (error) {
    console.warn("Token verification error:", error);
    return { isValid: false, error: "Invalid verification token" };
  }
}

// Legacy functions for compatibility (now use in-memory storage as fallback)
const memoryStorage = new Map<string, StoredOTPData>();

export function storeOTP(email: string, otp: string): Date {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
  const key = email.toLowerCase().trim();

  const data: StoredOTPData = {
    code: otp,
    email,
    createdAt: now,
    expiresAt,
    attempts: 0,
    isUsed: false,
  };

  memoryStorage.set(key, data);

  console.log(`OTP stored for ${key}:`, {
    otp,
    expiresAt: expiresAt.toISOString(),
    environment: process.env.NODE_ENV,
  });

  return expiresAt;
}

export function getStoredOTP(email: string): StoredOTPData | undefined {
  const key = email.toLowerCase().trim();
  const data = memoryStorage.get(key);

  if (!data) {
    console.log(
      `No OTP found for ${key}. Available keys:`,
      Array.from(memoryStorage.keys())
    );
    return undefined;
  }

  // Check expiration
  if (new Date() > data.expiresAt) {
    memoryStorage.delete(key);
    console.log(`Expired OTP removed for ${key}`);
    return undefined;
  }

  console.log(`OTP found for ${key}:`, {
    code: data.code,
    expiresAt: data.expiresAt.toISOString(),
    attempts: data.attempts,
  });

  return data;
}

export function deleteStoredOTP(email: string): void {
  const key = email.toLowerCase().trim();
  memoryStorage.delete(key);
  console.log(`OTP deleted for ${key}`);
}

export function updateStoredOTP(email: string, data: StoredOTPData): void {
  const key = email.toLowerCase().trim();
  memoryStorage.set(key, data);
  console.log(`OTP updated for ${key}`);
}

export function getStorageSize(): number {
  // Clean up expired entries
  const now = new Date();
  const expiredKeys: string[] = [];

  for (const [key, data] of memoryStorage.entries()) {
    if (now > data.expiresAt) {
      expiredKeys.push(key);
    }
  }

  expiredKeys.forEach((key) => memoryStorage.delete(key));

  return memoryStorage.size;
}

export function getStorageKeys(): string[] {
  return Array.from(memoryStorage.keys());
}
