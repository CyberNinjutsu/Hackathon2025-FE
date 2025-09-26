"use client";
import React, { useState, useMemo, useEffect } from "react";
import { X, Search } from "lucide-react";
import { Token } from "@/utils/Types";
import { TokenIcon } from "../TokenIcon";

interface TokenSelectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectToken: (token: Token) => void;
  tokens: Token[];
}

const TokenSelectionPopup: React.FC<TokenSelectionPopupProps> = ({
  isOpen,
  onClose,
  onSelectToken,
  tokens,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTokens = useMemo(() => {
    if (!searchTerm) return tokens;
    const lowercasedFilter = searchTerm.toLowerCase();
    return tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(lowercasedFilter) ||
        token.name.toLowerCase().includes(lowercasedFilter) || 
        token.mint.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm, tokens]);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const scrollThreshold = 5;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-slate-900/80 border border-white/20 rounded-2xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Select a token</h2>
          <button
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name or paste address"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
            />
          </div>
        </div>

        <div
          className={`flex-1 px-2 pb-4 ${
            filteredTokens.length > scrollThreshold
              ? 'overflow-y-auto max-h-96' 
              : '' 
          }`}
        >
          {filteredTokens.filter((token) => token.balance != "1960000") .map((token) => (
            <button
              key={token.mint}
              onClick={() => onSelectToken(token)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <TokenIcon
                    mint={token.mint}
                    symbol={token.symbol}
                    logo={token.logo}
                    logoURI={token.logoURI}
                    size={40}
                  />
                <div className="text-left">
                  <div className="font-semibold text-white">{token.symbol}</div>
                  <div className="text-sm text-gray-400">{token.name}</div>
                </div>
              </div>
              <div className="text-right text-base text-gray-200" id="token">
                {token.balance}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenSelectionPopup;
