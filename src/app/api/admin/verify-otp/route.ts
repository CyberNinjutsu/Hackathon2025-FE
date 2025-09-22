import { NextRequest, NextResponse } from "next/server";

// Global OTP storage that persists across requests
// In production, use Redis or database
declare global {
  var otpStorage:
    | Map<
        string,
        {
          code: string;
          email: string;
          createdAt: Date;
          expiresAt: Date;
          attempts: number;
          isUsed: boolean;
        }
      >
    | undefined;
}

const otpStorage =
  globalThis.otpStorage ??
  new Map<
    string,
    {
      code: string;
      email: string;
      createdAt: Date;
      expiresAt: Date;
      attempts: number;
      isUsed: boolean;
    }
  >();

if (process.env.NODE_ENV !== "production") {
  globalThis.otpStorage = otpStorage;
}

// Get authorized emails from environment variable
const getAuthorizedEmails = (): string[] => {
  const emailsString = process.env.NEXT_PUBLIC_EMAIL_ACCESS;
  if (!emailsString) {
    return [];
  }
  return emailsString.split(" ").filter((email) => email.trim().length > 0);
};

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

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Get authorized emails
    const authorizedEmails = getAuthorizedEmails();

    // Check if any authorized emails are configured
    if (authorizedEmails.length === 0) {
      return NextResponse.json(
        { error: "No authorized emails configured" },
        { status: 500 }
      );
    }

    // Validate email is in the authorized list
    const normalizedEmail = email.trim().toLowerCase();
    const isAuthorized = authorizedEmails.some(
      (authorizedEmail) =>
        authorizedEmail.trim().toLowerCase() === normalizedEmail
    );

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Unauthorized email address" },
        { status: 403 }
      );
    }

    // Get stored OTP
    const key = normalizedEmail;
    const storedOTP = otpStorage.get(key);

    // Debug logging in development
    if (process.env.NODE_ENV === "development") {
      console.log("OTP Verification Debug:", {
        email: normalizedEmail,
        hasStoredOTP: !!storedOTP,
        storageSize: otpStorage.size,
        allKeys: Array.from(otpStorage.keys()),
      });
    }

    if (!storedOTP) {
      return NextResponse.json(
        { error: "No OTP found. Please request a new one." },
        { status: 400 }
      );
    }

    // Check if OTP is already used
    if (storedOTP.isUsed) {
      return NextResponse.json(
        { error: "OTP has already been used. Please request a new one." },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    const now = new Date();
    if (now > storedOTP.expiresAt) {
      otpStorage.delete(key);
      return NextResponse.json(
        { error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Increment attempt count
    storedOTP.attempts += 1;

    // Check if OTP matches
    if (storedOTP.code === otp.trim()) {
      // Mark as used and remove from storage
      otpStorage.delete(key);

      return NextResponse.json({
        success: true,
        message: "OTP verified successfully",
      });
    } else {
      const remainingAttempts = Math.max(0, 3 - storedOTP.attempts);

      if (remainingAttempts === 0) {
        otpStorage.delete(key);
        return NextResponse.json(
          {
            error: "Too many failed attempts. OTP has been invalidated.",
            remainingAttempts: 0,
          },
          { status: 400 }
        );
      }

      // Update the stored OTP with new attempt count
      otpStorage.set(key, storedOTP);

      return NextResponse.json(
        {
          error: `Invalid OTP. ${remainingAttempts} attempts remaining.`,
          remainingAttempts,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "An error occurred during OTP verification",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
