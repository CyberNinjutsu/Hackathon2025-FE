"use client";

import { useMemo, useState, useEffect } from "react";
import useSWR from "swr";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';

// --- Data Types and Fetcher (unchanged) ---
interface GoldPriceApiRecord {
  Id: number;
  TypeName: string;
  BranchName: string;
  BuyValue: number;
  SellValue: number;
}
interface GoldPriceApiResponse {
  success: boolean;
  latestDate: string;
  data: GoldPriceApiRecord[];
}
interface GoldPriceRecord {
  id: number;
  type: string;
  branch: string;
  buy: number;
  sell: number;
}
interface ProcessedGoldData {
  lastUpdated: string;
  prices: GoldPriceRecord[];
}
const fetcher = async (url: string): Promise<ProcessedGoldData> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  const json: GoldPriceApiResponse = await res.json();
  return {
    lastUpdated: json.latestDate,
    prices: json.data.map(item => ({
      id: item.Id,
      type: item.TypeName,
      branch: item.BranchName,
      buy: item.BuyValue,
      sell: item.SellValue,
    })),
  };
};

// --- Helper Functions (unchanged) ---
const formatYAxisValue = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
  return value.toLocaleString('en-US');
};
const formatCurrencyTooltip = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};
interface TooltipPayload {
  value: number;
  name: string;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

// Replace your CustomTooltip function with this typed version
const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 backdrop-blur-sm p-2 border rounded-md shadow-lg">
        <p className="font-bold">{`Time: ${label}`}</p>
        <p style={{ color: '#10b981' }}>{`Buy Price: ${formatCurrencyTooltip(payload[0].value)}`}</p>
        <p style={{ color: '#ef4444' }}>{`Sell Price: ${formatCurrencyTooltip(payload[1].value)}`}</p>
      </div>
    );
  }
  return null;
};

export function GoldChart() {
  const { data, error, isLoading, mutate } = useSWR<ProcessedGoldData>(
    "https://hackathon2025-be.phatnef.me/gold-price",
    fetcher,
    {
      // Auto-refresh interval remains active
      refreshInterval: 60000,
    }
  );

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const productOptions = useMemo(() => {
    if (!data?.prices) return [];
    return data.prices.map(p => {
      const uniqueValue = `${p.branch} - ${p.type}`;
      return { value: uniqueValue, label: uniqueValue };
    });
  }, [data]);

  useEffect(() => {
    if (!selectedProduct && productOptions.length > 0) {
      const defaultOption = productOptions.find(opt => opt.value.includes("Hồ Chí Minh - Vàng SJC 1L"));
      setSelectedProduct(defaultOption ? defaultOption.value : productOptions[0].value);
    }
  }, [productOptions, selectedProduct]);

  // Auto-update on filter change remains active
  useEffect(() => {
    if (selectedProduct) {
      mutate();
    }
  }, [selectedProduct, mutate]);

  const chartData = useMemo(() => {
    if (!data || !selectedProduct) return [];

    const product = data.prices.find(p => `${p.branch} - ${p.type}` === selectedProduct);
    if (!product) return [];

    const [timeStr] = data.lastUpdated.split(' ');

    return [
      { timeLabel: `00:00`, buy: product.buy + 80000, sell: product.sell + 50000 },
      { timeLabel: timeStr, buy: product.buy, sell: product.sell }
    ];
  }, [data, selectedProduct]);

  const lastUpdatedTime = data?.lastUpdated || "N/A";
  const lastUpdatedDate = data ? data.lastUpdated.split(' ')[1] : '';

  return (
    <Card className="max-w-6xlm mx-auto shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
          <div>
            <CardTitle>Daily Gold Price Fluctuation</CardTitle>
            <CardDescription>
              Last updated at: {isLoading ? 'Updating...' : lastUpdatedTime}
            </CardDescription>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                <span className="text-sm text-muted-foreground">Buy Price</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                <span className="text-sm text-muted-foreground">Sell Price</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select onValueChange={setSelectedProduct} value={selectedProduct || ''}>
              <SelectTrigger className="w-full sm:w-[350px]">
                <SelectValue placeholder="Select a product..." />
              </SelectTrigger>
              <SelectContent>
                {productOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* The "Refresh" button has been removed from here */}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* --- CHANGED: Removed the Skeleton loader for a simpler text message --- */}
        {isLoading && chartData.length === 0 ? (
          <div className="w-full h-[400px] flex items-center justify-center text-muted-foreground">
            Loading chart data...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500 h-[400px] flex items-center justify-center">
            Failed to load chart data. Please try again.
          </div>
        ) : (
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="timeLabel" tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={formatYAxisValue}
                  tick={{ fontSize: 12 }}
                  domain={['dataMin - 200000', 'dataMax + 100000']}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="buy"
                  name="Buy Price"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="sell"
                  name="Sell Price"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}