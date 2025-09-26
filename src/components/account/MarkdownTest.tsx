"use client";

import MarkdownRenderer from "@/components/ui/MarkdownRenderer";

export default function MarkdownTest() {
  const sampleMarkdown = `**Phân tích giao dịch:**

1.  **Tổng chi phí giao dịch:** 0.000755002 (tổng phí từ 10 giao dịch thành công).
2.  **Dòng tiền tài sản:**
    *   **DAMS:**
        *   Địa chỉ \`HJnQYJqvjgeLpivdxRfGN2VhhJ96kfAGZjDcK13Jvihi\` nhận ròng +3446 DAMS (nhận 4444 DAMS, nhận 2 DAMS, gửi 1000 DAMS).
        *   Địa chỉ \`9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM\` gửi ròng -1000 DAMS.
    *   **SOL:**
        *   Tất cả các giao dịch đều trả phí bằng SOL, tổng cộng -0.000755002 SOL.

3.  **Phân tích hoạt động:**
    *   **Loại giao dịch chủ yếu:** Token transfer (chuyển token DAMS).
    *   **Tần suất:** 10 giao dịch trong khoảng thời gian ngắn, cho thấy hoạt động giao dịch tích cực.
    *   **Mô hình:** Chủ yếu là nhận token DAMS từ các nguồn khác nhau và có một giao dịch gửi đi.

**Lời khuyên:**
- Theo dõi *biến động giá* của token DAMS
- Cân nhắc **đa dạng hóa** danh mục
- Quản lý rủi ro với *stop-loss*`;

  // Test với format API response thực tế
  const apiResponseSample = {
    data: sampleMarkdown,
  };

  return (
    <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30">
      <h4 className="text-white font-semibold mb-3">
        Test API Response Markdown
      </h4>
      <MarkdownRenderer content={apiResponseSample.data} />

      <div className="mt-6 pt-4 border-t border-gray-600">
        <details className="group">
          <summary className="cursor-pointer text-gray-400 text-sm hover:text-gray-300 transition-colors">
            <span className="group-open:rotate-90 inline-block transition-transform">
              ▶
            </span>
            Xem Raw API Response
          </summary>
          <div className="mt-3 bg-gray-900/50 rounded-lg p-4 border border-gray-700/30">
            <pre className="text-xs text-gray-400 overflow-auto max-h-48 whitespace-pre-wrap break-words">
              {JSON.stringify(apiResponseSample, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </div>
  );
}
