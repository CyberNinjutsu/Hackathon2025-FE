"use client";

import { useState } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Coins,
  Building,
  FileText,
  Search,
  Filter,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const portfolioAssets = [
  {
    id: 1,
    type: "Vàng SJC",
    icon: Coins,
    currentValue: 520000000,
    tokens: 520,
    issueDate: "2024-01-15",
    change: 5.2,
    category: "Vàng",
  },
  {
    id: 2,
    type: "Căn hộ Q1",
    icon: Building,
    currentValue: 850000000,
    tokens: 850,
    issueDate: "2024-02-20",
    change: -2.1,
    category: "Bất động sản",
  },
  {
    id: 3,
    type: "Trái phiếu chính phủ",
    icon: FileText,
    currentValue: 200000000,
    tokens: 200,
    issueDate: "2024-03-10",
    change: 1.8,
    category: "Trái phiếu",
  },
  {
    id: 4,
    type: "Vàng 9999",
    icon: Coins,
    currentValue: 320000000,
    tokens: 320,
    issueDate: "2024-03-25",
    change: 3.7,
    category: "Vàng",
  },
  {
    id: 5,
    type: "Nhà phố Q7",
    icon: Building,
    currentValue: 1200000000,
    tokens: 1200,
    issueDate: "2024-04-05",
    change: 1.2,
    category: "Bất động sản",
  },
];

export default function Portfolio() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("value");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const filteredAssets = portfolioAssets
    .filter((asset) => {
      const matchesSearch = asset.type
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || asset.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "value":
          return b.currentValue - a.currentValue;
        case "change":
          return b.change - a.change;
        case "date":
          return (
            new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
          );
        default:
          return 0;
      }
    });

  const totalValue = portfolioAssets.reduce(
    (sum, asset) => sum + asset.currentValue,
    0,
  );
  const totalTokens = portfolioAssets.reduce(
    (sum, asset) => sum + asset.tokens,
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header với thống kê tổng quan */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Danh mục tài sản
          </h1>
          <p className="text-sm" style={{ color: "oklch(0.65 0.18 260)" }}>
            Quản lý và theo dõi tài sản đã tokenize
          </p>
        </div>
        <button className="glass-button px-4 py-2 flex items-center gap-2 w-fit">
          <Plus className="h-4 w-4" />
          Thêm tài sản
        </button>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <div className="glass-card p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "oklch(0.65 0.18 260)" }}>
                Tổng giá trị
              </p>
              <p className="text-xl lg:text-2xl font-bold text-white">
                {formatCurrency(totalValue)}
              </p>
            </div>
            <Coins
              className="h-6 w-6 lg:h-8 lg:w-8"
              style={{ color: "oklch(0.65 0.18 260)" }}
            />
          </div>
        </div>

        <div className="glass-card p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "oklch(0.65 0.18 260)" }}>
                Tổng số token
              </p>
              <p className="text-xl lg:text-2xl font-bold text-white">
                {totalTokens.toLocaleString()}
              </p>
            </div>
            <Building
              className="h-6 w-6 lg:h-8 lg:w-8"
              style={{ color: "oklch(0.65 0.18 260)" }}
            />
          </div>
        </div>

        <div className="glass-card p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: "oklch(0.65 0.18 260)" }}>
                Số loại tài sản
              </p>
              <p className="text-xl lg:text-2xl font-bold text-white">
                {portfolioAssets.length}
              </p>
            </div>
            <FileText
              className="h-6 w-6 lg:h-8 lg:w-8"
              style={{ color: "oklch(0.65 0.18 260)" }}
            />
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
                placeholder="Tìm kiếm tài sản..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-2 text-white"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="glass-input w-40 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Loại tài sản" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20">
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Vàng">Vàng</SelectItem>
                <SelectItem value="Bất động sản">Bất động sản</SelectItem>
                <SelectItem value="Trái phiếu">Trái phiếu</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="glass-input w-40 text-white">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20">
                <SelectItem value="value">Theo giá trị</SelectItem>
                <SelectItem value="change">Theo thay đổi</SelectItem>
                <SelectItem value="date">Theo ngày</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Bảng danh sách tài sản */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th
                  className="text-left p-4 font-semibold"
                  style={{ color: "oklch(0.65 0.18 260)" }}
                >
                  Loại tài sản
                </th>
                <th
                  className="text-left p-4 font-semibold hidden md:table-cell"
                  style={{ color: "oklch(0.65 0.18 260)" }}
                >
                  Giá trị hiện tại
                </th>
                <th
                  className="text-left p-4 font-semibold"
                  style={{ color: "oklch(0.65 0.18 260)" }}
                >
                  Số token
                </th>
                <th
                  className="text-left p-4 font-semibold hidden lg:table-cell"
                  style={{ color: "oklch(0.65 0.18 260)" }}
                >
                  Ngày phát hành
                </th>
                <th
                  className="text-left p-4 font-semibold"
                  style={{ color: "oklch(0.65 0.18 260)" }}
                >
                  Thay đổi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => {
                const IconComponent = asset.icon;
                return (
                  <tr
                    key={asset.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <IconComponent
                          className="h-5 w-5 flex-shrink-0"
                          style={{ color: "oklch(0.65 0.18 260)" }}
                        />
                        <div>
                          <span className="text-white font-medium block">
                            {asset.type}
                          </span>
                          <span
                            className="text-sm md:hidden"
                            style={{ color: "oklch(0.65 0.18 260)" }}
                          >
                            {formatCurrency(asset.currentValue)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-white hidden md:table-cell">
                      {formatCurrency(asset.currentValue)}
                    </td>
                    <td className="p-4 text-white">
                      {asset.tokens.toLocaleString()}
                    </td>
                    <td
                      className="p-4 hidden lg:table-cell"
                      style={{ color: "oklch(0.65 0.18 260)" }}
                    >
                      {asset.issueDate}
                    </td>
                    <td className="p-4">
                      <div
                        className={`flex items-center gap-1 ${
                          asset.change > 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {asset.change > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          {asset.change > 0 ? "+" : ""}
                          {asset.change}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAssets.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white/70">Không tìm thấy tài sản nào phù hợp</p>
          </div>
        )}
      </div>
    </div>
  );
}
