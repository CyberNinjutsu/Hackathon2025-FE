"use client";

import { useState } from 'react';
import { Package } from 'lucide-react';

interface ProductImageProps {
	src: string;
	alt: string;
	className?: string;
}

export default function ProductImage({ src, alt, className = "" }: ProductImageProps) {
	const [imageError, setImageError] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const handleImageError = () => {
		setImageError(true);
		setIsLoading(false);
	};

	const handleImageLoad = () => {
		setIsLoading(false);
	};

	if (imageError || src.includes('/api/placeholder')) {
		return (
			<div className={`bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center ${className}`}>
				<Package className="w-8 h-8 text-gray-600" />
			</div>
		);
	}

	return (
		<div className={`relative ${className}`}>
			{isLoading && (
				<div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
					<Package className="w-8 h-8 text-gray-600" />
				</div>
			)}
			<img
				src={src}
				alt={alt}
				className="w-full h-full object-cover"
				onError={handleImageError}
				onLoad={handleImageLoad}
				style={{ display: isLoading ? 'none' : 'block' }}
			/>
		</div>
	);
}