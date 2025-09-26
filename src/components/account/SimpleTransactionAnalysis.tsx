"use client";

import { useEffect, useState } from "react";
import { TrendingUpIcon, AlertCircleIcon, BarChart3Icon } from "lucide-react";
import SimpleMarkdownRenderer from "@/components/ui/SimpleMarkdownRenderer";
import { MarkdownList } from "@/components/ui/MarkdownRenderer";

interface SimpleTransactionAnalysisProps {
  userPublicKey: string | null;
}

export default function SimpleTransactionAnalysis({
  userPublicKey,
}: SimpleTransactionAnalysisProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingTime, setLoadingTime] = useState(0);
  const [analysisData, setAnalysisData] = useState<{
    analysis?: string;
    recommendations?: string[];
    totalTransactions?: number;
    mostActiveToken?: string;
    isMarkdown?: boolean;
  } | null>(null);

  useEffect(() => {
    if (!userPublicKey) return;

    // Lưu userPublicKey vào localStorage
    localStorage.setItem("userPublicKey", userPublicKey);

    const fetchAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      setLoadingTime(0);

      // Bắt đầu đếm thời gian loading
      const startTime = Date.now();
      const timer = setInterval(() => {
        const currentTime = Math.floor((Date.now() - startTime) / 1000);
        setLoadingTime(currentTime);

        // Nếu loading quá 35 giây, dừng và hiển thị thông báo
        if (currentTime >= 35) {
          clearInterval(timer);
          setIsLoading(false);
          setError(
            "Bạn chưa có giao dịch trong hệ thống hoặc dữ liệu chưa sẵn sàng."
          );
        }
      }, 1000);

      try {
        const response = await fetch(
          `https://hackathon2025-be.phatnef.me/user/transaction-analysis?userPubKey=${userPublicKey}`
        );

        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu phân tích");
        }

        const result = await response.json();
        console.log("API Response:", result); // Debug log

        // Nếu data là null, nghĩa là backend đang phân tích
        if (result.data === null) {
          // Đợi thêm một chút rồi thử lại (chỉ nếu chưa quá 35 giây)
          if (loadingTime < 35) {
            setTimeout(() => {
              fetchAnalysis();
            }, 5000); // Thử lại sau 5 giây
          }
          return;
        }

        // Xử lý response - có thể là string markdown hoặc object
        let processedData;
        if (typeof result.data === "string") {
          // Nếu data là string markdown
          processedData = {
            analysis: result.data,
            isMarkdown: true,
          };
        } else {
          // Nếu data là object (format cũ)
          processedData = result.data;
        }

        setAnalysisData(processedData);
        clearInterval(timer);
        setIsLoading(false);
      } catch (err) {
        console.error("Lỗi khi tải phân tích:", err);
        clearInterval(timer);
        setIsLoading(false);
        setError("Có lỗi xảy ra khi tải dữ liệu phân tích.");
      }
    };

    fetchAnalysis();
  }, [userPublicKey]);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
              <TrendingUpIcon className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              Phân Tích Giao Dịch
            </h3>
          </div>

          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <TrendingUpIcon className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-white font-medium mb-2">
                Đang phân tích giao dịch của bạn...
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Hệ thống đang xử lý dữ liệu blockchain và tạo báo cáo chi tiết
              </p>
              <div className="flex items-center justify-center gap-2 text-blue-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm">
                  Thời gian đã trôi qua: {loadingTime}s
                </span>
              </div>
              {loadingTime > 30 && (
                <p className="text-yellow-400 text-xs mt-2">
                  Quá trình phân tích có thể mất thêm một chút thời gian...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-center">
              <AlertCircleIcon className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              Phân Tích Giao Dịch
            </h3>
          </div>

          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircleIcon className="w-16 h-16 text-red-400 mb-4" />
            <p className="text-red-400 font-medium mb-2">
              Không thể tải dữ liệu phân tích
            </p>
            <p className="text-gray-400 text-sm text-center max-w-md">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-500/20 border border-gray-500/30 rounded-lg flex items-center justify-center">
              <TrendingUpIcon className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              Phân Tích Giao Dịch
            </h3>
          </div>

          <div className="flex flex-col items-center justify-center py-12">
            <BarChart3Icon className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-400 font-medium mb-2">
              Chưa có dữ liệu phân tích
            </p>
            <p className="text-gray-500 text-sm text-center">
              Kết nối ví để xem phân tích giao dịch của bạn
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl transition-all duration-300 hover:border-blue-400/30">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
            <TrendingUpIcon className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            Phân Tích Giao Dịch
          </h3>
        </div>

        {/* Hiển thị phân tích - hỗ trợ cả markdown string và object */}
        {analysisData.analysis && (
          <div className="mb-6">
            <h4 className="text-white font-semibold mb-3">
              Phân Tích Giao Dịch Chi Tiết
            </h4>
            <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
              <SimpleMarkdownRenderer
                content={analysisData.analysis}
                className="text-gray-300 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Hiển thị lời khuyên với markdown (chỉ khi có format object) */}
        {analysisData.recommendations &&
          Array.isArray(analysisData.recommendations) &&
          analysisData.recommendations.length > 0 && (
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3">Lời Khuyên</h4>
              <MarkdownList items={analysisData.recommendations} />
            </div>
          )}

        {/* Hiển thị thống kê nếu có (chỉ khi có format object) */}
        {(analysisData.totalTransactions || analysisData.mostActiveToken) && (
          <div className="mb-6">
            <h4 className="text-white font-semibold mb-3">Thống Kê</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {analysisData.totalTransactions && (
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <p className="text-gray-400 text-sm">Tổng giao dịch</p>
                  <p className="text-white text-xl font-bold">
                    {analysisData.totalTransactions}
                  </p>
                </div>
              )}
              {analysisData.mostActiveToken && (
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <p className="text-gray-400 text-sm">Token hoạt động nhất</p>
                  <p className="text-white text-lg font-semibold">
                    {analysisData.mostActiveToken}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Raw data để debug */}
        <div className="mt-6">
          <details className="group">
            <summary className="cursor-pointer text-gray-400 text-sm hover:text-gray-300 transition-colors">
              <span className="group-open:rotate-90 inline-block transition-transform">
                ▶
              </span>
              Xem dữ liệu thô (Raw Data)
            </summary>
            <div className="mt-3 bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
              <pre className="text-xs text-gray-400 overflow-auto max-h-96 whitespace-pre-wrap break-words">
                {JSON.stringify(analysisData, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
