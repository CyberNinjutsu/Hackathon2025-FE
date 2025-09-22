"use client";

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from 'react';
import { Shield, RefreshCw, ArrowLeft, AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface OTPFormProps {
	email: string;
	onVerify: (otp: string) => Promise<void>;
	onResend: () => Promise<void>;
	onBack: () => void;
	isLoading?: boolean;
	error?: string | null;
	otpCountdown?: number;
	canResend?: boolean;
	lockoutCountdown?: number;
	failedAttempts?: number;
	onClearError?: () => void;
}

export default function OTPForm({
	email,
	onVerify,
	onResend,
	onBack,
	isLoading = false,
	error,
	otpCountdown = 1,
	canResend = false,
	lockoutCountdown = 1,
	failedAttempts = 1,
	onClearError
}: OTPFormProps) {
	const [otp, setOtp] = useState(['', '', '', '', '', '']);
	const [isResending, setIsResending] = useState(false);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const isLocked = lockoutCountdown > 0;
	const otpValue = otp.join('');
	const isComplete = otpValue.length === 6;
	const maxAttempts = 3;
	const remainingAttempts = maxAttempts - failedAttempts;

	// Focus first input on mount
	useEffect(() => {
		if (inputRefs.current[0]) {
			inputRefs.current[0].focus();
		}
	}, []);

	const handleInputChange = (index: number, value: string) => {
		// Only allow digits
		if (value && !/^\d$/.test(value)) {
			return;
		}

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		// Clear error when user starts typing
		if (error && onClearError) {
			onClearError();
		}

		// Auto-focus next input
		if (value && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Backspace') {
			if (!otp[index] && index > 0) {
				// If current input is empty, focus previous input
				inputRefs.current[index - 1]?.focus();
			} else {
				// Clear current input
				const newOtp = [...otp];
				newOtp[index] = '';
				setOtp(newOtp);
			}
		} else if (e.key === 'ArrowLeft' && index > 0) {
			inputRefs.current[index - 1]?.focus();
		} else if (e.key === 'ArrowRight' && index < 5) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

		if (pastedData.length > 0) {
			const newOtp = Array(6).fill('');
			for (let i = 0; i < pastedData.length; i++) {
				newOtp[i] = pastedData[i];
			}
			setOtp(newOtp);

			// Focus the next empty input or the last input
			const nextIndex = Math.min(pastedData.length, 5);
			inputRefs.current[nextIndex]?.focus();
		}
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (isLoading || isLocked || !isComplete) {
			return;
		}

		await onVerify(otpValue);
	};

	const handleResend = async () => {
		if (isResending || !canResend || isLocked) {
			return;
		}

		setIsResending(true);
		setOtp(['', '', '', '', '', '']);

		try {
			await onResend();
		} finally {
			setIsResending(false);
		}
	};

	const formatTime = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Header */}
			<div className="text-center space-y-2">
				<div className="inline-flex items-center justify-center w-12 h-12 bg-primary/20 border border-primary/30 rounded-lg mb-4">
					<Shield className="w-6 h-6 text-primary" />
				</div>
				<h2 className="text-xl font-semibold text-white">Enter Verification Code</h2>
				<p className="text-gray-400 text-sm">
					We&apos;ve sent a 6-digit code to <span className="text-primary font-medium">{email}</span>
				</p>
			</div>

			{/* OTP Input */}
			<div className="space-y-4">
				<div className="flex justify-center gap-3">
					{otp.map((digit, index) => (
						<input
							key={index}
							ref={(el) => { inputRefs.current[index] = el; }}
							type="text"
							inputMode="numeric"
							maxLength={1}
							value={digit}
							onChange={(e) => handleInputChange(index, e.target.value)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							onPaste={handlePaste}
							disabled={isLoading || isLocked}
							className={`
                w-12 h-12 text-center text-xl font-bold
                bg-gray-800/50 border rounded-lg
                text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300
                ${error
									? 'border-red-500 focus:ring-red-500/50'
									: 'border-gray-700 hover:border-gray-600'
								}
              `}
						/>
					))}
				</div>

				{/* OTP Timer */}
				{otpCountdown > 0 && (
					<div className="text-center">
						<div className="inline-flex items-center gap-2 text-sm text-gray-400">
							<Clock className="w-4 h-4" />
							<span>Code expires in: <span className="font-mono text-primary">{formatTime(otpCountdown)}</span></span>
						</div>
					</div>
				)}
			</div>

			{/* Error Message */}
			{error && (
				<div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
					<div className="flex items-center gap-2 text-red-400">
						<AlertCircle className="w-5 h-5 flex-shrink-0" />
						<div className="text-sm">
							<div>{error}</div>
							{remainingAttempts > 0 && failedAttempts > 0 && (
								<div className="mt-1 text-red-300">
									{remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining
								</div>
							)}
						</div>
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
								Too many failed attempts. Try again in: <span className="font-mono">{formatTime(lockoutCountdown)}</span>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Success Indicator */}
			{isComplete && !error && !isLocked && (
				<div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
					<div className="flex items-center gap-2 text-green-400">
						<CheckCircle className="w-5 h-5" />
						<span className="text-sm">Code entered successfully</span>
					</div>
				</div>
			)}

			{/* Action Buttons */}
			<div className="space-y-3">
				{/* Verify Button */}
				<button
					type="submit"
					disabled={isLoading || isLocked || !isComplete}
					className={`
            w-full flex items-center justify-center gap-2 py-3 px-4 
            rounded-lg font-medium transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-primary/50
            ${isLoading || isLocked || !isComplete
							? 'bg-gray-700 text-gray-400 cursor-not-allowed'
							: 'bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary hover:scale-105'
						}
          `}
				>
					{isLoading ? (
						<>
							<div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
							<span>Verifying...</span>
						</>
					) : (
						<>
							<Shield className="w-5 h-5" />
							<span>Verify Code</span>
						</>
					)}
				</button>

				{/* Resend Button */}
				<button
					type="button"
					onClick={handleResend}
					disabled={isResending || !canResend || isLocked}
					className={`
            w-full flex items-center justify-center gap-2 py-2 px-4 
            rounded-lg font-medium transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-gray-500/50
            ${isResending || !canResend || isLocked
							? 'bg-gray-800 text-gray-500 cursor-not-allowed'
							: 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
						}
          `}
				>
					{isResending ? (
						<>
							<div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
							<span>Sending...</span>
						</>
					) : (
						<>
							<RefreshCw className="w-4 h-4" />
							<span>{canResend ? 'Resend Code' : 'Resend Available Soon'}</span>
						</>
					)}
				</button>

				{/* Back Button */}
				<button
					type="button"
					onClick={onBack}
					disabled={isLoading || isResending}
					className="w-full flex items-center justify-center gap-2 py-2 px-4 text-gray-400 hover:text-white transition-colors duration-300 disabled:opacity-50"
				>
					<ArrowLeft className="w-4 h-4" />
					<span>Back to Email</span>
				</button>
			</div>

			{/* Help Text */}
			<div className="text-center text-xs text-gray-500 space-y-1">
				<p>Didn&apos;t receive the code? Check your spam folder</p>
				<p>Code expires in 5 minutes</p>
			</div>
		</form>
	);
}