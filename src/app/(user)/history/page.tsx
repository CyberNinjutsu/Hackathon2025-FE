"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Download,
  Filter,
  Search,
  ArrowRightLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import TransactionIcon from "@/components/TransactionIcon";
import { useAuth } from "@/lib/AuthContext";
import { useTransactionHistory } from "@/utils/useTransactionHistory";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getTypeColorClass } from "@/utils/Helper";
import { Transaction } from "@/utils/Types";

function formatTokenAmount(number: number, decimals: number = 6) {
  if (number === null || number === undefined || isNaN(number)) return "0";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: decimals,
  }).format(number);
}

function shortenSignature(sig: string, chars = 6) {
  if (!sig) return "";
  if (sig.length <= chars * 2) return sig;
  return `${sig.slice(0, chars)}...${sig.slice(-chars)}`;
}
function TransactionAmount({ tx }: { tx: Transaction }) {
  if (tx.type === "Swap" && tx.secondaryToken) {
    return (
      <div className="flex flex-col items-start text-sm">
        <span className="text-red-400 font-normal">
          -{formatTokenAmount(tx.amount, 0)} {tx.assetSymbol}
        </span>
        <div className="flex items-center gap-1 text-gray-400">
          <ArrowRightLeft className="h-3 w-3" />
          <span className="text-green-400 font-normal">
            +{formatTokenAmount(tx.secondaryToken.amount, 0)}{" "}
            {tx.secondaryToken.symbol}
          </span>
        </div>
      </div>
    );
  }

  return (
    <span
      className={
        tx.type === "Send"
          ? "text-red-400"
          : tx.type === "Receive" || tx.type === "Mint"
          ? "text-green-400"
          : "text-white"
      }
    >
      {tx.type === "Send"
        ? "-"
        : tx.type === "Receive" || tx.type === "Mint"
        ? "+"
        : ""}
      {formatTokenAmount(tx.amount, 0)} {tx.assetSymbol}
    </span>
  );
}

function MobileTransactionAmount({ tx }: { tx: Transaction }) {
  if (tx.type === "Swap" && tx.secondaryToken) {
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-red-400 text-sm">
            -{formatTokenAmount(tx.amount, 0)} {tx.assetSymbol}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <ArrowRightLeft className="h-3 w-3 text-gray-400" />
          <span className="text-green-400 text-sm">
            +{formatTokenAmount(tx.secondaryToken.amount, 0)}{" "}
            {tx.secondaryToken.symbol}
          </span>
        </div>
      </div>
    );
  }

  // Giao dịch thông thường
  return (
    <div className="font-semibold mb-1">
      <span
        className={
          tx.type === "Send"
            ? "text-red-400"
            : tx.type === "Receive" || tx.type === "Mint"
            ? "text-green-400"
            : "text-white"
        }
      >
        {tx.type === "Send"
          ? "-"
          : tx.type === "Receive" || tx.type === "Mint"
          ? "+"
          : ""}
        {formatTokenAmount(tx.amount, 0)} {tx.assetSymbol}
      </span>
    </div>
  );
}

function TransactionValue({ tx }: { tx: Transaction }) {
  if (tx.type === "Swap") {
    return <span className="text-gray-400">—</span>;
  }
  return <span className="font-bold">${tx.value.toLocaleString("en-US")}</span>;
}

