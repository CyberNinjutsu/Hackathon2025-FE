interface Asset {
  id: string;
  name: string;
  symbol: string;
  icon: React.ReactNode;
  amount: number;
  value: number;
  percentage: number;
  color: string;
}

interface Transaction {
  id: string;
  type: "buy" | "sell" | "receive" | "send";
  description: string;
  timestamp: string;
  amount: number;
  status: "success" | "pending" | "failed";
}

interface AssetHistory {
  id: string;
  name: string;
  color: string;
  data: { date: string; value: number }[];
}

export type { Asset, Transaction, AssetHistory };
