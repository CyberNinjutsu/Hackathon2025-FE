import { ParsedInstruction, PublicKey } from "@solana/web3.js";

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
  secondaryToken?: {
    amount: number;
    symbol: string;
    mint: string;
  };
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

interface TokenBalance {
  accountIndex: number;
  mint: string;
  owner?: string;
  programId?: string;
  uiTokenAmount: {
    amount: string;
    decimals: number;
    uiAmount: number | null;
    uiAmountString: string;
  };
}

interface TokenMetadataExtension {
  extension: string;
  state: {
    symbol?: string;
    name?: string;
  };
}

interface MintInfo {
  decimals: number;
  extensions?: TokenMetadataExtension[];
}

interface TransactionMeta {
  err: string | null;
  fee: number;
  preTokenBalances: TokenBalance[];
  postTokenBalances: TokenBalance[];
  preBalances: number[];
  postBalances: number[];
  innerInstructions?: Array<{ instructions: ParsedInstruction[] }>;
  computeUnitsConsumed?: number;
  logMessages: [];
}

interface ParsedTransaction {
  meta: TransactionMeta | null;
  blockTime: number | null;
  transaction: {
    message: {
      accountKeys: string[];
      instructions: ParsedInstruction[];
    };
  };
}
interface TokenRatio {
  minValue: number;
  ratio: number;
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
  TokenBalance,
  ParsedInstruction,
  MintInfo,
  TokenMetadataExtension,
  ParsedTransaction,TokenRatio
};
