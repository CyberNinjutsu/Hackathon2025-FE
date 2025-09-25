"use client";

import { useState } from "react";
import GoldPriceWidget from "@/components/GoldPrice/GoldPriceWidget";
import { useGoldPrice, useGoldPriceAnalysis } from "@/hooks/useGoldPrice";

export default function GoldAnalysisPage() {
  const [question, setQuestion] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const {
    goldData,
    loading: goldLoading,
    error: goldError,
    refresh,
  } = useGoldPrice({
    autoRefresh: true,
    refreshInterval: 30000, // 30 seconds
  });

  const {
    analysis,
    loading: analysisLoading,
    analyzeGoldPrice,
  } = useGoldPriceAnalysis();

  const handleAnalyze = async () => {
    if (!question.trim()) return;

    try {
      const result = await analyzeGoldPrice(question);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    }
  };

  const predefinedQuestions = [
    "Phân tích xu hướng giá vàng hiện tại",
    "Nên mua vàng vào thời điểm này không?",
    "So sánh giá vàng với các khoản đầu tư khác",
    "Dự đoán giá vàng trong tuần tới",
    "Các yếu tố ảnh hưởng đến giá vàng hiện tại",
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🏆 Phân Tích Giá Vàng với AI
        </h1>
        <p className="text-gray-600">
          Theo dõi giá vàng thời gian thực và nhận phân tích từ AI chuyên nghiệp
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gold Price Widget */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Giá Vàng Thời Gian Thực
          </h2>
          <GoldPriceWidget
            className="mb-4"
            autoRefresh={true}
            refreshInterval={30000}
          />

          {goldData && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">
                Thông Tin Chi Tiết
              </h3>
              <pre className="text-xs text-blue-800 overflow-auto">
                {JSON.stringify(goldData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* AI Analysis Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Phân Tích AI</h2>

          {/* Quick Questions */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Câu hỏi gợi ý:
            </h3>
            <div className="flex flex-wrap gap-2">
              {predefinedQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => setQuestion(q)}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Question Input */}
          <div className="mb-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Nhập câu hỏi về giá vàng..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <button
              onClick={handleAnalyze}
              disabled={!question.trim() || analysisLoading}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analysisLoading ? "Đang phân tích..." : "Phân tích với AI"}
            </button>
          </div>

          {/* Analysis Result */}
          {analysisResult && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">
                Kết Quả Phân Tích
              </h3>
              <div className="text-sm text-green-800 whitespace-pre-wrap">
                {analysisResult.analysis}
              </div>
              <div className="mt-2 text-xs text-green-600">
                Phân tích lúc:{" "}
                {new Date(analysisResult.timestamp).toLocaleString("vi-VN")}
              </div>
            </div>
          )}

          {analysisLoading && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* API Test Section */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Test API Endpoints</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">GET Gold Price Data</h4>
            <code className="text-xs bg-white p-2 rounded block">
              GET /api/gold-price-analysis
            </code>
          </div>
          <div>
            <h4 className="font-medium mb-2">POST AI Analysis</h4>
            <code className="text-xs bg-white p-2 rounded block">
              POST /api/gold-price-analysis
              <br />
              {`{"question": "Phân tích giá vàng"}`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
