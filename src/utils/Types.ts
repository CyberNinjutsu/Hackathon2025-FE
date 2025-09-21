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
interface Token {
  symbol: string;
  mint: string;
  name: string;
  logo?: string;
  logoURI?: string;
  balance: string;
  price: number; // USD price
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
  logo?: React.ReactNode;
  logoURI?: string;
  mint: string;
  size?: number;
}
interface TokenAccount {
  tokenAccountAddress: string;
  mint: string;
  uiAmount: number | null;
  amountRaw: string;
  decimals?: number;
  symbol?: string;
  logoURI?: string;
  logo?: string;
}
export type TransactionTypeName =  | "Send"  | "Receive"  | "Mint"  | "Swap"  | "Other";

export type {
  Asset,
  Transaction,
  AssetHistory,
  AuthContextType,
  TokenIconProps,
  TokenAccount,
  Token,
};
