"use client";

import React from "react";
import Link from "next/link";

import { TokenAccount } from "@/utils/Types";
import { TokenIcon } from "./TokenIcon";

/**
 * formatNumber(number, decimals = 0, groupSize = 3, groupSeparator = ",", decimalSeparator = ".")
 * simple formatting helper compatible with existing calls like formatNumber(t.uiAmount, 0, 3, ".")
 */
function formatNumber(
  number: number | null | undefined,
  decimals: number = 0,
  groupSize: number = 3,
  groupSeparator: string = ",",
  decimalSeparator: string = "."
) {
  const n = Number(number ?? 0);
  const fixed = n.toFixed(decimals);
  const parts = fixed.split(".");
  parts[0] = parts[0].replace(
    new RegExp("\\B(?=(\\d{" + groupSize + "})+(?!\\d))", "g"),
    groupSeparator
  );
  return parts.join(decimalSeparator);
}

const TokenAccountsDisplay: React.FC<{ tokens: TokenAccount[] }> = ({ tokens }) => {
  return (
    <div className="glass-card p-4">
      <h3 className="text-lg font-semibold text-white mb-3">Your assets</h3>

      {tokens.length === 0 ? (
        <div className="text-sm text-gray-400">No tokens found</div>
      ) : (
        <div className="flex gap-4 overflow-x-auto py-2">
          {tokens.map((t) => (
            <div
              key={t.tokenAccountAddress}
              className="min-w-[250px] glass-card p-3 rounded-lg flex-shrink-0 flex flex-col justify-between"
            >
              {/* Top section with Icon, Name, and Amount */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <TokenIcon mint={t.mint} symbol={t.symbol} logoURI={t.logoURI} size={40} />
                  <div>
                    <div className="text-lg font-bold text-white leading-tight">
                      {t.symbol ?? "Unknown"}
                    </div>
                    <div className="text-xs text-gray-400">Token</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-white text-lg">
                    {t.uiAmount !== null ? formatNumber(t.uiAmount, 0, 3, ".") : "0"}
                  </div>
                  <div className="text-xs text-gray-400">Amount</div>
                </div>
              </div>

              {/* Bottom section with Mint and Account Address */}
              <div className="mt-3 space-y-1 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Mint:</span>
                  <Link
                    href={`https://solscan.io/token/${t.mint}?cluster=devnet`}
                    target="_blank"
                    className="text-white truncate hover:underline"
                  >
                    <span style={{ maxWidth: 150, display: "inline-block", verticalAlign: "middle" }}>
                      {t.mint}
                    </span>
                  </Link>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Account:</span>
                  <Link
                    href={`https://solscan.io/account/${t.tokenAccountAddress}?cluster=devnet`}
                    target="_blank"
                    className="text-white truncate hover:underline"
                  >
                    <span style={{ maxWidth: 150, display: "inline-block", verticalAlign: "middle" }}>
                      {t.tokenAccountAddress}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TokenAccountsDisplay;
