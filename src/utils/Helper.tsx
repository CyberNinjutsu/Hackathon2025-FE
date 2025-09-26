import { Badge } from "@/components/ui/badge";
import { TokenRatio, TransactionTypeName } from "./Types";
import axios from "axios";

const getTransactionIcon = (type: string) => {
  switch (type) {
    case "buy":
      return "📈";
    case "sell":
      return "📉";
    case "receive":
      return "⬇️";
    case "send":
      return "⬆️";
    default:
      return "❓";
  }
};
const getTypeColorClass = (type: TransactionTypeName): string => {
  switch (type) {
    case "Receive":
      return "text-green-400";
    case "Send":
      return "text-red-400";
    case "Mint":
      return "text-purple-400";
    case "Swap":
      return "text-blue-400";
    case "Other":
    default:
      return "text-gray-400";
  }
};
const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-600">Success</Badge>;
    case "pending":
      return <Badge className="bg-yellow-600">Progress</Badge>;
    case "failed":
      return <Badge className="bg-red-600">Failed</Badge>;
    default:
      return null;
  }
};
const formatNumber = (num: string | number, decimals: number = 2): string => {
  const numStr = typeof num === "string" ? num : num.toString();
  const parts = parseFloat(numStr).toFixed(decimals).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};




/**
 * Lấy tỷ lệ chuyển đổi giữa hai token từ API.
 * Hàm này sẽ linh hoạt kiểm tra cả cặp trực tiếp (FROM_TO) và cặp nghịch đảo (TO_FROM).
 * @param fromSymbol - Symbol của token nguồn (ví dụ: "DAMS")
 * @param toSymbol - Symbol của token đích (ví dụ: "GOLD")
 * @returns {Promise<TokenRatio | null>} - Trả về đối tượng TokenRatio hoặc null nếu không tìm thấy.
 */
const fetchTokenRatio = async (
  fromSymbol: string,
  toSymbol: string
): Promise<TokenRatio | null> => {
  // Nếu from và to token giống nhau, tỷ lệ là 1
  if (fromSymbol.toUpperCase() === toSymbol.toUpperCase()) {
    return { minValue: 0, ratio: 1 };
  }

  try {
    const { data } = await axios.get(
      "https://hackathon2025-be.phatnef.me/token-ratio",
      { timeout: 10000 }
    );

    // 1. Tạo key cho cặp trực tiếp (ví dụ: DAMS_GOLD)
    const directKey = `${fromSymbol.toUpperCase()}_${toSymbol.toUpperCase()}`;
    
    // Nếu tìm thấy key trực tiếp trong dữ liệu trả về
    if (data[directKey]) {
      console.log(`Found direct ratio for ${directKey}:`, data[directKey]);
      return data[directKey] as TokenRatio;
    }

    // 2. Nếu không có, tạo key cho cặp nghịch đảo (ví dụ: GOLD_DAMS)
    const inverseKey = `${toSymbol.toUpperCase()}_${fromSymbol.toUpperCase()}`;

    // Nếu tìm thấy key nghịch đảo
    if (data[inverseKey]) {
      console.log(`Found inverse ratio for ${inverseKey}, calculating inverse.`);
      const inverseRatioData = data[inverseKey] as TokenRatio;

      // Tránh chia cho 0
      if (inverseRatioData.ratio === 0) {
        console.error("Inverse ratio is 0, cannot calculate swap rate.");
        return null;
      }
      
      // Tính toán tỷ lệ nghịch đảo và trả về một đối tượng TokenRatio mới
      return {
        minValue: inverseRatioData.minValue, // minValue có thể cần xem xét lại logic, nhưng tạm thời giữ nguyên
        ratio: 1 / inverseRatioData.ratio,
      };
    }

    // 3. Nếu không tìm thấy cả hai, trả về null
    console.warn(`No ratio found for pair ${directKey} or ${inverseKey}`);
    return null;
    
  } catch (error) {
    console.error("Error fetching token ratio:", error);
    return null;
  }
};

export { getTransactionIcon, getStatusBadge, getTypeColorClass, formatNumber ,fetchTokenRatio};
