"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import LoginLayout from '@/components/admin/LoginLayout';
import LoginForm from '@/components/admin/LoginForm';
import OTPForm from '@/components/admin/OTPForm';

export default function AdminLoginPage() {
	const router = useRouter();
	const {
		isAuthenticated,
		isLoading,
		step,
		email,
		error,
		otpCountdown,
		lockoutCountdown,
		canRequestOtp,
		failedAttempts,
		submitEmail,
		verifyOTP,
		requestNewOTP,
		clearError
	} = useAdminAuth();

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			toast.success('Login successful! Redirecting to dashboard...');
			// Small delay to show the success message
			setTimeout(() => {
				router.replace('/admin');
			}, 1000);
		}
	}, [isAuthenticated, router]);

	// Handle email submission
	const handleEmailSubmit = async (emailValue: string) => {
		try {
			const result = await submitEmail(emailValue);

			if (result.success) {
				toast.success('OTP sent successfully! Check your email.');
			} else if (result.error) {
				toast.error(result.error.message);
			}
		} catch (error) {
			console.error('Email submission error:', error);
			toast.error('An unexpected error occurred. Please try again.');
		}
	};

	// Handle OTP verification
	const handleOTPVerify = async (otp: string) => {
		try {
			const result = await verifyOTP(otp);

			if (result.success) {
				toast.success('Verification successful! Welcome to admin dashboard.');
				// Navigation will be handled by the useEffect above
			} else if (result.error) {
				toast.error(result.error.message);
			}
		} catch (error) {
			console.error('OTP verification error:', error);
			toast.error('An unexpected error occurred. Please try again.');
		}
	};

	// Handle OTP resend
	const handleOTPResend = async () => {
		try {
			const result = await requestNewOTP();

			if (result.success) {
				toast.success('New OTP sent! Check your email.');
			} else if (result.error) {
				toast.error(result.error.message);
			}
		} catch (error) {
			console.error('OTP resend error:', error);
			toast.error('Failed to resend OTP. Please try again.');
		}
	};

	// Handle back to email step
	const handleBackToEmail = () => {
		clearError();
		// The step will be managed by the hook
	};

	// Don't render anything if already authenticated (will redirect)
	if (isAuthenticated) {
		return null;
	}

	// Render appropriate form based on current step
	const renderContent = () => {
		switch (step) {
			case 'email':
				return (
					<LoginForm
						onSubmit={handleEmailSubmit}
						isLoading={isLoading}
						error={error}
						lockoutCountdown={lockoutCountdown}
						onClearError={clearError}
					/>
				);

			case 'otp':
				return (
					<OTPForm
						email={email || ''}
						onVerify={handleOTPVerify}
						onResend={handleOTPResend}
						onBack={handleBackToEmail}
						isLoading={isLoading}
						error={error}
						// otpCountdown={otpCountdown}
						// canResend={canRequestOtp}
						// lockoutCountdown={lockoutCountdown}
						failedAttempts={failedAttempts}
						onClearError={clearError}
					/>
				);

			default:
				return (
					<div className="text-center py-8">
						<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
						<p className="text-gray-400">Loading...</p>
					</div>
				);
		}
	};

	const getTitle = () => {
		switch (step) {
			case 'email':
				return 'Admin Login';
			case 'otp':
				return 'Verify Identity';
			default:
				return 'Admin Access';
		}
	};

	const getSubtitle = () => {
		switch (step) {
			case 'email':
				return 'Secure access to admin dashboard';
			case 'otp':
				return 'Enter the verification code sent to your email';
			default:
				return 'Authenticating...';
		}
	};

	return (
		<LoginLayout
			title={getTitle()}
			subtitle={getSubtitle()}
			isLoading={isLoading && step === 'authenticated'}
		>
			{renderContent()}
		</LoginLayout>
	);
}