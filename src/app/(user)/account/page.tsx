"use client";

import AssetChart from "@/components/account/AssetChart";
import AssetItem from "@/components/account/AssetItem";
import TransactionItem from "@/components/account/TransactionItem";
import BackgroundGlow from "@/components/Glow/BackgroundGlow";
import Loading from "@/components/Loading";
import { useAuth } from "@/lib/AuthContext";
import { getStatusBadge } from "@/utils/Helper";
import { AssetHistory, TokenAccount, Transaction } from "@/utils/Types";
import { fetchTokenAccounts } from "@/utils/useTokenAccount";
import { useTransactionHistory } from "@/utils/useTransactionHistory";
import { format } from "date-fns";
import { ArrowRightIcon, WalletIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const assetHistory: AssetHistory[] = [
  {
    id: "1",
    name: "Gold",
    color: "#ffd700",
    data: [
      { date: "01", value: 14500 },
      { date: "02", value: 14800 },
      { date: "03", value: 14600 },
      { date: "04", value: 15000 },
    ],
  },
  {
    id: "2",
    name: "Real Estate",
    color: "#8b4513",
    data: [
      { date: "01", value: 7500 },
      { date: "02", value: 7800 },
      { date: "03", value: 7900 },
      { date: "04", value: 8000 },
    ],
  },
  {
    id: "3",
    name: "Gemstones",
    color: "#9932cc",
    data: [
      { date: "01", value: 1800 },
      { date: "02", value: 1900 },
      { date: "03", value: 1950 },
      { date: "04", value: 2000 },
    ],
  },
];

const AccountPage = () => {
  const {
    publicKey,
    isAuthenticated,
    isLoading: isAuthLoading,
    logout,
  } = useAuth();
  const router = useRouter();

  const [txLimit, setTxLimit] = useState<number>(3);
  const [tokens, setTokens] = useState<TokenAccount[]>([]);
  const [isLoadingTokens, setIsLoadingTokens] = useState(false);
  const { transactions, isLoading, error } = useTransactionHistory(
    publicKey,
    txLimit
  );
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [showFullKey, setShowFullKey] = useState(false);

  const formatPublicKey = (pubKey: string | null) => {
    if (!pubKey) return "";
    if (showFullKey) return pubKey;
    return `${pubKey.slice(0, 6)}...${pubKey.slice(-6)}`;
  };
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      toast.error("Access required", {
        description: "You must connect a wallet to view this page.",
      });
      router.push("/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    const checkAndFetchTokens = async () => {
      if (!publicKey || !isAuthenticated) {
        if (!isAuthLoading) {
          setIsLoadingTokens(false);
          router.replace("/login");
          return;
        }
      } else {
        setIsChecking(false);
        setIsLoadingTokens(true);
        try{
          const tokenAccs = await fetchTokenAccounts(publicKey);
          setTokens(tokenAccs);
        }
        catch (e) {
          toast.error("Failed to load token" + e)
        }
        finally {
          setIsLoadingTokens(false);
        }
      }
    };
    checkAndFetchTokens();
  }, [router, isAuthenticated, publicKey, isAuthLoading]);

  if (isChecking) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br text-white custom-scrollbar">
      <BackgroundGlow />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 relative z-10 max-w-7xl">
        {/* Page Title & Overview */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
            Your Account
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto">
            Manage your assets and track your transactions
          </p>
        </div>

        {/* Wallet Card*/}
        <div className="mb-8 sm:mb-12 max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center">
                    <WalletIcon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xl font-semibold text-white">
                    Wallet
                  </span>
                </div>
              </div>

              {/* PUBLIC KEY/WALLET ID */}
              <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 rounded-lg p-4 text-white border border-gray-700/50 shadow-lg">
                <div className="mb-3">
                  <p className="text-xs opacity-80 text-gray-300">
                    PUBLIC KEY/WALLET ID
                  </p>
                  <p className="font-mono text-lg tracking-wider text-white">
                    {formatPublicKey(publicKey ?? "")}
                  </p>
                </div>
                <button
                  onClick={() => setShowFullKey((prev) => !prev)}
                  className="text-xs px-2 py-1 border rounded-md border-gray-600 text-gray-400 hover:text-white hover:border-gray-400 transition"
                  aria-pressed={showFullKey} aria-label={showFullKey ? "Hide full wallet public key" : "Show full wallet public key"}
                >
                  {showFullKey ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:items-stretch">
            {/* Assets  */}
            <div className="lg:col-span-1 flex">
              <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl flex-1 flex flex-col transition-all duration-300 hover:scale-105 hover:border-primary/30">
                <div className="p-4 border-b border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">
                      Your Assets
                    </span>
                    <div className="bg-primary/20 border border-primary/30 px-2 py-1 rounded text-xs text-primary">
                      {isLoadingTokens
                        ? "Loading..."
                        : `${tokens.length} tokens`}
                    </div>
                  </div>
                </div>
                <div className="p-4 flex-1">
                  {isLoadingTokens ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-gray-400">Loading tokens...</div>
                    </div>
                  ) : tokens.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-center">
                      <div>
                        <div className="text-gray-400 mb-2">
                          No tokens found
                        </div>
                        <div className="text-xs text-gray-500">
                          {isAuthenticated
                            ? "No tokens in wallet"
                            : "Connect wallet to view tokens"}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {tokens.slice(0, 5).map((token) => (
                        <div key={token.tokenAccountAddress}>
                          <AssetItem
                            token={token}
                            // You can add estimated value calculation here if you have price data
                            // estimatedValue={calculateTokenValue(token)}
                          />
                        </div>
                      ))}
                      {tokens.length > 5 && (
                        <div className="text-center pt-2">
                          <button
                            onClick={() => router.push("/history")}
                            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            View all {tokens.length} tokens →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Transactions */}
            <div className="lg:col-span-1 flex">
              <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl flex-1 flex flex-col transition-all duration-300 hover:scale-105 hover:border-cyan-400/30">
                <div className="p-4 border-b border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">
                      Recent Transactions
                    </span>
                    <Link href="/history">
                      <button className="bg-cyan-400/20 hover:bg-cyan-400/30 border border-cyan-400/40 px-3 py-1 rounded text-xs text-cyan-400 transition-all duration-300">
                        View all{" "}
                        <ArrowRightIcon className="w-3 h-3 ml-1 inline" />
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="p-4 flex-1">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-gray-400">
                        Loading transactions...
                      </div>
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-gray-400">
                        No recent transactions found.
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {transactions.map((tx) => {
                        const transactionForUI: Transaction = {
                          id: tx.id,
                          type: tx.type as
                            | "Send"
                            | "Receive"
                            | "Mint"
                            | "Swap"
                            | "Other",
                          date: format(new Date(tx.date), "yyyy-MM-dd HH:mm"),
                          amount: tx.amount,
                          assetSymbol: tx.assetSymbol,
                          status: tx.status,
                          value: tx.value,
                          fee: tx.fee
                        };

                        return (
                          <div key={transactionForUI.id}>
                            <TransactionItem
                              transaction={transactionForUI}
                              getStatusBadge={getStatusBadge}
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="lg:col-span-1 flex">
              <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl flex-1 flex flex-col transition-all duration-300 hover:scale-105 hover:border-purple-400/30 hover:shadow-purple-400/20">
                <div className="p-4 border-b border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">
                      Portfolio Chart
                    </span>
                    <div className="bg-purple-400/20 border border-purple-400/30 px-2 py-1 rounded text-xs text-purple-400">
                      Last 7 days
                    </div>
                  </div>
                </div>
                <div className="p-4 flex-1">
                  <AssetChart assetHistory={assetHistory} />
                  {/* <div className="flex flex-wrap gap-2 mt-4">
                    {assetHistory.map((asset) => (
                      <div
                        key={asset.id}
                        className="flex items-center gap-1 px-2 py-1 rounded-md text-xs border transition-all duration-300"
                        style={{
                          backgroundColor: ${asset.color}20,
                          borderColor: ${asset.color}40,
                          color: asset.color,
                        }}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: asset.color }}
                        ></div>
                        <span>{asset.name}</span>
                      </div>
                    ))}
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
