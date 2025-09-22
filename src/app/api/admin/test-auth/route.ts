import { NextRequest, NextResponse } from "next/server";

// Global OTP storage declaration for debugging
declare global {
  var otpStorage: Map<string, any> | undefined;
}

// Get authorized emails from environment variable
const getAuthorizedEmails = (): string[] => {
  const emailsString = process.env.NEXT_PUBLIC_EMAIL_ACCESS;
  if (!emailsString) {
    return [];
  }
  return emailsString.split(" ").filter((email) => email.trim().length > 0);
};

export async function GET() {
  try {
    const authorizedEmails = getAuthorizedEmails();

    // Access the global OTP storage for debugging
    const otpStorageSize = globalThis.otpStorage?.size || 0;
    const otpKeys = globalThis.otpStorage
      ? Array.from(globalThis.otpStorage.keys())
      : [];

    return NextResponse.json({
      success: true,
      authorizedEmails,
      count: authorizedEmails.length,
      smtpConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
      debug: {
        otpStorageSize,
        otpKeys,
        nodeEnv: process.env.NODE_ENV,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to get auth configuration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const authorizedEmails = getAuthorizedEmails();
    const normalizedEmail = email.trim().toLowerCase();
    const isAuthorized = authorizedEmails.some(
      (authorizedEmail) =>
        authorizedEmail.trim().toLowerCase() === normalizedEmail
    );

    return NextResponse.json({
      email: normalizedEmail,
      isAuthorized,
      authorizedEmails,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to validate email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
