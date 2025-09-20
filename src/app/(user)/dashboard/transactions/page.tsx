"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownLeft,
  History,
  Search,
  Calendar,
  Download,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const transactions = [
  {
    id: 1,
    type: "Mua",
    asset: "Vàng SJC",
    amount: 100000000,
    tokens: 100,
    date: "2024-06-15",
    time: "14:30",
    status: "Thành công",
    txHash: "0x1234...5678",
  },
  {
    id: 2,
    type: "Bán",
    asset: "Căn hộ Q1",
    amount: 50000000,
    tokens: 50,
    date: "2024-06-14",
    time: "09:15",
    status: "Chờ xử lý",
    txHash: "0x2345...6789",
  },
  {
    id: 3,
    type: "Trao đổi",
    asset: "Trái phiếu",
    amount: 25000000,
    tokens: 25,
    date: "2024-06-13",
    time: "16:45",
    status: "Thất bại",
    txHash: "0x3456...7890",
  },
  {
    id: 4,
    type: "Mua",
    asset: "Vàng 9999",
    amount: 75000000,
    tokens: 75,
    date: "2024-06-12",
    time: "11:20",
    status: "Thành công",
    txHash: "0x4567...8901",
  },
  {
    id: 5,
    type: "Bán",
    asset: "Nhà phố Q7",
    amount: 200000000,
    tokens: 200,
    date: "2024-06-11",
    time: "13:10",
    status: "Thành công",
    txHash: "0x5678...9012",
  },
  {
    id: 6,
    type: "Trao đổi",
    asset: "Trái phiếu chính phủ",
    amount: 30000000,
    tokens: 30,
    date: "2024-06-10",
    time: "10:05",
    status: "Chờ xử lý",
    txHash: "0x6789...0123",
  },
];

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.txHash.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
    const matchesType = typeFilter === "all" || tx.type === typeFilter;

    let matchesDate = true;
    if (dateFilter !== "all") {
      const txDate = new Date(tx.date);
      const today = new Date();
      const daysDiff = Math.floor(
        (today.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      switch (dateFilter) {
        case "today":
          matchesDate = daysDiff === 0;
          break;
        case "week":
          matchesDate = daysDiff <= 7;
          break;
        case "month":
          matchesDate = daysDiff <= 30;
          break;
      }
    }

    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "Mua":
        return <ArrowDownLeft className="h-4 w-4 text-green-400" />;
      case "Bán":
        return <ArrowUpRight className="h-4 w-4 text-red-400" />;
      default:
        return (
          <History
            className="h-4 w-4"
            style={{ color: "oklch(0.65 0.18 260)" }}
          />
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Thành công":
        return "bg-green-500/20 text-green-400";
      case "Chờ xử lý":
        return "bg-yellow-500/20 text-yellow-400";
      case "Thất bại":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const totalTransactions = transactions.length;
  const successfulTransactions = transactions.filter(
    (tx) => tx.status === "Thành công",
  ).length;
  const pendingTransactions = transactions.filter(
    (tx) => tx.status === "Chờ xử lý",
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Lịch sử giao dịch
          </h1>
          <p className="text-sm" style={{ color: "oklch(0.65 0.18 260)" }}>
            Theo dõi và quản lý các giao dịch token
          </p>
        </div>
        <button className="glass-button px-4 py-2 flex items-center gap-2 w-fit">
          <Download className="h-4 w-4" />
          Xuất báo cáo
        </button>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <div className="glass-card p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "oklch(0.65 0.18 260)" }}>
                Tổng giao dịch
              </p>
              <p className="text-xl lg:text-2xl font-bold text-white">
                {totalTransactions}
              </p>
            </div>
            <History
              className="h-6 w-6 lg:h-8 lg:w-8"
              style={{ color: "oklch(0.65 0.18 260)" }}
            />
          </div>
        </div>

        <div className="glass-card p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "oklch(0.65 0.18 260)" }}>
                Thành công
              </p>
              <p className="text-xl lg:text-2xl font-bold text-white">
                {successfulTransactions}
              </p>
            </div>
            <ArrowUpRight className="h-6 w-6 lg:h-8 lg:w-8 text-green-400" />
          </div>
        </div>

        <div className="glass-card p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "oklch(0.65 0.18 260)" }}>
                Đang xử lý
              </p>
              <p className="text-xl lg:text-2xl font-bold text-white">
                {pendingTransactions}
              </p>
            </div>
            <Calendar className="h-6 w-6 lg:h-8 lg:w-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="glass-card p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                style={{ color: "oklch(0.65 0.18 260)" }}
              />
              <input
                type="text"
                placeholder="Tìm kiếm theo tài sản hoặc mã giao dịch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-2 text-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="glass-input w-40 text-white">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20">
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Thành công">Thành công</SelectItem>
                <SelectItem value="Chờ xử lý">Chờ xử lý</SelectItem>
                <SelectItem value="Thất bại">Thất bại</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="glass-input w-40 text-white">
                <SelectValue placeholder="Loại giao dịch" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20">
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="Mua">Mua</SelectItem>
                <SelectItem value="Bán">Bán</SelectItem>
                <SelectItem value="Trao đổi">Trao đổi</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="glass-input w-40 text-white">
                <SelectValue placeholder="Thời gian" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="week">7 ngày qua</SelectItem>
                <SelectItem value="month">30 ngày qua</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Bảng giao dịch */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th
                  className="text-left p-4 font-semibold"
                  style={{ color: "oklch(0.65 0.18 260)" }}
                >
                  Giao dịch
                </th>
                <th
                  className="text-left p-4 font-semibold hidden md:table-cell"
                  style={{ color: "oklch(0.65 0.18 260)" }}
                >
                  Tài sản
                </th>
                <th
                  className="text-left p-4 font-semibold"
                  style={{ color: "oklch(0.65 0.18 260)" }}
                >
                  Số tiền
                </th>
                <th
                  className="text-left p-4 font-semibold hidden lg:table-cell"
                  style={{ color: "oklch(0.65 0.18 260)" }}
                >
                  Token
                </th>
                <th
                  className="text-left p-4 font-semibold hidden xl:table-cell"
                  style={{ color: "oklch(0.65 0.18 260)" }}
                >
                  Thời gian
                </th>
                <th
                  className="text-left p-4 font-semibold"
                  style={{ color: "oklch(0.65 0.18 260)" }}
                >
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(tx.type)}
                      <div>
                        <span className="text-white font-medium block">
                          {tx.type}
                        </span>
                        <span
                          className="text-xs md:hidden"
                          style={{ color: "oklch(0.65 0.18 260)" }}
                        >
                          {tx.asset}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-white hidden md:table-cell">
                    {tx.asset}
                  </td>
                  <td className="p-4">
                    <div>
                      <span className="text-white font-medium">
                        {formatCurrency(tx.amount)}
                      </span>
                      <span
                        className="text-xs lg:hidden block"
                        style={{ color: "oklch(0.65 0.18 260)" }}
                      >
                        {tx.tokens} tokens
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-white hidden lg:table-cell">
                    {tx.tokens}
                  </td>
                  <td
                    className="p-4 hidden xl:table-cell"
                    style={{ color: "oklch(0.65 0.18 260)" }}
                  >
                    <div>
                      <div>{tx.date}</div>
                      <div className="text-xs">{tx.time}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        tx.status,
                      )}`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white/70">
              Không tìm thấy giao dịch nào phù hợp
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
