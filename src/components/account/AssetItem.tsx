"use client";

import { Asset } from "@/utils/Types";
import { memo } from "react";

const AssetItem = ({ asset }: { asset: Asset }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
    <div className="flex items-center space-x-4">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
        style={{ backgroundColor: asset.color }}
      >
        {asset.icon}
      </div>
      <div>
        <div className="text-white font-semibold">{asset.name}</div>
        <div className="text-gray-400 text-sm">{asset.symbol}</div>
      </div>
    </div>
    <div className="text-right">
      <div className="text-white font-semibold">
        €
        {asset.value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}
      </div>
      <div className="text-gray-400 text-sm">
        {asset.amount} {asset.symbol} • {asset.percentage}%
      </div>
    </div>
  </div>
);

export default memo(AssetItem);
