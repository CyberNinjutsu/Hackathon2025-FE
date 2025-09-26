"use client";

import { useState, useEffect, useCallback } from "react";
import { GoldPriceData, GoldPriceService } from "@/utils/goldPriceService";

interface UseGoldPriceOptions {
  autoRefresh?: boolean;
  refreshInterval?: number;
  onError?: (error: string) => void;
  onSuccess?: (data: GoldPriceData) => void;
}

interface UseGoldPriceReturn {
  goldData: GoldPriceData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
  analyzeWithAI: (question?: string) => Promise<{
    success: boolean;
    analysis?: string;
    goldData?: GoldPriceData;
    timestamp?: string;
    error?: string;
  }>;
}

export function useGoldPrice(
  options: UseGoldPriceOptions = {}
): UseGoldPriceReturn {
  const {
    autoRefresh = false,
    refreshInterval = 60000, // 1 minute
    onError,
    onSuccess,
  } = options;

  const [goldData, setGoldData] = useState<GoldPriceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchGoldPrice = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await GoldPriceService.fetchGoldPrice();

      if (data) {
        setGoldData(data);
        setLastUpdated(new Date());
        onSuccess?.(data);
      } else {
        const errorMsg = "Không thể lấy dữ liệu giá vàng";
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err) {
      const errorMsg = "Lỗi khi tải dữ liệu giá vàng";
      setError(errorMsg);
      onError?.(errorMsg);
      console.error("Error fetching gold price:", err);
    } finally {
      setLoading(false);
    }
  }, [onError, onSuccess]);

  const analyzeWithAI = useCallback(
    async (question: string = "Phân tích giá vàng hiện tại") => {
      try {
        const response = await fetch("/api/gold-price-analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
      } catch (error) {
        console.error("Error analyzing gold price with AI:", error);
        throw error;
      }
    },
    []
  );

  useEffect(() => {
    fetchGoldPrice();

    if (autoRefresh) {
      const interval = setInterval(fetchGoldPrice, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchGoldPrice, autoRefresh, refreshInterval]);

  return {
    goldData,
    loading,
    error,
    lastUpdated,
    refresh: fetchGoldPrice,
    analyzeWithAI,
  };
}

// Hook for getting AI analysis of gold prices
export function useGoldPriceAnalysis() {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeGoldPrice = useCallback(
    async (question: string = "Phân tích giá vàng hiện tại") => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/gold-price-analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setAnalysis(result.analysis);
          return result;
        } else {
          throw new Error(result.message || "Không thể phân tích dữ liệu");
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Lỗi khi phân tích giá vàng";
        setError(errorMsg);
        console.error("Error analyzing gold price:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    analysis,
    loading,
    error,
    analyzeGoldPrice,
  };
}
