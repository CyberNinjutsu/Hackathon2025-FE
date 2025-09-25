// utils/tokenHelper.ts

import {
  Connection,
  PublicKey,
  clusterApiUrl,
  ParsedAccountData,
  AccountInfo,
} from "@solana/web3.js";
import {  TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { TokenListProvider } from "@solana/spl-token-registry";
import { TokenAccount } from "@/utils/Types";

/**
 * Configuration for token fetching
 */
interface TokenFetchConfig {
  cluster?: 'devnet' | 'mainnet-beta' | 'testnet';
  commitment?: 'processed' | 'confirmed' | 'finalized';
}

/**
 * Result interface for token fetch operation
 */
interface TokenFetchResult {
  success: boolean;
  data: TokenAccount[];
  error?: string;
}

export const fetchTokenAccounts = async (
  walletPublicKey: string,
  config: TokenFetchConfig = {}
): Promise<TokenAccount[]> => {
  const { cluster = 'devnet', commitment = 'confirmed' } = config;

  try {
    // Validate input
    if (!walletPublicKey) {
      throw new Error('Wallet public key is required');
    }

    // Initialize connection
    const connection = new Connection(clusterApiUrl(cluster), commitment);
    const walletPubKey = new PublicKey(walletPublicKey);

    // Get token list for metadata
    const tokenListProvider = new TokenListProvider();
    const tokenList = (await tokenListProvider.resolve())
      .filterByClusterSlug(cluster)
      .getList();

    // Create token metadata map for quick lookup
    const tokenMap = tokenList.reduce((map, item) => {
      map.set(item.address, {
        address: item.address,
        symbol: item.symbol,
        name: item.name,
        decimals: item.decimals,
        logoURI: item.logoURI,
        chainId: item.chainId,
      } as TokenInfo);
      return map;
    }, new Map<string, TokenInfo>());

    // Fetch token accounts from both token programs in parallel
    const [res] = await Promise.all([
      
      connection.getParsedTokenAccountsByOwner(walletPubKey, {
        programId: TOKEN_2022_PROGRAM_ID,
      }),
    ]);

    const combined = [...res.value] as TokenAccountResponse[];
    const tokenAccounts: TokenAccount[] = [];
    const mintsInfo = new Map<string, AccountInfo<Buffer | ParsedAccountData> | null>();

    // Process each token account
    for (const acc of combined) {
      try {
        const tokenAccount = await processTokenAccount(acc, tokenMap, connection, mintsInfo);
        if (tokenAccount) {
          tokenAccounts.push(tokenAccount);
        }
      } catch (e) {
        console.warn(`Error processing token account ${acc.pubkey.toBase58()}:`, e);
        // Continue processing other accounts even if one fails
      }
    }

    // Sort by balance (highest first, null values last)
    return sortTokensByBalance(tokenAccounts);

  } catch (error) {
    console.error("Error fetching token accounts:", error);
    throw new Error(`Failed to fetch token accounts: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Fetch tokens with error handling wrapper
 * @param walletPublicKey - The public key of the wallet
 * @param config - Configuration options
 * @returns Promise<TokenFetchResult> - Result with success status and data/error
 */
export const fetchTokenAccountsSafe = async (
  walletPublicKey: string,
  config: TokenFetchConfig = {}
): Promise<TokenFetchResult> => {
  try {
    const tokens = await fetchTokenAccounts(walletPublicKey, config);
    return {
      success: true,
      data: tokens,
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Token info interface from token registry
 */
interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  chainId: number;
}

/**
 * Parsed token account interface
 */
interface ParsedTokenAccountInfo {
  mint: string;
  owner: string;
  tokenAmount: {
    amount: string;
    decimals: number;
    uiAmount: number | null;
    uiAmountString: string;
  };
}

/**
 * Token account response from RPC
 */
interface TokenAccountResponse {
  pubkey: PublicKey;
  account: {
    data: ParsedAccountData;
    executable: boolean;
    lamports: number;
    owner: PublicKey;
  };
}

/**
 * Process individual token account
 */
const processTokenAccount = async (
  acc: TokenAccountResponse,
  tokenMap: Map<string, TokenInfo>,
  connection: Connection,
  mintsInfo: Map<string, AccountInfo<Buffer | ParsedAccountData> | null>
): Promise<TokenAccount | null> => {
  const parsed = acc.account.data as ParsedAccountData;
  const info = parsed.parsed?.info as ParsedTokenAccountInfo | undefined;
  
  if (!info) return null;

  const mint: string = info.mint;
  const tokenAmount = info.tokenAmount || {};
  const uiAmount = tokenAmount.uiAmount ?? null;
  const amountRaw = tokenAmount.amount ?? "0";
  const decimals = tokenAmount.decimals;
  
  // Get token info from token list
  const tokenInfo = tokenMap.get(mint);
  let symbol: string | undefined = tokenInfo?.symbol;
  const logoURI: string | undefined = tokenInfo?.logoURI;

  // Try to get symbol from on-chain metadata if not in token list
  if (!symbol) {
    symbol = await getTokenSymbolFromMetadata(mint, connection, mintsInfo);
  }

  return {
    tokenAccountAddress: acc.pubkey.toBase58(),
    mint,
    uiAmount,
    amountRaw,
    decimals,
    symbol,
    logoURI,
  };
};

/**
 * Get token symbol from on-chain metadata
 */
const getTokenSymbolFromMetadata = async (
  mint: string,
  connection: Connection,
  mintsInfo: Map<string, AccountInfo<Buffer | ParsedAccountData> | null>
): Promise<string | undefined> => {
  try {
    if (!mintsInfo.has(mint)) {
      const mintAccount = await connection.getParsedAccountInfo(new PublicKey(mint));
      mintsInfo.set(mint, mintAccount.value);
    }

    const mintAcc = mintsInfo.get(mint);
    if (mintAcc?.data) {
      const mintData = mintAcc.data as ParsedAccountData;
      if (mintData.parsed?.info?.extensions) {
        for (const ext of mintData.parsed.info.extensions) {
          if (ext.extension === "tokenMetadata" && ext.state?.symbol) {
            return ext.state.symbol;
          }
        }
      }
    }
  } catch (error) {
    console.warn(`Failed to get metadata for mint ${mint}:`, error);
  }

  return undefined;
};

/**
 * Sort tokens by balance (highest first, null values last)
 */
const sortTokensByBalance = (tokens: TokenAccount[]): TokenAccount[] => {
  return tokens.sort((a, b) => {
    const balanceA = a.uiAmount ?? -1;
    const balanceB = b.uiAmount ?? -1;
    return balanceB - balanceA;
  });
};

/**
 * Filter tokens by minimum balance
 * @param tokens - Array of token accounts
 * @param minBalance - Minimum balance to include (default: 0)
 * @returns Filtered array of token accounts
 */
export const filterTokensByBalance = (
  tokens: TokenAccount[],
  minBalance: number = 0
): TokenAccount[] => {
  return tokens.filter(token => (token.uiAmount ?? 0) > minBalance);
};

/**
 * Get total token count
 * @param tokens - Array of token accounts
 * @returns Total number of tokens
 */
export const getTotalTokenCount = (tokens: TokenAccount[]): number => {
  return tokens.length;
};

/**
 * Get tokens with non-zero balance
 * @param tokens - Array of token accounts
 * @returns Array of tokens with balance > 0
 */
export const getTokensWithBalance = (tokens: TokenAccount[]): TokenAccount[] => {
  return filterTokensByBalance(tokens, 0);
};

/**
 * Find token by mint address
 * @param tokens - Array of token accounts
 * @param mintAddress - Mint address to search for
 * @returns Token account or undefined if not found
 */
export const findTokenByMint = (
  tokens: TokenAccount[],
  mintAddress: string
): TokenAccount | undefined => {
  return tokens.find(token => token.mint === mintAddress);
};

/**
 * Group tokens by symbol
 * @param tokens - Array of token accounts
 * @returns Map of symbol to token accounts
 */
export const groupTokensBySymbol = (tokens: TokenAccount[]): Map<string, TokenAccount[]> => {
  const grouped = new Map<string, TokenAccount[]>();
  
  tokens.forEach(token => {
    const symbol = token.symbol || 'Unknown';
    const existing = grouped.get(symbol) || [];
    existing.push(token);
    grouped.set(symbol, existing);
  });

  return grouped;
};