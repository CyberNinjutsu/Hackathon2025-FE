import { NextRequest, NextResponse } from "next/server";
import {
  getStoredOTP,
  deleteStoredOTP,
  updateStoredOTP,
} from "@/lib/serverOtpStorage";

// Get authorized emails from environment variable
const getAuthorizedEmails = (): string[] => {
  const emailsString = process.env.NEXT_PUBLIC_EMAIL_ACCESS;
  if (!emailsString) {
    return [];
  }
  return emailsString.split(" ").filter((email) => email.trim().length > 0);
};

export async function POST(request: NextRequest) {
  try {
    const { email, otp, verificationToken } = await request.json();

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // If we have a verification token, use token-based verification
    if (verificationToken) {
      const { verifyOTPWithToken } = await import("@/lib/serverOtpStorage");
      const result = verifyOTPWithToken(verificationToken, otp, email);

      console.log("Token-based OTP verification:", {
        email: email.trim().toLowerCase(),
        inputOtp: otp.trim(),
        isValid: result.isValid,
        error: result.error,
        expired: result.expired,
      });

      if (!result.isValid) {
        return NextResponse.json(
          {
            error: result.error || "Invalid OTP",
            expired: result.expired,
          },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "OTP verified successfully",
      });
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
    const storedOTP = getStoredOTP(normalizedEmail);

    // Debug logging in development and production for troubleshooting
    console.log("OTP Verification Debug:", {
      email: normalizedEmail,
      inputOtp: otp.trim(),
      hasStoredOTP: !!storedOTP,
      environment: process.env.NODE_ENV,
    });

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
      deleteStoredOTP(normalizedEmail);
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
      deleteStoredOTP(normalizedEmail);

      return NextResponse.json({
        success: true,
        message: "OTP verified successfully",
      });
    } else {
      const remainingAttempts = Math.max(0, 3 - storedOTP.attempts);

      if (remainingAttempts === 0) {
        deleteStoredOTP(normalizedEmail);
        return NextResponse.json(
          {
            error: "Too many failed attempts. OTP has been invalidated.",
            remainingAttempts: 0,
          },
          { status: 400 }
        );
      }

      // Update the stored OTP with new attempt count
      updateStoredOTP(normalizedEmail, storedOTP);

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
