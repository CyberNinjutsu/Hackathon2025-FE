import { Badge } from "@/components/ui/badge";
import { TransactionTypeName } from "./Types";

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
export { getTransactionIcon, getStatusBadge, getTypeColorClass, formatNumber };
