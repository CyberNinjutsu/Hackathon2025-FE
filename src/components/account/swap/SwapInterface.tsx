"use client";
import React, { useEffect, useRef, useState } from "react";
import { ArrowUpDown, Loader2, Settings } from "lucide-react";
import TokenSelectionPopup from "./TokenSelectionPopup";
import SwapInput from "./SwapInput";
import { Token, TokenAccount } from "@/utils/Types";
import { toast } from "sonner";
import { formatNumber } from "@/utils/Helper";
import { useAuth } from "@/lib/AuthContext";
import { fetchTokenAccountsSafe } from "@/utils/useTokenAccount";

// Mock tokens
const ADDITIONAL_MOCK_TOKENS: Token[] = [
  {
    symbol: "DAMS",
    name: "DAMS",
    logoURI:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    mint: "So11111111111111111111111111111111111111112",
    balance: "1234",
    price: 11,
  },
];

const MOCK_PRICES: { [key: string]: number } = {
  GOLD: 0.1,
  DAMS: 1,
};

const SwapInterface: React.FC = () => {
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [showSettings, setShowSettings] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectingFor, setSelectingFor] = useState<"from" | "to" | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const { publicKey, isAuthenticated } = useAuth();
  const [walletTokens, setWalletTokens] = useState<Token[]>([]);
  const [isFetchingTokens, setIsFetchingTokens] = useState(false);
  const calcTimeoutRef = useRef<number | null>(null);
  const calculateExchangeRate = (from: Token, to: Token): number => {
    if (!from || !to) return 0;
    return from.price / to.price;
  };

  // Calculate USD value
  const calculateUsdValue = (amount: string, token: Token | null): string => {
    if (!amount || !token || isNaN(Number(amount))) return "0";
    return (Number(amount) * token.price).toString();
  };

  // Update exchange rate when tokens change
  useEffect(() => {
    if (!fromToken || !toToken) return;
    const rate = calculateExchangeRate(fromToken, toToken);
    setExchangeRate(rate);
    // refresh quoted output on token pair change
    if (fromAmount && Number.isFinite(Number(fromAmount))) {
      const out = Number(fromAmount) * rate;
      setToAmount(Number.isFinite(out) ? out.toFixed(6) : "");
    } else {
      setToAmount("");
    }
    return () => {
      if (calcTimeoutRef.current) {
        clearTimeout(calcTimeoutRef.current);
      }
    };
  }, [fromToken, fromAmount, toToken]);

  // Handle amount changes with dynamic calculation
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);

    if (!fromToken || !toToken || !value || isNaN(Number(value))) {
      setToAmount("");
      return;
    }

    setIsCalculating(true);

    if (calcTimeoutRef.current) {
      clearTimeout(calcTimeoutRef.current);
    }
    calcTimeoutRef.current = window.setTimeout(() => {
      const rate = calculateExchangeRate(fromToken, toToken);
      const fluctuation = 1 + (Math.random() - 0.5) * 0.01;
      const finalRate = rate * fluctuation;

      const calculatedAmount = (Number(value) * finalRate).toString();
      setToAmount(parseFloat(calculatedAmount).toFixed(6));
      setExchangeRate(finalRate);
      setIsCalculating(false);
    }, 300);
  };

  const handleOpenPopup = (type: "from" | "to") => {
    setSelectingFor(type);
    setIsPopupOpen(true);
  };

  const handleSelectToken = (token: Token) => {
    if (selectingFor === "from") {
      if (toToken && token.symbol === toToken.symbol) {
        setToToken(fromToken);
      }
      setFromToken(token);
    } else if (selectingFor === "to") {
      if (fromToken && token.symbol === fromToken.symbol) {
        setFromToken(toToken);
      }
      setToToken(token);
    }
    setIsPopupOpen(false);
    setSelectingFor(null);
  };

  const handleSwapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSwap = () => {
    if (!fromToken || !toToken) return;
    const fromVal = Number(fromAmount);
    const toVal = Number(toAmount);
    const fromBal = Number(fromToken.balance ?? 0);
    if (
      !Number.isFinite(fromVal) ||
      !Number.isFinite(toVal) ||
      fromVal <= 0 ||
      toVal <= 0 ||
      exchangeRate <= 0
    ) {
      toast.error("Invalid amount or rate.");
      return;
    }
    if (fromVal > (Number.isFinite(fromBal) ? fromBal : 0)) {
      toast.error("Insufficient balance.");
      return;
    }
    toast.success("Swap Successful 🎉");
    setFromAmount("");
    setToAmount("");
  };

  const getButtonText = () => {
    if (!isAuthenticated) return "Connect Wallet";
    if (isFetchingTokens) return "Fetching tokens...";
    if (walletTokens.length === 0 && !isFetchingTokens)
      return "No tokens found";
    if (!fromToken || !toToken) return "Select a token";
    if (!fromAmount) return "Enter an amount";
    if (isCalculating) return "Calculating...";
    return "Swap";
  };

  useEffect(() => {
    const loadWalletAndMockTokens = async () => {
      setIsFetchingTokens(true);

      let fetchedTokens: Token[] = [];

      if (publicKey && isAuthenticated) {
        const result = await fetchTokenAccountsSafe(publicKey, {
          cluster: "devnet",
        });

        if (result.success) {
          fetchedTokens = result.data.map((acc: TokenAccount): Token => {
            const symbol = acc.symbol || acc.mint.slice(0, 4) + "...";
            const price = MOCK_PRICES[symbol.toUpperCase()] || 0.01;

            return {
              symbol,
              name: acc.symbol || "Unknown Token",
              logo: acc.logo,
              logoURI: acc.logoURI,
              mint: acc.mint,
              balance: acc.uiAmount?.toString() ?? "0",
              price: price,
            };
          });
        } else {
          toast.error("Failed to fetch wallet tokens: " + result.error);
        }
      }

      const combinedTokens = new Map<string, Token>();

      fetchedTokens.forEach((token) => combinedTokens.set(token.mint, token));

      ADDITIONAL_MOCK_TOKENS.forEach((mockToken) => {
        if (!combinedTokens.has(mockToken.mint)) {
          combinedTokens.set(mockToken.mint, mockToken);
        }
      });

      const finalTokenList = Array.from(combinedTokens.values()).sort(
        (a, b) => {
          const balanceA = parseFloat(a.balance);
          const balanceB = parseFloat(b.balance);
          return balanceB - balanceA;
        }
      );

      setWalletTokens(finalTokenList);

      const firstTokenWithBalance = finalTokenList.find(
        (t) => parseFloat(t.balance) > 0
      );
      setFromToken(firstTokenWithBalance || finalTokenList[0] || null);

      if (finalTokenList.length > 1) {
        if (firstTokenWithBalance) {
          const nextToken = finalTokenList.find(
            (t) => t.mint !== firstTokenWithBalance.mint
          );
          setToToken(nextToken || null);
        } else {
          setToToken(finalTokenList[1]);
        }
      }

      setIsFetchingTokens(false);
    };

    loadWalletAndMockTokens();
  }, [publicKey, isAuthenticated]);

  const isButtonDisabled = () => {
    const fromVal = Number(fromAmount); 
    const toVal = Number(toAmount);
    const fromBal = Number(fromToken?.balance ?? 0); 
    return (
      !isAuthenticated ||
      isFetchingTokens ||
      !fromAmount ||
      !toAmount ||
      !fromToken ||
      !toToken ||
      isCalculating || fromVal <=0 || toVal <=0 || fromVal > (Number.isFinite(fromBal) ? fromBal : 0) || exchangeRate <=0
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="relative w-full max-w-7xl">
        <TokenSelectionPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onSelectToken={handleSelectToken}
          tokens={walletTokens}
        />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Swap</h1>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-200"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="relative p-8 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/20 shadow-2xl">
          {isFetchingTokens && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-3xl">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
              <p className="mt-2 text-gray-300">Loading your tokens...</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <div className="flex flex-col gap-6 w-full">
                <div className="flex-1 w-full min-w-0">
                  <SwapInput
                    label="From"
                    token={fromToken}
                    amount={fromAmount}
                    balance={fromToken?.balance}
                    onAmountChange={handleFromAmountChange}
                    onSelectToken={() => handleOpenPopup("from")}
                    usdValue={calculateUsdValue(fromAmount, fromToken)}
                  />
                </div>

                <div className="flex items-center justify-center">
                  <button
                    onClick={handleSwapTokens}
                    className="p-3 rounded-xl bg-slate-800/60 backdrop-blur-md border border-white/20 hover:bg-slate-700/60 transition-all duration-200 group"
                  >
                    <ArrowUpDown className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors " />
                  </button>
                </div>

                <div className="flex-1 w-full min-w-0">
                  <SwapInput
                    label="To"
                    token={toToken}
                    amount={toAmount}
                    balance={toToken?.balance}
                    onSelectToken={() => handleOpenPopup("to")}
                    readOnly
                    usdValue={calculateUsdValue(toAmount, toToken)}
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="space-y-6">
                {/* Exchange Rate Info */}
                {fromToken && toToken && exchangeRate > 0 && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-sm text-gray-300 mb-2">
                      Exchange Rate
                    </div>
                    <div className="text-white font-semibold text-lg break-words">
                      1 {fromToken.symbol} = {formatNumber(exchangeRate, 6)}{" "}
                      {toToken.symbol}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      ≈ ${formatNumber(fromToken.price)} per {fromToken.symbol}
                    </div>
                  </div>
                )}

                {/* Transaction Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-gray-400">Network fee</span>
                    <span className="text-white">~$12.45</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-gray-400">Max slippage</span>
                    <span className="text-white">{slippage}%</span>
                  </div>
                  {fromToken && toToken && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400">Price impact</span>
                      <span className="text-green-400">{"<0.01%"}</span>
                    </div>
                  )}
                </div>

                {/* Swap Button */}
                <button
                  disabled={isButtonDisabled()}
                  onClick={handleSwap}
                  className="w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#00ffb2] to-cyan-400 hover:opacity-90 text-black shadow-lg shadow-[#00ffb2]/40 hover:shadow-xl transform hover:scale-[1.02]"
                >
                  {getButtonText()}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapInterface;
