"use client";

import { useMemo, useState, useEffect } from "react";
import useSWR from "swr";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from 'recharts';

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

interface HistoryApiRecord {
  BuyValue: number;
  SellValue: number;
  GroupDate: string;
}
interface HistoryApiResponse {
  success: boolean;
  data: HistoryApiRecord[];
}

// Processed data for the chart
interface ChartDataPoint {
  dateLabel: string;
  fullDate: Date;
  buy: number;
  sell: number;
}

const parseDotNetDate = (dotNetDate: string): Date | null => {
  const match = dotNetDate.match(/\/Date\((\d+)\)\//);
  if (match && match[1]) {
    return new Date(parseInt(match[1], 10));
  }
  return null;
};

const formatDateLabel = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
};

const productListFetcher = async (url: string): Promise<GoldPriceApiResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch product list");
  return res.json();
};

const historyFetcher = async (url: string): Promise<HistoryApiResponse> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch price history");
  return res.json();
};

// --- UI Formatting ---

const formatYAxisValue = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
  return value.toLocaleString('en-US');
};

const formatCurrencyTooltip = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

interface TooltipPayload {
  value: number;
  name: string;
  color: string;
  payload: ChartDataPoint;
}
interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const fullDate = payload[0].payload.fullDate;
    const formattedDate = fullDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    return (
      <div className="bg-background/80 backdrop-blur-sm p-2 border rounded-md shadow-lg">
        <p className="font-bold">{`Date: ${formattedDate}`}</p>
        <p style={{ color: '#10b981' }}>{`Buy Price: ${formatCurrencyTooltip(payload[0].value)}`}</p>
        <p style={{ color: '#ef4444' }}>{`Sell Price: ${formatCurrencyTooltip(payload[1].value)}`}</p>
      </div>
    );
  }
  return null;
};

export function GoldChart() {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const { 
    data: productsResponse, 
    error: productsError, 
    isLoading: isProductsLoading 
  } = useSWR<GoldPriceApiResponse>(
    "https://hackathon2025-be.phatnef.me/gold-price",
    productListFetcher
  );

  const { 
    data: historyResponse, 
    error: historyError, 
    isLoading: isHistoryLoading 
  } = useSWR<HistoryApiResponse>(
    selectedProductId ? `https://hackathon2025-be.phatnef.me/gold-price?id=${selectedProductId}` : null,
    historyFetcher
  );

  const productOptions = useMemo(() => {
    if (!productsResponse?.data) return [];
    return productsResponse.data.map(p => ({
      value: p.Id.toString(),
      label: `${p.BranchName} - ${p.TypeName}`,
    }));
  }, [productsResponse]);

  useEffect(() => {
    if (!selectedProductId && productsResponse?.data) {
      const defaultProduct = productsResponse.data.find(p => 
        p.TypeName.includes("Vàng SJC 1L") && p.BranchName.includes("Hồ Chí Minh")
      );
      if (defaultProduct) {
        setSelectedProductId(defaultProduct.Id);
      } else if (productsResponse.data.length > 0) {
        setSelectedProductId(productsResponse.data[0].Id);
      }
    }
  }, [productsResponse, selectedProductId]);

  const chartData = useMemo((): ChartDataPoint[] => {
    if (!historyResponse?.data) return [];

    const processedData = historyResponse.data
      .map(record => {
        const date = parseDotNetDate(record.GroupDate);
        if (!date) return null;
        return {
          fullDate: date,
          dateLabel: formatDateLabel(date),
          buy: record.BuyValue,
          sell: record.SellValue,
        };
      })
      .filter((item): item is ChartDataPoint => item !== null);
    
    return processedData
      .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime())
      .slice(-7);

  }, [historyResponse]);

  const lastUpdatedTime = productsResponse?.latestDate || "N/A";

  const handleProductChange = (value: string) => {
    setSelectedProductId(Number(value));
  };

  return (
    <Card className="max-w-6xl mx-auto shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
          <div>
            <CardTitle>Gold Price Fluctuation (Last 7 Days)</CardTitle>
            <CardDescription>
              Last updated: {isProductsLoading ? 'Loading...' : lastUpdatedTime}
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
            <Select onValueChange={handleProductChange} value={selectedProductId?.toString() || ''}>
              <SelectTrigger className="w-full sm:w-[350px]">
                <SelectValue placeholder="Select a product..." />
              </SelectTrigger>
              <SelectContent>
                {isProductsLoading ? (
                  <SelectItem value="loading" disabled>Loading list...</SelectItem>
                ) : (
                  productOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[400px]">
          {isHistoryLoading ? (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Loading chart data...
            </div>
          ) : historyError ? (
            <div className="w-full h-full flex items-center justify-center text-red-500">
              Failed to load data. Please try again.
            </div>
          ) : chartData.length === 0 && selectedProductId ? (
             <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No historical data available for this product.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="dateLabel" tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={formatYAxisValue}
                  tick={{ fontSize: 12 }}
                  domain={['dataMin - 500000', 'dataMax + 500000']}
                  width={80}
                  allowDataOverflow={true}
                  tickCount={7} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="buy"
                  name="Buy Price"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="sell"
                  name="Sell Price"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}