"use client";

import { useState, useEffect } from "react";
import { GoldPriceData, GoldPriceService } from "@/utils/goldPriceService";

interface GoldPriceWidgetProps {
  className?: string;
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

export default function GoldPriceWidget({
  className = "",
  autoRefresh = true,
  refreshInterval = 60000, // 1 minute
}: GoldPriceWidgetProps) {
  const [goldData, setGoldData] = useState<GoldPriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchGoldPrice = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await GoldPriceService.fetchGoldPrice();

      if (data) {
        setGoldData(data);
        setLastUpdated(new Date());
      } else {
        setError("Không thể lấy dữ liệu giá vàng");
      }
    } catch (err) {
      setError("Lỗi khi tải dữ liệu giá vàng");
      console.error("Error fetching gold price:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoldPrice();

    if (autoRefresh) {
      const interval = setInterval(fetchGoldPrice, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const handleRefresh = () => {
    fetchGoldPrice();
  };

  if (loading && !goldData) {
    return (
      <div className={`p-4 border rounded-lg bg-white shadow-sm ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-4 border rounded-lg bg-red-50 border-red-200 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-red-800 font-medium">Lỗi tải dữ liệu</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 border rounded-lg bg-white shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          🏆 Giá Vàng Hiện Tại
        </h3>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Đang tải..." : "Làm mới"}
        </button>
      </div>

      {lastUpdated && (
        <p className="text-xs text-gray-500 mb-3">
          Cập nhật lần cuối: {lastUpdated.toLocaleString("vi-VN")}
        </p>
      )}

      <div className="space-y-2">
        {goldData && typeof goldData === "object" ? (
          Object.entries(goldData).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0"
            >
              <span className="text-sm font-medium text-gray-700 capitalize">
                {key.replace(/_/g, " ")}:
              </span>
              <span className="text-sm text-gray-900 font-semibold">
                {typeof value === "object"
                  ? JSON.stringify(value)
                  : String(value || "")}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">
            Không có dữ liệu hiển thị
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">
          Dữ liệu từ DAMS Assets API • Cập nhật tự động mỗi phút
        </p>
      </div>
    </div>
  );
}
