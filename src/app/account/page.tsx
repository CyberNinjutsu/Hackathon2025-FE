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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-gray-800 mb-6">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Cryptix
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        {/* Page Title & Overview */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Account</h1>
          <p className="text-gray-400">
            Manage your assets and track your transactions
          </p>
        </div>

        {/* Wallet Card - Full Width */}
        <Card className="mb-6 bg-gradient-to-r from-gray-900/50 to-black/50 border-gray-800 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <WalletIcon className="w-5 h-5" />
                <span>Wallet</span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <PlusIcon className="w-4 h-4 mr-1" /> Deposit
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">
              ${totalBalance.toLocaleString()}
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center text-green-400">
                <span className="text-sm">+5.2% in the last 24h</span>
              </div>
            </div>
            {/* Card Information */}
            <div className="bg-gradient-to-r from-slate-800 via-gray-800 to-slate-900 rounded-lg p-4 text-white border border-gray-700/50 shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-xs opacity-80">CARD HOLDER</p>
                  <p className="font-semibold">[Your Name]</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-80">EXPIRES</p>
                  <p className="font-semibold">12/28</p>
                </div>
              </div>
              <div className="mb-3">
                <p className="text-xs opacity-80">CARD NUMBER</p>
                <p className="font-mono text-lg tracking-wider">
                  **** **** **** 1234
                </p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs opacity-80">BALANCE</p>
                  <p className="font-bold">${totalBalance.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <div className="w-8 h-6 bg-white/20 rounded"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Grid - Assets, Transactions, and Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-stretch">
          {/* Assets - Smaller Column */}
          <div className="lg:col-span-1 flex">
            <Card className="bg-gradient-to-r from-gray-900/50 to-black/50 border-gray-800 backdrop-blur-xl shadow-xl flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Assets</span>
                  <Badge
                    variant="outline"
                    className="bg-gray-800/50 text-gray-300 border-gray-700"
                  >
                    {assets.length} assets
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-3">
                  {assets.map((asset) => (
                    <AssetItem key={asset.id} asset={asset} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transactions - Middle Column */}
        <div className="lg:col-span-1 flex">
          <Card className="bg-gradient-to-r from-gray-900/50 to-black/50 border-gray-800 backdrop-blur-xl shadow-xl flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Transactions</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                >
                  View all <ArrowRightIcon className="w-4 h-4 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-3">
                {transactions.map((t) => (
                  <TransactionItem
                    key={t.id}
                    transaction={t}
                    getTransactionIcon={getTransactionIcon}
                    getStatusBadge={getStatusBadge}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart - Right Column */}
        <div className="lg:col-span-1 flex">
          <Card className="bg-gradient-to-r from-gray-900/50 to-black/50 border-gray-800 backdrop-blur-xl shadow-xl transition-all duration-300 hover:shadow-blue-500/10 flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Portfolio Chart</span>
                <Badge
                  variant="outline"
                  className="bg-gray-800/50 text-gray-300 border-gray-700"
                >
                  Last 7 days
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <AssetChart assetHistory={assetHistory} />
              <div className="flex flex-wrap gap-2 mt-4">
                {assetHistory.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex items-center gap-1 bg-gray-800/30 px-2 py-1 rounded-md"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: asset.color }}
                    ></div>
                    <span className="text-xs">{asset.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
