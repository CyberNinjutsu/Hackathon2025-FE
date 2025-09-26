"use client";

import { useState } from 'react';
import { Loader2, Lock, ArrowRight, CheckCircle } from 'lucide-react';

interface CheckoutButtonProps {
	onCheckout: () => Promise<void>;
	disabled?: boolean;
	isLoading?: boolean;
	totalAmount: number;
	tokenSymbol: string;
}

export default function CheckoutButton({
	onCheckout,
	disabled = false,
	isLoading = false,
	totalAmount,
	tokenSymbol
}: CheckoutButtonProps) {
	const [isProcessing, setIsProcessing] = useState(false);

	const handleClick = async () => {
		if (disabled || isLoading || isProcessing) return;

		setIsProcessing(true);
		try {
			await onCheckout();
		} finally {
			setIsProcessing(false);
		}
	};

	const buttonDisabled = disabled || isLoading || isProcessing;

	return (
		<div className="space-y-4">
			{/* Main Checkout Button */}
			<button
				onClick={handleClick}
				disabled={buttonDisabled}
				className={`
          w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform
          ${buttonDisabled
						? 'bg-gray-800 text-gray-500 cursor-not-allowed'
						: 'bg-gradient-to-r from-primary to-cyan-400 hover:from-primary/90 hover:to-cyan-400/90 text-black hover:scale-[1.02] active:scale-[0.98]'
					}
          flex items-center justify-center gap-3
        `}
			>
				{isProcessing ? (
					<>
						<Loader2 className="w-6 h-6 animate-spin" />
						Processing Payment...
					</>
				) : isLoading ? (
					<>
						<Loader2 className="w-6 h-6 animate-spin" />
						Loading...
					</>
				) : (
					<>
						<Lock className="w-5 h-5" />
						Pay {totalAmount.toLocaleString()} {tokenSymbol}
						<ArrowRight className="w-5 h-5" />
					</>
				)}
			</button>
		</div>
	);
}