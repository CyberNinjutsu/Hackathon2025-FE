"use client";
import { useAuth } from "@/lib/AuthContext";
import { formatNumber, fetchTokenRatio } from "@/utils/Helper";
import { Token, TokenAccount, TokenRatio } from "@/utils/Types";
import { fetchTokenAccountsSafe } from "@/utils/useTokenAccount";
import { PublicKey, Transaction } from "@solana/web3.js";
import axios from "axios"; // Import AxiosError
import { Buffer } from "buffer";
import { ArrowUpDown, CheckCircle, Loader2, Settings } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import SwapInput from "./SwapInput";
import TokenSelectionPopup from "./TokenSelectionPopup";
// This is sometimes needed in browser environments for Buffer to work correctly.
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer;
}

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

interface SwapQuote {
  inputAmount: number;
  outputAmount: number;
  priceImpact: number;
  minimumReceived: number;
  exchangeRate: number;
  networkFee: number;
  timestamp: number;
}

declare global {
  interface Window {
    solana?: SolanaProvider;
    phantom?: {
      solana?: SolanaProvider;
    };
  }
}

const SwapInterface: React.FC = () => {
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToTokenAmount] = useState("");
  const [slippage, setSlippage] = useState("1");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectingFor, setSelectingFor] = useState<"from" | "to" | null>(null);
  const [swapQuote, setSwapQuote] = useState<SwapQuote | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [lastSwapTx, setLastSwapTx] = useState<string | null>(null);
  const [swapHistory, setSwapHistory] = useState<string[]>([]);

  const { publicKey, isAuthenticated } = useAuth();
  const [walletTokens, setWalletTokens] = useState<Token[]>([]);
  const [isFetchingTokens, setIsFetchingTokens] = useState(false);
  const calcTimeoutRef = useRef<number | null>(null);
  const quoteTimeoutRef = useRef<number | null>(null);

  const [wallet, setWallet] = useState<SolanaProvider | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.phantom?.solana) {
      setWallet(window.phantom.solana);
    }
  }, []);

  const isConnected = wallet?.isConnected || false;

  const calculateSwapQuote = useCallback(
    async (
      fromTokenData: Token,
      toTokenData: Token,
      inputAmount: string
    ): Promise<SwapQuote | null> => {
      if (
        !fromTokenData ||
        !toTokenData ||
        !inputAmount ||
        isNaN(Number(inputAmount))
      ) {
        return null;
      }

      try {
        const amount = Number(inputAmount);
        if (amount <= 0) return null;

        const ratioData = await fetchTokenRatio(
          fromTokenData.symbol,
          toTokenData.symbol
        );
        if (!ratioData) {
          throw new Error("No ratio available for this pair");
        }

        const exchangeRate = ratioData.ratio;
        const outputAmount = amount * exchangeRate;
        const priceImpact = 0; // hoặc bạn có thể tính thêm
        const slippageDecimal = Number(slippage) / 100;
        const minimumReceived = outputAmount * (1 - slippageDecimal);
        const networkFee = 1;

        return {
          inputAmount: amount,
          outputAmount,
          priceImpact,
          minimumReceived,
          exchangeRate,
          networkFee,
          timestamp: Date.now(),
        };
      } catch (error) {
        console.error("Error calculating swap quote:", error);
        return null;
      }
    },
    [slippage]
  );

  const updateSwapQuote = useCallback(
    (
      fromTokenData: Token | null,
      toTokenData: Token | null,
      inputAmount: string
    ) => {
      if (quoteTimeoutRef.current) {
        clearTimeout(quoteTimeoutRef.current);
      }

      if (!fromTokenData || !toTokenData || !inputAmount) {
        setSwapQuote(null);
        setToTokenAmount("");
        return;
      }

      setIsCalculating(true);

      quoteTimeoutRef.current = window.setTimeout(async () => {
        try {
          const quote = await calculateSwapQuote(
            fromTokenData,
            toTokenData,
            inputAmount
          );
          setSwapQuote(quote);

          if (quote) {
            setToTokenAmount(quote.outputAmount.toFixed(6));
          } else {
            setToTokenAmount("");
          }
        } catch (error) {
          console.error("Error getting quote:", error);
          setToTokenAmount("");
          setSwapQuote(null);
        } finally {
          setIsCalculating(false);
        }
      }, 500);
    },
    [calculateSwapQuote]
  );

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    updateSwapQuote(fromToken, toToken, value);
  };

  const handleSelectToken = (token: Token) => {
    if (selectingFor === "from") {
      if (toToken && token.mint === toToken.mint) {
        setToToken(fromToken);
      }
      setFromToken(token);
      updateSwapQuote(token, toToken, fromAmount);
    } else if (selectingFor === "to") {
      if (fromToken && token.mint === fromToken.mint) {
        setFromToken(toToken);
      }
      setToToken(token);
      updateSwapQuote(fromToken, token, fromAmount);
    }
    setIsPopupOpen(false);
    setSelectingFor(null);
  };

  const handleOpenPopup = (type: "from" | "to") => {
    setSelectingFor(type);
    setIsPopupOpen(true);
  };

  const handleSwapTokens = () => {
    const tempFromToken = fromToken;
    const tempToToken = toToken;
    const tempFromAmount = fromAmount;
    const tempToAmount = toAmount;

    setFromToken(tempToToken);
    setToToken(tempFromToken);
    setFromAmount(tempToAmount);
    setToTokenAmount(tempFromAmount);

    if (tempToAmount) {
      updateSwapQuote(tempToToken, tempFromToken, tempToAmount);
    }
  };

  const handleSwap = async () => {
    if (
      !publicKey ||
      !fromToken ||
      !toToken ||
      !fromAmount ||
      !swapQuote ||
      !isConnected ||
      !wallet // Đảm bảo wallet tồn tại
    ) {
      toast.error("Please connect wallet and fill all fields correctly.");
      return;
    }

    const fromBalance = Number(fromToken.balance);
    const inputAmount = Number(fromAmount);

    if (inputAmount > fromBalance) {
      toast.error(
        `Insufficient ${fromToken.symbol} balance. Available: ${fromBalance}`
      );
      return;
    }

    const quoteAge = Date.now() - swapQuote.timestamp;
    if (quoteAge > 5 * 60 * 1000) {
      toast.error("Quote is too old. Please refresh the quote.");
      updateSwapQuote(fromToken, toToken, fromAmount);
      return;
    }

    setIsSwapping(true);

    try {
      toast.info("Creating swap transaction...");

      const createResponse = await axios.post(
        "https://hackathon2025-be.phatnef.me/swap-token/create",
        {
          userPubKey: publicKey,
          tokens: `${fromToken.symbol.toUpperCase()}_${toToken.symbol.toUpperCase()}`,
          amount: inputAmount,
        },
        { timeout: 30000, headers: { "Content-Type": "application/json" } }
      );

      const { txBase64, hmacSignature } = createResponse.data;
      if (!txBase64) {
        throw new Error("Failed to receive transaction from server.");
      }

      toast.info("Please sign the transaction...");

      const transaction = Transaction.from(Buffer.from(txBase64, "base64"));
      const signedTx = await wallet.signTransaction(transaction);
      const partialSignedBase64 = signedTx
        .serialize({ requireAllSignatures: false })
        .toString("base64");

      toast.info("Submitting transaction...");

      const submitResponse = await axios.post(
        "https://hackathon2025-be.phatnef.me/swap-token/submit",
        {
          tokens: `${fromToken.symbol.toUpperCase()}_${toToken.symbol.toUpperCase()}`,
          partialSignedBase64,
          hmacSignature,
        },
        { timeout: 60000, headers: { "Content-Type": "application/json" } }
      );

      const txSignature = submitResponse.data?.signature;

      if (txSignature) {
        setLastSwapTx(txSignature);
        setSwapHistory((prev) => [txSignature, ...prev.slice(0, 9)]);
        toast.success(
          `Swap completed successfully! 🎉 Transaction: ${txSignature.slice(
            0,
            8
          )}...`
        );
      } else {
        toast.success("Swap submitted successfully! 🎉");
      }

      setFromAmount("");
      setToTokenAmount("");
      setSwapQuote(null);

      setTimeout(() => {
        loadWalletTokens();
      }, 2000);
    } catch (error: unknown) {
      console.error("Swap failed:", error);
      let errorMessage = "Unknown error occurred";

      if (axios.isAxiosError(error)) {
        if (error.code === "ECONNABORTED") {
          errorMessage = "Request timeout. Please try again.";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response?.status) {
          errorMessage = `Server error (${error.response.status}). Please try again.`;
        } else {
          errorMessage = error.message;
        }
      } else if (error instanceof Error) {
        // Xử lý các lỗi JavaScript chung
        errorMessage = error.message;
      }

      toast.error(`Swap failed: ${errorMessage}`);
    } finally {
      setIsSwapping(false);
    }
  };

  const calculateUsdValue = (amount: string, token: Token | null): string => {
    if (!amount || !token || isNaN(Number(amount))) return "0";
    return (Number(amount) * token.price).toFixed(2);
  };
  const getButtonText = () => {
    if (!isAuthenticated) return "Connect Wallet";
    if (isFetchingTokens) return "Fetching tokens...";
    if (walletTokens.length === 0 && !isFetchingTokens)
      return "No tokens found";
    if (!fromToken || !toToken) return "Select tokens";
    if (!fromAmount) return "Enter an amount";
    if (isCalculating) return "Getting quote...";

    const inputAmount = Number(fromAmount);
    const fromBalance = Number(fromToken?.balance ?? 0);

    if (inputAmount <= 0) return "Enter valid amount";
    if (inputAmount > fromBalance)
      return `Insufficient ${fromToken.symbol} balance`;
    if (!swapQuote) return "Unable to get quote";
    if (isSwapping) return "Swapping...";

    return "Swap";
  };
  const isButtonDisabled = () => {
    if (!isAuthenticated || isFetchingTokens || isCalculating || isSwapping)
      return true;
    if (!fromAmount || !toAmount || !fromToken || !toToken || !swapQuote)
      return true;

    const inputAmount = Number(fromAmount);
    const fromBalance = Number(fromToken?.balance ?? 0);
    const outputAmount = Number(toAmount);

    return (
      inputAmount <= 0 ||
      outputAmount <= 0 ||
      inputAmount > fromBalance ||
      swapQuote.exchangeRate <= 0
    );
  };
  const loadWalletTokens = useCallback(async () => {
    if (!publicKey || !isAuthenticated) {
      setWalletTokens([]);
      setFromToken(null);
      setToToken(null);
      return;
    }

    setIsFetchingTokens(true);

    try {
      const result = await fetchTokenAccountsSafe(publicKey, {
        cluster: "devnet",
      });

      if (result.success) {
        const fetchedTokens: Token[] = result.data.map(
          (acc: TokenAccount): Token => {
            const symbol = acc.symbol || acc.mint.slice(0, 4) + "...";
            const price = Math.random() * 0.02 + 0.01;

            return {
              symbol,
              name: acc.symbol || "Unknown Token",
              logo: acc.logo,
              logoURI: acc.logoURI,
              mint: acc.mint,
              balance: acc.uiAmount?.toString() ?? "0",
              price: price,
            };
          }
        );

        const sortedTokens = fetchedTokens.sort((a, b) => {
          const balanceA = parseFloat(a.balance);
          const balanceB = parseFloat(b.balance);
          return balanceB - balanceA;
        });

        setWalletTokens(sortedTokens);

        if (!fromToken && !toToken) {
          const eligibleTokens = sortedTokens.filter(
            (token) => token.balance !== "1960000"
          );

          const firstTokenWithBalance = eligibleTokens.find(
            (t) => parseFloat(t.balance) > 0
          );
          const selectedFromToken =
            firstTokenWithBalance || eligibleTokens[0] || null;
          setFromToken(selectedFromToken);

          if (sortedTokens.length > 1) {
            const nextToken = eligibleTokens.find(
              (t) => t.mint !== selectedFromToken?.mint
            );
            setToToken(nextToken || null);
          }
        }
      } else {
        toast.error("Failed to fetch wallet tokens: " + result.error);
        setWalletTokens([]);
      }
    } catch (error) {
      console.error("Error loading wallet tokens:", error);
      toast.error("Failed to load wallet tokens");
      setWalletTokens([]);
    } finally {
      setIsFetchingTokens(false);
    }
  }, [publicKey, isAuthenticated, fromToken, toToken]);
  useEffect(() => {
    loadWalletTokens();
  }, [loadWalletTokens]);
  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      updateSwapQuote(fromToken, toToken, fromAmount);
    }
  }, [slippage, updateSwapQuote, fromToken, toToken, fromAmount]);
  useEffect(() => {
    return () => {
      if (calcTimeoutRef.current) {
        clearTimeout(calcTimeoutRef.current);
      }
      if (quoteTimeoutRef.current) {
        clearTimeout(quoteTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen mt-10 flex items-center justify-center px-4">
      <div className="relative w-full max-w-7xl">
        <TokenSelectionPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onSelectToken={handleSelectToken}
          tokens={walletTokens}
        />
        <div className="relative p-8 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/20 shadow-2xl">
          <p className="text-2xl font-bold pb-3">Swap token</p>
          {isFetchingTokens && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-3xl">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
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
                    disabled={!fromToken || !toToken}
                    className="p-3 rounded-xl bg-slate-800/60 backdrop-blur-md border border-white/20 hover:bg-slate-700/60 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowUpDown className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
                  </button>
                </div>

                <div className="flex-1 w-full min-w-0">
                  {toToken?.balance !== "1960000" ? (
                    <SwapInput
                      label="To"
                      token={toToken}
                      amount={toAmount}
                      balance={toToken?.balance}
                      onSelectToken={() => handleOpenPopup("to")}
                      readOnly
                      usdValue={calculateUsdValue(toAmount, toToken)}
                    />
                  ) : null}
                </div>
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="space-y-6">
                {swapQuote && fromToken && toToken && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                      <CheckCircle className="w-4 h-4" />
                      Quote Information
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rate</span>
                        <span className="text-white font-medium">
                          1 {fromToken.symbol} ={" "}
                          {formatNumber(swapQuote.exchangeRate, 6)}{" "}
                          {toToken.symbol}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Minimum received</span>
                        <span className="text-white">
                          {formatNumber(swapQuote.minimumReceived, 6)}{" "}
                          {toToken.symbol}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Price impact</span>
                        <span
                          className={`${swapQuote.priceImpact > 3
                            ? "text-red-400"
                            : swapQuote.priceImpact > 1
                              ? "text-yellow-400"
                              : "text-green-400"
                            }`}
                        >
                          {swapQuote.priceImpact.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Transaction Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-gray-400">Network fee</span>
                    <span className="text-white">
                      ~${swapQuote?.networkFee.toFixed(2) ?? "12.45"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-gray-400">Max slippage</span>
                    <span className="text-white">{slippage}%</span>
                  </div>
                  {fromToken && toToken && swapQuote && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400">Quote age</span>
                      <span className="text-gray-400">
                        {Math.floor((Date.now() - swapQuote.timestamp) / 1000)}s
                        ago
                      </span>
                    </div>
                  )}
                </div>

                {/* Swap Button */}
                <button
                  disabled={isButtonDisabled()}
                  onClick={handleSwap}
                  className="w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#00ffb2] to-cyan-400 hover:opacity-90 text-black shadow-lg shadow-[#00ffb2]/40 hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  {isSwapping && <Loader2 className="w-5 h-5 animate-spin" />}
                  {getButtonText()}
                </button>

                {/* Last Transaction */}
                {lastSwapTx && (
                  <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2 text-sm text-green-400 mb-1">
                      <CheckCircle className="w-4 h-4" />
                      Last swap successful
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      <a
                        href={`https://explorer.solana.com/tx/${lastSwapTx}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-white transition-colors"
                      >
                        {lastSwapTx.slice(0, 8)}...{lastSwapTx.slice(-8)}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapInterface;