export default function HistoryPage() {
  const router = useRouter();

  const {
    publicKey: userPublicKey,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();

  const { transactions, isLoading, error, hasMore, fetchTransactions, total } =
    useTransactionHistory(userPublicKey);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      toast.error("Access required", {
        description: "You must connect a wallet to view this page.",
      });
      router.push("/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch history", {
        description: error.message,
      });
    }
  }, [error]);

  if (isAuthLoading || (isLoading && transactions.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        {isAuthLoading ? "Checking authentication..." : "Loading history..."}
      </div>
    );
  }
  if (!isAuthenticated) {
    return null;
  }
  const totalLoaded = transactions.length;

  return (
    <div className="min-h-screen bg-transparent text-foreground pt-24 max-w-6xl mx-auto">
      <div className="relative z-10 space-y-6 p-4 sm:p-6 ">
        <div className="glass-card p-6  space-y-6 hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              className="bg-red-500/20 border-red-400/50 text-red-100 hover:bg-red-500/30 hover:border-red-400 hover:text-red-50 hover:scale-105 transition-all 
                          duration-300 group backdrop-blur-sm"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Back
            </Button>
            <Button className="bg-green-500/20 border-green-400/50 text-green-100 hover:bg-green-500/30 hover:border-green-400 hover:text-green-50 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>

          {/* Page title*/}
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2">
              Transaction History
            </h1>
            <p className="text-sm text-gray-300">
              Review and manage all your completed transactions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Filter className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold text-white">
              Filters & Search
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by address, TxID..."
                className="glass-input pl-10 border-0 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <Select>
                <SelectTrigger className="glass-input border-0 text-white focus:ring-2 focus:ring-purple-400">
                  <SelectValue placeholder="All transaction types" />
                </SelectTrigger>
                <SelectContent className="glass-card border-0">
                  <SelectItem value="all">All transaction types</SelectItem>
                  <SelectItem value="send">Send</SelectItem>
                  <SelectItem value="receive">Receive</SelectItem>
                  <SelectItem value="swap">Swap</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select>
                <SelectTrigger className="glass-input border-0 text-white focus:ring-2 focus:ring-purple-400">
                  <SelectValue placeholder="All assets" />
                </SelectTrigger>
                <SelectContent className="glass-card border-0">
                  <SelectItem value="all">All assets</SelectItem>
                  <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button
                variant="outline"
                className="bg-blue-500/20 border-blue-400/50 text-blue-100 hover:bg-blue-500/30 hover:border-blue-400 hover:text-blue-50 w-full text-left font-normal hover:scale-105 transition-all duration-300 backdrop-blur-sm"
              >
                <span>Select date range</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Data table */}
        <div className="glass-card overflow-x-auto hover:scale-[1.01] transition-all duration-300">
          <Table className="min-w-[600px] hidden sm:table">
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="w-[50px] text-white font-semibold">
                  #
                </TableHead>
                <TableHead className="text-white font-semibold">Type</TableHead>
                <TableHead className="hidden lg:table-cell text-white font-semibold">
                  Signature
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Amount
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Value
                </TableHead>
                <TableHead className="hidden md:table-cell text-white font-semibold">
                  Status
                </TableHead>
                <TableHead className="text-right text-white font-semibold">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx, index) => (
                <TableRow
                  key={tx.id}
                  className="border-gray-700 hover:bg-white/5 transition-colors duration-200"
                >
                  <TableCell className="font-medium text-gray-300">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-white">
                    <div className="flex items-center gap-3">
                      <TransactionIcon type={tx.type} />
                      <span
                        className={`font-semibold ${getTypeColorClass(
                          tx.type
                        )}`}
                      >
                        {tx.type}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-300 font-mono text-sm hover:text-purple-400 transition-colors">
                    <Link
                      href={`https://explorer.solana.com/tx/${tx.id}?cluster=devnet`}
                      target="_blank"
                    >
                      {shortenSignature(tx.id)}
                    </Link>
                  </TableCell>
                  <TableCell className="font-semibold">
                    <TransactionAmount tx={tx} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-green-400">
                    <TransactionValue tx={tx} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant="outline"
                      className={
                        tx.status === "Completed"
                          ? "text-green-400 border-green-400 bg-green-400/10"
                          : tx.status === "Pending"
                          ? "text-yellow-400 border-yellow-400 bg-yellow-400/10"
                          : "text-red-400 border-red-400 bg-red-400/10"
                      }
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-gray-400">
                    {format(new Date(tx.date), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-4 p-4">
            {transactions.map((tx, index) => (
              <div
                key={index}
                className="glass-card p-4 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <TransactionIcon type={tx.type} />
                    <span
                      className={`font-semibold ${getTypeColorClass(tx.type)}`}
                    >
                      {tx.type}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {format(new Date(tx.date), "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
                <div className="mb-3">
                  <MobileTransactionAmount tx={tx} />
                  {tx.id && (
                    <div className="text-xs text-gray-400 truncate font-mono hover:text-purple-400 transition-colors">
                      <Link
                        href={`https://explorer.solana.com/tx/${tx.id}?cluster=devnet`}
                        target="_blank"
                      >
                        {shortenSignature(tx.id)}
                      </Link>
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-green-400 text-lg">
                    <TransactionValue tx={tx} />
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      tx.status === "Completed"
                        ? "text-green-400 border-green-400 bg-green-400/10"
                        : tx.status === "Pending"
                        ? "text-yellow-400 border-yellow-400 bg-yellow-400/10"
                        : "text-red-400 border-red-400 bg-red-400/10"
                    }
                  >
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination & Load More */}
        {transactions.length > 0 && (
          <div className="flex items-center justify-between mt-6 px-4 sm:px-0">
            <div className="text-sm text-gray-400">
              Showing{" "}
              <span className="font-medium text-white">{totalLoaded}</span>{" "}
              transactions
            </div>
            {hasMore ? (
              <Button
                className="bg-purple-500/20 border-purple-400/50 text-purple-100 hover:bg-purple-500/30 hover:border-purple-400 hover:text-purple-50 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
                onClick={fetchTransactions}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load More"}
              </Button>
            ) : (
              <div className="text-sm text-gray-500">
                You&apos;ve reached the end.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
