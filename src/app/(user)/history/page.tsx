"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Download,
  Filter,
  Repeat,
  Search,
} from "lucide-react";
import {
  AccountInfo,
  Connection,
  ParsedAccountData,
  ParsedInstruction,
  PartiallyDecodedInstruction,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner"; // Thêm toast để thông báo

const transactionIcons = {
  Send: <ArrowUpRight className="h-4 w-4 text-red-400" />,
  Receive: <ArrowDownLeft className="h-4 w-4 text-green-400" />,
  Swap: <Repeat className="h-4 w-4 text-blue-400" />,
};

/**
 * Number.prototype.format(n, x, s, c)
 *
 * @param integer n: length of decimal
 * @param integer x: length of whole part
 * @param mixed   s: sections delimiter
 * @param mixed   c: decimal delimiter
 */
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

export default function HistoryPage() {
  const router = useRouter();
  interface Transaction {
    id: string;
    type: "Send" | "Receive" | "Mint" | "Other";
    assetSymbol: string;
    amount: number;
    value: number;
    status: "Completed" | "Pending" | "Failed";
    date: string;
    address?: string;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    publicKey: userPublicKey,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();
  const mintsInfo = new Map<
    string,
    AccountInfo<Buffer | ParsedAccountData> | null
  >();

  useEffect(() => {
    // Chỉ chạy logic sau khi context đã kiểm tra xong
    if (!isAuthLoading && !isAuthenticated) {
      toast.error("Yêu cầu truy cập", {
        description: "Bạn cần đăng nhập bằng ví để xem trang này.",
      });
      router.push("/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated || !userPublicKey) {
      if (!isAuthLoading) setIsLoading(false);
      return;
    }
    const fetchTransactions = async () => {
      setIsLoading(true);
      setTransactions([]);
      try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const walletPubKey = new PublicKey(userPublicKey); //8eqFjpT5Z9Pgr7jNWBYSfk3Goe5DXfmRvCgL9qX3WdAR
        const myTokenAddresses = new Set<string>();

        const [signatures] = await Promise.all([
          connection.getSignaturesForAddress(walletPubKey, { limit: 20 }),

          connection.getParsedTokenAccountsByOwner(walletPubKey, {
            programId: TOKEN_2022_PROGRAM_ID,
          }),
          connection.getParsedTokenAccountsByOwner(walletPubKey, {
            programId: TOKEN_PROGRAM_ID,
          }),
        ]);

        // const signatures = await connection.getSignaturesForAddress(
        //   walletPubKey,
        //   { limit: 20 }
        // );

        const txList: Transaction[] = [];
        for (const sigInfo of signatures) {
          const tx = await connection.getParsedTransaction(sigInfo.signature, {
            maxSupportedTransactionVersion: 0,
          });

          if (!tx || !tx.blockTime) continue;

          let type: Transaction["type"] = "Other";
          let amount = 0;
          let address = "";
          let assetSymbol = "N/A";
          const blockTimeSec = tx.blockTime ?? sigInfo.blockTime ?? 0;

          if (tx.meta?.err) {
            txList.push({
              id: sigInfo.signature,
              type: "Other",
              assetSymbol,
              amount: 0,
              value: 0,
              status: "Failed",
              date: new Date(blockTimeSec * 1000).toISOString(),
            });
            continue;
          }
          const inner =
            tx.meta?.innerInstructions?.flatMap((i) => i.instructions) ?? [];
          const instructions = [
            ...tx.transaction.message.instructions,
            ...inner,
          ];
          // Parse instructions cho token transfers/mint
          // const instructions = tx.transaction.message.instructions.concat(
          //   ((tx.meta ? tx.meta.innerInstructions : []) || []).flatMap(
          //     (inner) => inner.instructions
          //   )
          // );
          // tx.transaction.message.instructions[0];
          for (const instruction of instructions as (
            | ParsedInstruction
            | PartiallyDecodedInstruction
          )[]) {
            // const _instruction = instruction as ParsedInstruction;
            const parsedInstruction =
              "parsed" in (instruction as ParsedInstruction)
                ? (instruction as ParsedInstruction).parsed
                : undefined;

            if (!parsedInstruction) continue;
            if (parsedInstruction.type == "transferChecked") {
              const t = parsedInstruction.info.tokenAmount;
              amount =
                t.uiAmount ?? Number(t.amount) / Math.pow(10, t.decimals || 0);

              address =
                parsedInstruction.info.destination ||
                parsedInstruction.info.source;
              if (
                parsedInstruction.info.destination &&
                myTokenAddresses.size > 0
              ) {
                type = myTokenAddresses.has(parsedInstruction.info.destination)
                  ? "Receive"
                  : "Send";
              }

              // assetSymbol = ix.parsed?.info.mint;
              if (!mintsInfo.has(parsedInstruction.info.mint)) {
                const mintAccount = await connection.getParsedAccountInfo(
                  new PublicKey(parsedInstruction.info.mint)
                );
                mintsInfo.set(parsedInstruction.info.mint, mintAccount.value);
                // console.log('Fetched mint account:', mintAccount);
              }

              if (mintsInfo.get(parsedInstruction.info.mint)?.data) {
                const mintData = mintsInfo.get(parsedInstruction.info.mint)
                  ?.data as ParsedAccountData;
                if (mintData.parsed?.info?.extensions)
                  for (const ext of mintData.parsed?.info?.extensions) {
                    if (ext.extension == "tokenMetadata") {
                      assetSymbol = ext.state.symbol || "N/A";
                      break;
                    }
                  }
              }

              break;
            }
          }

          if (amount > 0) {
            txList.push({
              id: sigInfo.signature,
              type,
              assetSymbol,
              amount,
              value: 0, // Không có giá, đặt 0
              status:
                sigInfo.confirmationStatus === "confirmed" ||
                sigInfo.confirmationStatus === "finalized"
                  ? "Completed"
                  : "Pending",
              date: new Date(blockTimeSec * 1000).toISOString(),
              address,
            });
          }
        }

        setTransactions(
          txList.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
        );
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [isAuthenticated, userPublicKey, isAuthLoading]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Đang kiểm tra phiên đăng nhập...
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Đang tải lịch sử...
      </div>
    );
  }
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <div className="absolute inset-0 overflow-hidden z-1">
        <div className="absolute w-[600px] h-[600px] bg-[#00ffb2]/10 blur-3xl rounded-full -top-[300px] -left-[300px]" />
        <div className="absolute w-[600px] h-[600px] bg-[#00ffb2]/10 blur-3xl rounded-full -top-[300px] -right-[300px]" />
        <div className="absolute w-[300px] h-[300px] bg-[#00ffb2]/20 blur-3xl rounded-full -top-[100px] -left-[100px]" />
        <div className="absolute w-[300px] h-[300px] bg-[#00ffb2]/20 blur-3xl rounded-full -top-[100px] -right-[100px]" />
      </div>
      <div className="relative z-10 space-y-6 p-4 sm:p-6">
        <div className="flex flex-col space-y-4">
          {/* Nút quay lại */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              className="bg-red-500/20 border-red-400/50 text-red-100 hover:bg-red-500/30 hover:border-red-400 hover:text-red-50 hover:scale-105 transition-all 
                          duration-300 group backdrop-blur-sm"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Quay lại
            </Button>
            <Button className="bg-green-500/20 border-green-400/50 text-green-100 hover:bg-green-500/30 hover:border-green-400 hover:text-green-50 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
              <Download className="mr-2 h-4 w-4" />
              Export Dữ liệu
            </Button>
          </div>

          {/* Tiêu đề trang */}
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2 floating">
              Lịch sử Giao dịch
            </h1>
            <p className="text-sm text-gray-300">
              Xem lại và quản lý tất cả các giao dịch đã thực hiện.
            </p>
          </div>
        </div>

        {/* --- PHẦN BỘ LỌC VÀ TÌM KIẾM --- */}
        <div className="glass-card p-6 space-y-6 hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-3">
            <Filter className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold text-white">
              Bộ lọc & Tìm kiếm
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo địa chỉ, TxID..."
                className="glass-input pl-10 border-0 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div>
              <Select>
                <SelectTrigger className="glass-input border-0 text-white focus:ring-2 focus:ring-purple-400">
                  <SelectValue placeholder="Tất cả loại giao dịch" />
                </SelectTrigger>
                <SelectContent className="glass-card border-0">
                  <SelectItem value="all">Tất cả loại giao dịch</SelectItem>
                  <SelectItem value="send">Gửi</SelectItem>
                  <SelectItem value="receive">Nhận</SelectItem>
                  <SelectItem value="swap">Hoán đổi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select>
                <SelectTrigger className="glass-input border-0 text-white focus:ring-2 focus:ring-purple-400">
                  <SelectValue placeholder="Tất cả tài sản" />
                </SelectTrigger>
                <SelectContent className="glass-card border-0">
                  {/* TODO: Lặp qua danh sách tài sản của người dùng */}
                  <SelectItem value="all">Tất cả tài sản</SelectItem>
                  <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              {/* TODO: Thay bằng Date Range Picker component */}
              <Button
                variant="outline"
                className="bg-blue-500/20 border-blue-400/50 text-blue-100 hover:bg-blue-500/30 hover:border-blue-400 hover:text-blue-50 w-full text-left font-normal hover:scale-105 transition-all duration-300 backdrop-blur-sm"
              >
                <span>Chọn khoảng thời gian</span>
              </Button>
            </div>
          </div>
        </div>

        {/* --- PHẦN BẢNG DỮ LIỆU --- */}
        <div className="glass-card overflow-x-auto hover:scale-[1.01] transition-all duration-300">
          {/* Bảng cho tablet/desktop */}
          <Table className="min-w-[600px] hidden sm:table">
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-white font-semibold">Loại</TableHead>
                <TableHead className="hidden lg:table-cell text-white font-semibold">
                  Chữ ký
                </TableHead>
                <TableHead className="hidden md:table-cell text-white font-semibold">
                  Số lượng
                </TableHead>
                <TableHead className="hidden md:table-cell text-white font-semibold">
                  Giá trị
                </TableHead>
                <TableHead className="hidden md:table-cell text-white font-semibold">
                  Trạng thái
                </TableHead>
                <TableHead className="text-right text-white font-semibold">
                  Ngày
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow
                  key={tx.id}
                  className="border-gray-700 hover:bg-white/5 transition-colors duration-200"
                >
                  <TableCell className="text-white">
                    <div className="flex items-center gap-3">
                      {
                        transactionIcons[
                          tx.type as keyof typeof transactionIcons
                        ]
                      }
                      <span className="font-semibold">{tx.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-gray-300 font-mono text-sm">
                    <Link
                      href={`https://solscan.io/tx/${tx.id}?cluster=devnet`}
                      target="_blank"
                    >
                      {tx.id}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-white font-semibold">
                    {formatNumber(tx.amount, 0, 3, ".")} {tx.assetSymbol}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-green-400 font-bold">
                    ${tx.value.toLocaleString("en-US")}
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
                      {tx.status === "Completed"
                        ? "Hoàn thành"
                        : tx.status === "Pending"
                        ? "Chờ xử lý"
                        : "Thất bại"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-gray-400">
                    {format(new Date(tx.date), "dd/MM/yyyy HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Card cho mobile */}
          <div className="sm:hidden space-y-4 p-4">
            {transactions.map((tx, index) => (
              <div
                key={index}
                className="glass-card p-4 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    {transactionIcons[tx.type as keyof typeof transactionIcons]}
                    <span className="font-semibold text-white">{tx.type}</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {format(new Date(tx.date), "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
                <div className="mb-3">
                  <div className="text-white font-semibold mb-1">
                    {formatNumber(tx.amount, 0, 3, ".")} {tx.assetSymbol}
                  </div>
                  {tx.id && (
                    <div className="text-xs text-gray-400 truncate font-mono">
                      {tx.id}
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-green-400 text-lg">
                    ${tx.value.toLocaleString("en-US")}
                  </span>
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
                    {tx.status === "Completed"
                      ? "Hoàn thành"
                      : tx.status === "Pending"
                      ? "Chờ xử lý"
                      : "Thất bại"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* --- PHẦN PHÂN TRANG --- */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Hiển thị 5 giao dịch trên tổng số 50
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">Trang 1 trên 10</span>
            <div className="space-x-2">
              <Button
                size="sm"
                className="bg-purple-500/20 border-purple-400/50 text-purple-100 hover:bg-purple-500/30 hover:border-purple-400 hover:text-purple-50 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
              >
                Trước
              </Button>
              <Button
                size="sm"
                className="bg-purple-500/20 border-purple-400/50 text-purple-100 hover:bg-purple-500/30 hover:border-purple-400 hover:text-purple-50 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
              >
                Sau
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
