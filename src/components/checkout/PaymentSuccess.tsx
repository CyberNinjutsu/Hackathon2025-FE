import { PaymentSuccessProps } from "@/utils/Types";
import React from 'react';
import Link from 'next/link';
import { CheckCircle, Home } from 'lucide-react';
import BackgroundGlow from "../Glow/BackgroundGlow";

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
	orderId = "ORD-2024-001",
	orderTotal = 1250000,
	customerEmail = "customer@example.com",
	estimatedDelivery = "3-5 business days"
}) => {
	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-8">
			<BackgroundGlow />
			{/* Container notification */}
			<div className="max-w-md w-full rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-[0_0_30px_rgba(59,130,246,0.3)] px-6 py-8">
				{/* Success Animation Container */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
						<CheckCircle className="w-12 h-12 text-green-500" />
					</div>

					{/* Main Success Message */}
					<h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
						Payment Successful!
					</h1>
					<p className="text-white text-sm md:text-base">
						Thank you for trusting and shopping with us.
					</p>
				</div>

				{/* Status Message */}
				<div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
					<div className="flex items-start">
						<div className="flex-shrink-0">
							<CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
						</div>
						<div className="ml-3">
							<p className="text-sm text-blue-800">
								<span className="font-medium">Your order is being processed</span>
							</p>
							<p className="text-xs text-blue-600 mt-1">
								We will send you a confirmation email and shipping details as soon as possible.
							</p>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="space-y-3">
					{/* Back to Home Button */}
					<Link href="/" className="block">
						<button className="w-full bg-white text-black font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center">
							<Home className="w-5 h-5 mr-2" />
							Back to Home
						</button>
					</Link>
				</div>

				{/* Additional Info */}
				<div className="text-center mt-6 text-xs text-gray-500">
					<p>You can track your order status via email or</p>
					<Link href="/contact" className="text-blue-600 hover:text-blue-700 underline">
						contact us
					</Link>
				</div>
			</div>
		</div>
	);
};

export default PaymentSuccess;
