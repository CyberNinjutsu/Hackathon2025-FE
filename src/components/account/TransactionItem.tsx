"use client";

import { Transaction } from "@/utils/Types";
import { memo } from "react";

const TransactionItem = ({
  transaction,
  getTransactionIcon,
  getStatusBadge,
}: {
  transaction: Transaction;
  getTransactionIcon: (type: string) => React.ReactNode;
  getStatusBadge: (status: string) => React.ReactNode;
}) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
    <div className="flex items-center space-x-4">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          transaction.type === "buy" || transaction.type === "receive"
            ? "bg-[#00FFB2]/20 text-[#00FFB2]"
            : "bg-gray-600/20 text-gray-400"
        }`}
      >
        {getTransactionIcon(transaction.type)}
      </div>
      <div>
        <div className="text-white font-medium">{transaction.description}</div>
        <div className="text-gray-400 text-sm">{transaction.timestamp}</div>
      </div>
    </div>
    <div className="flex items-center space-x-3">
      <div className="text-right">
        <div
          className={`font-semibold ${
            transaction.amount > 0 ? "text-[#00FFB2]" : "text-red-400"
          }`}
        >
          {transaction.amount > 0 ? "+" : ""}€
          {Math.abs(transaction.amount).toLocaleString("en-US")}
        </div>
      </div>
      {getStatusBadge(transaction.status)}
    </div>
  </div>
);

export default memo(TransactionItem);
