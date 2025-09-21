"use client";
import React from "react";
import TokenSelector from "./TokenSelector";
import { Token } from "@/utils/Types";
import { formatNumber } from "@/utils/Helper";
import { Input } from "@/components/ui/input";

interface SwapInputProps {
  label: string;
  token: Token | null;
  amount: string;
  balance?: string;
  onAmountChange?: (value: string) => void;
  onSelectToken: () => void;
  readOnly?: boolean;
  usdValue?: string;
}

const SwapInput: React.FC<SwapInputProps> = ({
  label,
  token,
  amount,
  balance,
  onAmountChange,
  onSelectToken,
  readOnly = false,
  usdValue,
}) => {


  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-300">{label}</span>
        <span className="text-sm text-gray-300">Balance: {balance ? formatNumber(balance) : "0.00"}</span>
      </div>
      <div className="flex items-center space-x-3 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="flex-1">
          <Input
            type="text"
            value={amount}
            onChange={(e) => onAmountChange?.(e.target.value)}
            placeholder="0.0"
            readOnly={readOnly}
            className="w-full bg-transparent text-white text-3xl font-semibold focus:outline-none placeholder-gray-400"
          />
          <div className="text-sm text-gray-400 mt-1">
            ${usdValue ? formatNumber(usdValue) : "0.00"}
          </div>
        </div>
        <TokenSelector selectedToken={token} onClick={onSelectToken} />
      </div>
    </div>
  );
};
export default SwapInput;
