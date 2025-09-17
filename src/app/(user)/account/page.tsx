"use client";

import AssetChart from "@/components/account/AssetChart";
import AssetItem from "@/components/account/AssetItem";
import TransactionItem from "@/components/account/TransactionItem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStatusBadge, getTransactionIcon } from "@/utils/Helper";
import { Asset, AssetHistory, Transaction } from "@/utils/Types";
import { ArrowRightIcon, PlusIcon, WalletIcon } from "lucide-react";

// ==== MOCK DATA ====
const assets: Asset[] = [
  {
    id: "1",
    name: "Gold",
    symbol: "GOLD",
    icon: "🥇",
    amount: 2.5,
    value: 15000,
    percentage: 60,
    color: "#ffd700",
  },
  {
    id: "2",
    name: "Real Estate",
    symbol: "RE",
    icon: "🏠",
    amount: 1,
    value: 8000,
    percentage: 32,
    color: "#8b4513",
  },
  {
    id: "3",
    name: "Gemstones",
    symbol: "GEMS",
    icon: "💎",
    amount: 10,
    value: 2000,
    percentage: 8,
    color: "#9932cc",
  },
];

const transactions: Transaction[] = [
  {
    id: "t1",
    type: "buy",
    description: "Buy Gold",
    timestamp: "2025-09-10 12:30",
    amount: -5000,
    status: "success",
  },
  {
    id: "t2",
    type: "receive",
    description: "Receive Real Estate Investment",
    timestamp: "2025-09-12 14:20",
    amount: 2000,
    status: "pending",
  },
  {
    id: "t3",
    type: "send",
    description: "Sell Gemstones",
    timestamp: "2025-09-14 18:45",
    amount: -1000,
    status: "failed",
  },
];

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
  // Calculate total asset value
  const totalBalance = assets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white custom-scrollbar pt-24">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8 relative z-10">
        {/* Page Title & Overview */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
            Your Account
          </h1>
          <p className="text-gray-400">
            Manage your assets and track your transactions
          </p>
        </div>

        {/* Wallet Card - Full Width với enhanced styling */}
        <div className="mb-6 bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center">
                  <WalletIcon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xl font-semibold text-white">Wallet</span>
              </div>
              <div className="flex gap-2">
                <button className="bg-primary/20 hover:bg-primary/30 border border-primary/40 px-4 py-2 rounded-lg text-sm font-medium text-primary transition-all duration-300 hover:scale-105">
                  <PlusIcon className="w-4 h-4 mr-1 inline" /> Deposit
                </button>
              </div>
            </div>

            <div className="text-4xl font-bold mb-2 text-primary">
              ${totalBalance.toLocaleString()}
            </div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center text-green-400">
                <span className="text-sm">+5.2% in the last 24h</span>
              </div>
            </div>

            {/* Card Information với enhanced styling */}
            <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 rounded-lg p-4 text-white border border-gray-700/50 shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs opacity-80 text-gray-300">CARD HOLDER</p>
                  <p className="font-semibold text-white">[Your Name]</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-80 text-gray-300">EXPIRES</p>
                  <p className="font-semibold text-white">12/28</p>
                </div>
              </div>
              <div className="mb-3">
                <p className="text-xs opacity-80 text-gray-300">CARD NUMBER</p>
                <p className="font-mono text-lg tracking-wider text-white">
                  **** **** **** 1234
                </p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs opacity-80 text-gray-300">BALANCE</p>
                  <p className="font-bold text-primary">${totalBalance.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <div className="w-8 h-6 bg-primary/30 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid - Assets, Transactions, and Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-stretch">
          {/* Assets - với enhanced styling */}
          <div className="lg:col-span-1 flex">
            <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl flex-1 flex flex-col transition-all duration-300 hover:scale-105 hover:border-primary/30">
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Your Assets</span>
                  <div className="bg-primary/20 border border-primary/30 px-2 py-1 rounded text-xs text-primary">
                    {assets.length} assets
                  </div>
                </div>
              </div>
              <div className="p-4 flex-1">
                <div className="space-y-3">
                  {assets.map((asset) => (
                    <div key={asset.id}>
                      <AssetItem asset={asset} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Transactions - với enhanced styling */}
          <div className="lg:col-span-1 flex">
            <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl flex-1 flex flex-col transition-all duration-300 hover:scale-105 hover:border-cyan-400/30">
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Recent Transactions</span>
                  <button className="bg-cyan-400/20 hover:bg-cyan-400/30 border border-cyan-400/40 px-3 py-1 rounded text-xs text-cyan-400 transition-all duration-300">
                    View all <ArrowRightIcon className="w-3 h-3 ml-1 inline" />
                  </button>
                </div>
              </div>
              <div className="p-4 flex-1">
                <div className="space-y-3">
                  {transactions.map((t) => (
                    <div key={t.id}>
                      <TransactionItem
                        transaction={t}
                        getTransactionIcon={getTransactionIcon}
                        getStatusBadge={getStatusBadge}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chart - với enhanced styling */}
          <div className="lg:col-span-1 flex">
            <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl flex-1 flex flex-col transition-all duration-300 hover:scale-105 hover:border-purple-400/30 hover:shadow-purple-400/20">
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">Portfolio Chart</span>
                  <div className="bg-purple-400/20 border border-purple-400/30 px-2 py-1 rounded text-xs text-purple-400">
                    Last 7 days
                  </div>
                </div>
              </div>
              <div className="p-4 flex-1">
                <AssetChart assetHistory={assetHistory} />
                <div className="flex flex-wrap gap-2 mt-4">
                  {assetHistory.map((asset) => (
                    <div
                      key={asset.id}
                      className="flex items-center gap-1 px-2 py-1 rounded-md text-xs border transition-all duration-300"
                      style={{
                        backgroundColor: `${asset.color}20`,
                        borderColor: `${asset.color}40`,
                        color: asset.color
                      }}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: asset.color }}
                      ></div>
                      <span>{asset.name}</span>
                    </div>
                  ))}
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
