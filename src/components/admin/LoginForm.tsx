"use client";

import { useState, FormEvent } from "react";
import { Mail, ArrowRight, AlertCircle, Clock } from "lucide-react";
import { ADMIN_EMAIL } from "@/types/adminAuth";

interface LoginFormProps {
  onSubmit: (email: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  lockoutCountdown?: number;
  onClearError?: () => void;
}

export default function LoginForm({
  onSubmit,
  isLoading = false,
  error,
  lockoutCountdown = 0,
  onClearError,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const isValidEmail = ADMIN_EMAIL.includes(email.trim().toLowerCase());
  const showValidation = touched && email && !isValidEmail;
  const isLocked = lockoutCountdown > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isLoading || isLocked || !isValidEmail) {
      return;
    }

    await onSubmit(email.trim());
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (error && onClearError) {
      onClearError();
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300"
        >
          Admin Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Enter your admin email"
            disabled={isLoading || isLocked}
            className={`
              block w-full pl-10 pr-4 py-3 
              bg-gray-800/50 border rounded-lg 
              text-white placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
              ${
                showValidation || error
                  ? "border-red-500 focus:ring-red-500/50"
                  : "border-gray-700 hover:border-gray-600"
              }
            `}
          />
        </div>

        {/* Email Validation */}
        {showValidation && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Only authorized admin email is allowed</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Lockout Notice */}
      {isLocked && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-400">
            <Clock className="w-5 h-5 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-medium">Account Temporarily Locked</div>
              <div className="mt-1">
                Try again in:{" "}
                <span className="font-mono">
                  {formatTime(lockoutCountdown)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || isLocked || !isValidEmail}
        className={`
          w-full flex items-center justify-center gap-2 py-3 px-4 
          rounded-lg font-medium transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-primary/50
          ${
            isLoading || isLocked || !isValidEmail
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary hover:scale-105"
          }
        `}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Sending OTP...</span>
          </>
        ) : isLocked ? (
          <>
            <Clock className="w-5 h-5" />
            <span>Account Locked</span>
          </>
        ) : (
          <>
            <span>Send OTP Code</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      {/* Help Text */}
      <div className="text-center text-sm text-gray-500">
        <p>An OTP will be sent to your email for verification</p>
      </div>
    </form>
  );
}
