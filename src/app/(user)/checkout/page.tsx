"use client";

import CheckoutButton from "@/components/checkout/CheckoutButton";
import OrderSummary from "@/components/checkout/OrderSummary";
import ProductCard, { Product } from "@/components/checkout/ProductCard";
import { useAuth } from "@/lib/AuthContext";
import { PublicKey, Connection, Transaction } from "@solana/web3.js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Interface cho đối tượng provider của ví
interface SolanaProvider {
	isPhantom?: boolean;
	publicKey?: { toBytes: () => Uint8Array; toString: () => string };
	isConnected?: boolean;
	signTransaction: (transaction: Transaction) => Promise<Transaction>;
	signMessage: (
		message: Uint8Array,
		display: "utf8" | "hex"
	) => Promise<{ signature: Uint8Array }>;
	connect: (options?: {
		onlyIfTrusted: boolean;
	}) => Promise<{ publicKey: PublicKey }>;
}

declare global {
	interface Window {
		solana?: SolanaProvider;
		phantom?: {
			solana?: SolanaProvider;
		};
	}
}

// Sample products data
const sampleProducts: Product[] = [
	{
		id: "1",
		name: "Gold Token (GOLD)",
		description: "Digital representation of physical gold",
		price: 100,
		image: "/api/placeholder/400/300",
		category: "Precious Metals",
		quantity: 2,
		tokenSymbol: "GOLD",
	},
	{
		id: "2",
		name: "Real Estate Token (RET)",
		description: "Tokenized commercial real estate",
		price: 500,
		image: "/api/placeholder/400/300",
		category: "Real Estate",
		quantity: 1,
		tokenSymbol: "RET",
	},
	{
		id: "3",
		name: "Diamond Token (DMD)",
		description: "Certified diamond-backed tokens",
		price: 250,
		image: "/api/placeholder/400/300",
		category: "Gemstones",
		quantity: 3,
		tokenSymbol: "DMD",
	},
];

export default function CheckoutPage() {
	const router = useRouter();
	const [wallet, setWallet] = useState<SolanaProvider | null>(null);
	const [products, setProducts] = useState<Product[]>(sampleProducts);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { publicKey } = useAuth();

	useEffect(() => {
		if (typeof window !== "undefined" && window.phantom?.solana) {
			setWallet(window.phantom.solana);
		}
	}, []);

	const checkoutFunc = async () => {
		if (products.length === 0) {
			toast.error("Your cart is empty");
			return;
		}

		try {
			setIsLoading(true);

			// 1. Tạo order từ backend
			console.log(publicKey);
			const res = await fetch(
				"https://hackathon2025-be.phatnef.me/order/create",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ userPubKey: publicKey }),
				}
			);

			if (!res.ok) throw new Error(`Server error: ${res.status}`);

			const data = await res.json();

			const { txBase64 } = data;
			if (!txBase64) {
				throw new Error("Failed to receive transaction from server.");
			}

			// 2. Decode transaction
			const transaction = Transaction.from(Buffer.from(txBase64, "base64"));

			// 3. Ký giao dịch bằng ví
			if (!wallet) {
				toast.error("Wallet not connected");
				return;
			}

			const signedTx = await wallet.signTransaction(transaction);

			// 4. Gửi giao dịch lên Solana blockchain
			const connection = new Connection(
				"https://api.devnet.solana.com",
				"confirmed"
			);
			const txid = await connection.sendRawTransaction(signedTx.serialize());

			// 5. Xác nhận giao dịch
			await connection.confirmTransaction(txid, "confirmed");

			// 6. Thông báo thành công
			toast.success("Checkout successfully!! 🎉");
			router.push("/checkout-success");
		} catch (error) {
			console.error("Checkout error:", error);
			toast.error("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	// Calculate total amounts by token
	const tokenTotals = products.reduce((acc, product) => {
		const total = product.price * product.quantity;
		if (!acc[product.tokenSymbol]) {
			acc[product.tokenSymbol] = 0;
		}
		acc[product.tokenSymbol] += total;
		return acc;
	}, {} as Record<string, number>);

	const totalAmount = Object.values(tokenTotals).reduce(
		(sum, amount) => sum + amount,
		0
	);

	const handleUpdateQuantity = (id: string, quantity: number) => {
		if (quantity === 0) {
			handleRemoveProduct(id);
			return;
		}

		setProducts((prev) =>
			prev.map((product) =>
				product.id === id ? { ...product, quantity } : product
			)
		);
	};

	const handleRemoveProduct = (id: string) => {
		setProducts((prev) => prev.filter((product) => product.id !== id));
		toast.success("Product removed from cart");
	};

	// Redirect if cart is empty
	useEffect(() => {
		if (products.length === 0) {
			toast.error("Your cart is empty");
			router.push("/");
		}
	}, [products.length, router]);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 mt-20">
			{/* Background Effects */}
			<div className="fixed inset-0 pointer-events-none">
				<div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
				<div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400/5 rounded-full blur-3xl"></div>
			</div>

			{/* Main Content */}
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column - Products & Payment */}
					<div className="lg:col-span-2 space-y-8">
						{/* Products Section */}
						<div>
							<h2 className="text-2xl font-bold text-white mb-6">Your Order</h2>
							<div className="space-y-4">
								{products.map((product) => (
									<ProductCard
										key={product.id}
										product={product}
										onUpdateQuantity={handleUpdateQuantity}
										onRemove={handleRemoveProduct}
									/>
								))}
							</div>
						</div>
					</div>

					{/* Right Column - Order Summary */}
					<div className="lg:col-span-1 mt-14">
						<div className="space-y-6">
							<OrderSummary products={products} />

							<CheckoutButton
								onCheckout={checkoutFunc}
								disabled={products.length === 0}
								isLoading={isLoading}
								totalAmount={totalAmount}
								tokenSymbol="Tokens"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
