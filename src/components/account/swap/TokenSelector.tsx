"use client";
import React from "react";
import { ChevronDown } from "lucide-react";
import { Token } from "@/utils/Types";
import { TokenIcon } from "../TokenIcon";

interface TokenSelectorProps {
  selectedToken: Token | null;
  onClick: () => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 rounded-xl border transition-all duration-200 ${
        selectedToken
          ? "bg-white/10 border-white/20 hover:bg-white/20 text-white"
          : "bg-[#00ffb2]/20 border-[#00ffb2] text-[#00ffb2] font-semibold shadow-lg shadow-[#00ffb2]/30 hover:bg-[#00ffb2]/30 hover:shadow-[#00ffb2]/40"
      }`}
    >
       {selectedToken ? (
        <>
          <TokenIcon
            mint={selectedToken.mint}
            logo={selectedToken.logo}
            logoURI={selectedToken.logoURI}
            symbol={selectedToken.symbol}
            size={28}
          />
          <span className="text-xl font-bold">{selectedToken.symbol}</span>
        </>
      ) : (
        <span className="text-lg font-medium px-1">Select Token</span>
      )}
      <ChevronDown className="w-4 h-4" />
    </button>
  );
};

export default TokenSelector;
