"use client";

import { AssetHistory } from "@/utils/Types";
import { memo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const AssetChart = ({ assetHistory }: { assetHistory: AssetHistory[] }) => {
  const firstData = assetHistory[0]?.data || [];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={firstData}
          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
        >
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `€${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(17, 24, 39, 0.8)",
              borderColor: "#374151",
              borderRadius: "0.5rem",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
            itemStyle={{ color: "#f3f4f6" }}
            labelStyle={{ color: "#d1d5db" }}
            formatter={(value: number) => [`€${value}`, ""]}
            labelFormatter={(label) => `Ngày ${label}`}
          />
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#374151"
            vertical={false}
          />
          {assetHistory.map((asset) => (
            <Line
              key={asset.id}
              type="monotone"
              data={asset.data}
              dataKey="value"
              name={asset.name}
              stroke={asset.color}
              strokeWidth={2}
              dot={{
                r: 4,
                strokeWidth: 2,
                fill: "#111827",
              }}
              activeDot={{
                r: 6,
                strokeWidth: 0,
                fill: asset.color,
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default memo(AssetChart);
