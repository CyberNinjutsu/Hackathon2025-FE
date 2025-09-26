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
  const from = fromSymbol.toUpperCase();
  const to = toSymbol.toUpperCase();

  if (from === to) {
    return { minValue: 0, ratio: 1 };
  }

  try {
    const { data } = await axios.get<{ [key: string]: TokenRatio }>(
      "https://hackathon2025-be.phatnef.me/token-ratio",
      { timeout: 10000 } 
    );

    if (!data) {
        console.warn("No data received from token-ratio API.");
        return null;
    }

    const directKey = `${from}_${to}`;
    if (data[directKey]) {
      console.log(`Found direct ratio for ${directKey}:`, data[directKey]);
      if(directKey == "GOLD_DAMS") {
        return {
          minValue : data[directKey].minValue,
          ratio : data[directKey].ratio
        }
      }
      if(directKey == "DAMS_GOLD") {
        return {
          minValue : data[directKey].minValue,
          ratio : 1 / data[directKey].ratio
        }
      }
    }

    console.warn(`No ratio found for pair ${directKey}`);
    return null;
    
  } catch (error) {
    console.error("Error fetching token ratio:", error);
    return null;
  }
};
export { getTransactionIcon, getStatusBadge, getTypeColorClass, formatNumber ,fetchTokenRatio};
