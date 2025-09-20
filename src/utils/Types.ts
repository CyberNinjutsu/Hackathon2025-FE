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
interface AuthContextType {
  publicKey: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (publicKey: string) => void;
  logout: () => void;
  savePublicKey: (publicKey: string) => void;
}

interface Transaction {
  id: string;
  type: TransactionTypeName;
  assetSymbol: string;
  amount: number;
  value: number;
  status: "Completed" | "Pending" | "Failed";
  date: string;
  address?: string;
}

interface AssetHistory {
  id: string;
  name: string;
  color: string;
  data: { date: string; value: number }[];
}

interface TokenIconProps {
  symbol?: string;
  logoURI?: string;
  mint: string; // Used for fallback color generation
  size?: number; // Size in pixels
}
interface TokenAccount {
  tokenAccountAddress: string;
  mint: string;
  uiAmount: number | null;
  amountRaw: string;
  decimals?: number;
  symbol?: string;
  logoURI?: string;
}
export type TransactionTypeName = "Send" | "Receive" | "Mint" | "Swap" | "Other";

export type {
  Asset,
  Transaction,
  AssetHistory,
  AuthContextType,
  TokenIconProps,
  TokenAccount,
};
