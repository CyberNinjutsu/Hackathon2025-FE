import React from "react";
import { TransactionTypeName } from "@/utils/Types";
import { ArrowDownLeft, ArrowUpRight, Repeat } from "lucide-react";

interface TransactionIconProps {
  type: TransactionTypeName;
  className?: string;
}


const TransactionIcon: React.FC<TransactionIconProps> = ({
  type,
  className = "",
}) => {
  switch (type) {
    case "Send":
      return <ArrowUpRight className={`h-4 w-4 text-red-400 ${className}`} />;
    case "Receive":
      return (
        <ArrowDownLeft className={`h-4 w-4 text-green-400 ${className}`} />
      );
    case "Mint":
      return (
        <ArrowDownLeft className={`h-4 w-4 text-purple-400 ${className}`} />
      );
    case "Swap":
      return <Repeat className={`h-4 w-4 text-blue-400 ${className}`} />;
    case "Other":
    default:
      return <Repeat className={`h-4 w-4 text-gray-400 ${className}`} />;
  }
};

export default TransactionIcon;
