"use client";

import { Transaction, TransactionTypeName } from "@/utils/Types";
import { memo } from "react";
import TransactionIcon from "../TransactionIcon";
import { getTypeColorClass } from "@/utils/Helper";

const TransactionItem = ({
  transaction,
  getStatusBadge,
}: {
  transaction: Transaction; // Giả sử type Transaction có assetSymbol
  getStatusBadge: (status: string) => React.ReactNode;
}) => {
  const isIncoming =
    transaction.type === "Receive" || transaction.type === "Mint";

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center space-x-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isIncoming ? "bg-[#00FFB2]/20" : "bg-red-500/10"
          }`}
        >
          <TransactionIcon type={transaction.type} />
        </div>
        <div>
          <div className="text-white font-medium capitalize">
            <span
              className={getTypeColorClass(
                transaction.type as TransactionTypeName
              )}
            >
              {transaction.type}
            </span>

          </div>
          <div className="text-gray-400 text-sm">{transaction.date}</div>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="text-right">
           <div
            className={`font-semibold ${getTypeColorClass(
              transaction.type as TransactionTypeName
            )}`}
          >
            {isIncoming ? "+" : "-"}
            {Number(transaction.amount).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}{" "}
            {transaction.assetSymbol}
          </div>
        </div>
        {getStatusBadge(transaction.status)}
      </div>
    </div>
  );
};

export default memo(TransactionItem);
