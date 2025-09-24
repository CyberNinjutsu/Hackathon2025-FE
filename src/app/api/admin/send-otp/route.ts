import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { storeOTP } from "@/lib/serverOtpStorage";

// Get authorized emails from environment variable
const getAuthorizedEmails = (): string[] => {
  const emailsString = process.env.NEXT_PUBLIC_EMAIL_ACCESS;
  if (!emailsString) {
    return [];
  }
  return emailsString.split(" ").filter((email) => email.trim().length > 0);
};

// Email configuration
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

// Generate a secure 6-digit OTP
const generateOTP = (): string => {
  const array = new Uint8Array(3);
  crypto.getRandomValues(array);
  const num = (array[0] << 16) | (array[1] << 8) | array[2];
  return ((num % 900000) + 100000).toString();
};

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate input
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Generate OTP server-side
    const otp = generateOTP();

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

    // Store OTP server-side
    const expiresAt = storeOTP(email, otp);

    // Debug logging in development
    if (process.env.NODE_ENV === "development") {
      console.log("OTP Generation Debug:", {
        email: normalizedEmail,
        otp,
        expiresAt: expiresAt.toISOString(),
      });
    }

    // Check if email configuration is available
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      // In development mode, return the OTP for testing
      return NextResponse.json({
        success: true,
        message: "OTP sent successfully (development mode)",
        sentAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        // Include OTP in development for testing
        ...(process.env.NODE_ENV === "development" && { otp }),
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport(EMAIL_CONFIG);

    // Verify connection
    await transporter.verify();

    // Email HTML template
    const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login - OTP Verification</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #00ffb2;
            margin-bottom: 10px;
        }
        .title {
            font-size: 20px;
            color: #333;
            margin-bottom: 10px;
        }
        .otp-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            margin: 30px 0;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            margin: 10px 0;
            font-family: 'Courier New', monospace;
        }
        .otp-label {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 10px;
        }
        .expiry-info {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            text-align: center;
        }
        .security-notice {
            background: #f8f9fa;
            border-left: 4px solid #00ffb2;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🔐 Admin Portal</div>
            <h1 class="title">Login Verification Code</h1>
            <p>Your one-time password for admin access</p>
        </div>

        <div class="otp-container">
            <div class="otp-label">Your OTP Code</div>
            <div class="otp-code">${otp}</div>
            <div style="font-size: 14px; opacity: 0.9;">Enter this code to complete your login</div>
        </div>

        <div class="expiry-info">
            <strong>⏰ This code expires in 5 minutes</strong><br>
            Please use it immediately to access the admin dashboard.
        </div>

        <div class="security-notice">
            <strong>🛡️ Security Notice:</strong><br>
            • This code is for admin access only<br>
            • Never share this code with anyone<br>
            • If you didn't request this code, please ignore this email<br>
            • The code can only be used once
        </div>

        <div class="footer">
            <p>This is an automated message for admin authentication.</p>
            <p>If you have any issues, please contact the system administrator.</p>
        </div>
    </div>
</body>
</html>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"Admin Portal" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Admin Login - OTP Verification Code",
      html: htmlTemplate,
    });

    console.log("Email sent successfully:", info.messageId);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
      sentAt: new Date().toISOString(),
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Email sending error:", error);

    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
