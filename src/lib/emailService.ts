import { OTPRequestResult, AdminAuthError } from '@/types/adminAuth';

class EmailService {
  /**
   * Send OTP via email using API route
   */
  async sendOTP(email: string, otp: string): Promise<OTPRequestResult> {
    try {
      const response = await fetch('/api/admin/send-otp', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Email sending failed');
      }

      const now = new Date();
      const expiresAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
      const canResendAt = new Date(now.getTime() + 1 * 60 * 1000); // 1 minute

      return {
        success: true,
        sentAt: now,
        expiresAt,
        canResendAt
      };
    } catch (error) {
      console.error('Email sending error:', error);
      
      return {
        success: false,
        error: {
          type: AdminAuthError.EMAIL_SEND_FAILED,
          message: error instanceof Error ? error.message : 'Failed to send OTP email. Please try again.',
          canRetry: true
        }
      };
    }
  }

  /**
   * Generate HTML email template for OTP
   */
  private generateOTPEmailTemplate(otp: string): string {
    return `
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
  }

  /**
   * Validate email format (basic validation)
   */
  isValidEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get email service status
   */
  getServiceStatus(): { available: boolean; provider: string } {
    // In development, always return available
    // In production, this could check the actual email service status
    return {
      available: true,
      provider: 'Mock Service (Development)'
    };
  }
}

export const emailService = new EmailService();