"use client";

import { Product } from "./ProductCard";
import { Calculator, Coins, CreditCard } from "lucide-react";

interface OrderSummaryProps {
  products: Product[];
  isLoading?: boolean;
}

export default function OrderSummary({ products }: OrderSummaryProps) {
  // Calculate totals by token type
  const tokenTotals = products.reduce((acc, product) => {
    const total = product.price * product.quantity;
    if (!acc[product.tokenSymbol]) {
      acc[product.tokenSymbol] = 0;
    }
    acc[product.tokenSymbol] += total;
    return acc;
  }, {} as Record<string, number>);

  const totalItems = products.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  return (
    <div className="bg-gray-900/50 border border-gray-800/50 rounded-xl p-6 backdrop-blur-sm top-24">
      <div className="flex items-center gap-2 mb-6">
        <Calculator className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-white">Order Summary</h2>
      </div>

      {/* Items Count */}
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-800">
        <span className="text-gray-400">Total Items</span>
        <span className="text-white font-medium">{totalItems}</span>
      </div>

      {/* Token Totals */}
      <div className="space-y-3 mb-6">
        {Object.entries(tokenTotals).map(([symbol, amount]) => (
          <div key={symbol} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-primary" />
              <span className="text-gray-300">{symbol}</span>
            </div>
            <span className="text-white font-bold">
              {amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Processing Fee */}
      <div className="space-y-3 mb-6 pb-6 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Processing Fee</span>
          <span className="text-green-400">Free</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Network Fee</span>
          <span className="text-yellow-400">~ 0.008 SOL</span>
        </div>
      </div>

      {/* Grand Total */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <CreditCard className="w-5 h-5 text-primary" />
          <span className="text-lg font-bold text-white">Total Payment</span>
        </div>

        {Object.entries(tokenTotals).map(([symbol, amount]) => (
          <div key={symbol} className="flex justify-between items-center">
            <span className="text-gray-300 font-medium">{symbol}</span>
            <span className="text-2xl font-bold text-primary">
              {amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
        <p className="text-xs text-primary text-center">
          🔒 Secured by Solana blockchain technology
        </p>
      </div>
    </div>
  );
}
