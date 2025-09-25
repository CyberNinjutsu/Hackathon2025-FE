export interface GoldPriceData {
  [key: string]: any;
}

export class GoldPriceService {
  private static readonly API_URL =
    "https://hackathon2025-be.phatnef.me/gold-price";

  static async fetchGoldPrice(): Promise<GoldPriceData | null> {
    try {
      const response = await fetch(this.API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add cache control for real-time data
        cache: "no-cache",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching gold price data:", error);
      return null;
    }
  }

  static formatGoldDataForDisplay(goldData: GoldPriceData): string {
    if (!goldData) {
      return "Không thể lấy dữ liệu giá vàng hiện tại.";
    }

    let formatted = "📊 **Thông tin giá vàng hiện tại**\n";
    formatted += `🕐 Cập nhật: ${new Date().toLocaleString("vi-VN")}\n\n`;

    // Process the data structure based on what we receive
    if (typeof goldData === "object" && goldData !== null) {
      Object.entries(goldData).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          formatted += `**${key}:**\n`;
          Object.entries(value).forEach(([subKey, subValue]) => {
            formatted += `  • ${subKey}: ${subValue}\n`;
          });
          formatted += "\n";
        } else {
          formatted += `• **${key}:** ${value}\n`;
        }
      });
    }

    return formatted;
  }

  static analyzeGoldTrends(goldData: GoldPriceData): string {
    if (!goldData) {
      return "Không có dữ liệu để phân tích xu hướng.";
    }

    // Basic analysis based on available data
    let analysis = "📈 **Phân tích xu hướng:**\n\n";

    // This would need to be customized based on the actual API response structure
    analysis += "• Dữ liệu giá vàng đã được cập nhật thành công\n";
    analysis += "• Khuyến nghị theo dõi thường xuyên để nắm bắt biến động\n";
    analysis += "• Nên so sánh với các nguồn khác để đảm bảo độ chính xác\n";

    return analysis;
  }

  static generateInvestmentAdvice(goldData: GoldPriceData): string {
    if (!goldData) {
      return "Không thể đưa ra lời khuyên đầu tư do thiếu dữ liệu.";
    }

    let advice = "💡 **Lời khuyên đầu tư:**\n\n";
    advice += "• **Đa dạng hóa:** Không nên đầu tư toàn bộ vào vàng\n";
    advice += "• **Theo dõi thường xuyên:** Giá vàng biến động liên tục\n";
    advice +=
      "• **Mua định kỳ:** Áp dụng chiến lược DCA (Dollar Cost Averaging)\n";
    advice += "• **Lưu trữ an toàn:** Đảm bảo bảo mật tài sản vàng số\n";
    advice += "• **Tham khảo chuyên gia:** Luôn tìm hiểu kỹ trước khi đầu tư\n";

    return advice;
  }
}
