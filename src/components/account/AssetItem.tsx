"use client";

import { memo } from "react";
import { TokenIcon } from "@/components/account/TokenIcon";
import { TokenAccount } from "@/utils/Types";

interface TokenAssetItemProps {
  token: TokenAccount | null | undefined;
  estimatedValue?: number; // Optional USD value estimate
}

function formatNumber(
  number: number,
  n: number,
  x: number,
  s: string,
  c: string = ""
) {
  const re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\D" : "$") + ")",
    num = number.toFixed(Math.max(0, ~~n));

  return (c ? num.replace(".", c) : num).replace(
    new RegExp(re, "g"),
    "$&" + (s || ",")
  );
}

const TokenAssetItem = ({ token, estimatedValue }: TokenAssetItemProps) => {
  // Guard clause to handle null/undefined token
  if (!token) {
    return (
      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30">
        <div className="text-gray-400">Invalid token data</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
          <TokenIcon
            mint={token?.mint || ''}
            symbol={token?.symbol}
            logoURI={token?.logoURI}
            size={40}
          />
        </div>
      <div>
        <div className="text-white font-semibold">
          {token?.symbol || "Unknown Token"}
        </div>
        <div className="text-gray-400 text-sm font-mono text-xs">
          {token?.mint ? `${token.mint.slice(0, 8)}...${token.mint.slice(-4)}` : "No mint address"}
        </div>
      </div>
    </div>
    <div className="text-right">
      <div className="text-white font-semibold">
        {estimatedValue !== undefined ? (
          <>
            $
            {estimatedValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </>
        ) : (
          <span className="text-gray-400">--</span>
        )}
      </div>
      <div className="text-gray-400 text-sm">
        {token?.uiAmount !== null && token?.uiAmount !== undefined ? formatNumber(token.uiAmount, 2, 3, ",") : "0"}{" "}
        {token?.symbol || "tokens"}
      </div>
    </div>
  </div>
  );
};

export default memo(TokenAssetItem);