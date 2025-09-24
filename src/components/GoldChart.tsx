"use client";

import { useMemo, useState, useEffect } from "react";
import useSWR from "swr";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { Table } from "./ui/table";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

// Match the types from our API route
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

const fetcher = (url: string): Promise<ProcessedGoldData> => fetch(url).then((res) => res.json());

// Helper to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};


export function GoldChart() {
  const { data, error, isLoading, mutate } = useSWR<ProcessedGoldData>(
    "https://hackathon2025-be.phatnef.me/gold-price",
    fetcher,
    {
      refreshInterval: 60000,
    }
  );

  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const branches = useMemo(() => {
    if (!data?.prices) return [];
    return [...new Set(data.prices.map((p) => p.branch))];
  }, [data]);
  
  // Set default branch when data loads
  useEffect(() => {
    if (!selectedBranch && branches.length > 0) {
      // Prioritize "Hồ Chí Minh" or take the first available branch
      const defaultBranch = branches.find(b => b === "Hồ Chí Minh") || branches[0];
      setSelectedBranch(defaultBranch);
    }
  }, [branches, selectedBranch]);


  const filteredPrices = useMemo(() => {
    if (!data?.prices || !selectedBranch) return [];
    return data.prices.filter((p) => p.branch === selectedBranch);
  }, [data, selectedBranch]);


  const lastUpdatedTime = data?.lastUpdated 
    ? new Date(data.lastUpdated).toLocaleString('en-US', {
        hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric'
      }) 
    : "N/A";

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>SJC Gold Price</CardTitle>
                <CardDescription>Last updated: {isLoading ? 'Loading...' : lastUpdatedTime}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => mutate()}>
              Refresh
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="text-center py-10">Loading prices...</div>
        ) : error ? (
            <div className="text-center py-10 text-red-500">Failed to load data. Please try again.</div>
        ) : (
          <>
            <div className="mb-4">
              <label htmlFor="branch-select" className="text-sm font-medium">Branch</label>
              <Select onValueChange={setSelectedBranch} value={selectedBranch || ''}>
                <SelectTrigger id="branch-select" className="w-[280px]">
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Buy</TableHead>
                    <TableHead className="text-right">Sell</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrices.length > 0 ? (
                    filteredPrices.map((item) => (
                        <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.type}</TableCell>
                        <TableCell className="text-right text-green-600">{formatCurrency(item.buy)}</TableCell>
                        <TableCell className="text-right text-red-600">{formatCurrency(item.sell)}</TableCell>
                        </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        No data available for this branch.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}