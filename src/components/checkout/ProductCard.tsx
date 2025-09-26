"use client";

import { Minus, Plus, X } from 'lucide-react';
import ProductImage from './ProductImage';

export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	image: string;
	category: string;
	quantity: number;
	tokenSymbol: string;
}

interface ProductCardProps {
	product: Product;
	onUpdateQuantity: (id: string, quantity: number) => void;
	onRemove: (id: string) => void;
}

export default function ProductCard({ product, onUpdateQuantity, onRemove }: ProductCardProps) {
	const handleQuantityChange = (delta: number) => {
		const newQuantity = Math.max(0, product.quantity + delta);
		onUpdateQuantity(product.id, newQuantity);
	};

	return (
		<div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
			<div className="flex flex-col sm:flex-row gap-4">
				{/* Product Image */}
				<div className="relative w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden">
					<ProductImage
						src={product.image}
						alt={product.name}
						className="w-full h-full"
					/>
					<div className="absolute top-2 right-2 sm:hidden">
						<button
							onClick={() => onRemove(product.id)}
							className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 p-1 rounded-full transition-colors"
						>
							<X className="w-4 h-4 text-red-400" />
						</button>
					</div>
				</div>

				{/* Product Info */}
				<div className="flex-1 space-y-2">
					<div className="flex items-start justify-between">
						<div>
							<h3 className="text-lg font-semibold text-white">{product.name}</h3>
							<p className="text-sm text-gray-400">{product.description}</p>
							<span className="inline-block mt-1 px-2 py-1 bg-primary/20 border border-primary/30 rounded text-xs text-primary">
								{product.category}
							</span>
						</div>
						<button
							onClick={() => onRemove(product.id)}
							className="hidden sm:block bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 p-2 rounded-lg transition-colors"
						>
							<X className="w-4 h-4 text-red-400" />
						</button>
					</div>

					{/* Price and Quantity */}
					<div className="flex items-center justify-between pt-2">
						<div className="text-right">
							<p className="text-lg font-bold text-white">
								{product.price.toLocaleString()} {product.tokenSymbol}
							</p>
						</div>

						{/* Quantity Controls */}
						<div className="flex items-center gap-3">
							<button
								onClick={() => handleQuantityChange(-1)}
								disabled={product.quantity <= 1}
								className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700 p-2 rounded-lg transition-colors"
							>
								<Minus className="w-4 h-4 text-white" />
							</button>

							<span className="text-white font-medium min-w-[2rem] text-center">
								{product.quantity}
							</span>

							<button
								onClick={() => handleQuantityChange(1)}
								className="bg-gray-800 hover:bg-gray-700 border border-gray-700 p-2 rounded-lg transition-colors"
							>
								<Plus className="w-4 h-4 text-white" />
							</button>
						</div>
					</div>

					{/* Total Price */}
					<div className="pt-2 border-t border-gray-800">
						<p className="text-right text-xl font-bold text-primary">
							{(product.price * product.quantity).toLocaleString()} {product.tokenSymbol}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}