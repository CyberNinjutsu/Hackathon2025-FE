import { TokenAccount } from "@/utils/Types";
import { solanaService } from "./solana";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { TokenListProvider } from "@solana/spl-token-registry";

export interface AssetSummary {
  symbol: string;
  name: string;
  totalBalance: number;
  usdValue: number;
  holders: number;
  transactions: number;
  status: 'active' | 'inactive';
}

export interface DashboardStats {
  totalAssets: number;
  totalValue: number;
  totalTransactions: number;
  activeUsers: number;
  transactionVolume: number;
  successRate: number;
}

class DataService {
  private readonly WALLET_ADDRESSES = [
    'Gy2LZ5EEvuZFGDHbak6kmS7EgUhtAtKCDLA4siZDEcwE',
    'BbyQ1KPKYx8NRvkW7Yymio44R2CmGAuZaeWSNscwDuvh'
  ];

  async getTokensFromWallets(): Promise<TokenAccount[]> {
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const tokenListProvider = new TokenListProvider();
      const tokenList = (await tokenListProvider.resolve())
        .filterByClusterSlug("devnet")
        .getList();

      const tokenMap = tokenList.reduce((map, item) => {
        map.set(item.address, item);
        return map;
      }, new Map());

      const allTokens: TokenAccount[] = [];

      for (const walletAddress of this.WALLET_ADDRESSES) {
        try {
          const walletPubKey = new PublicKey(walletAddress);
          
          const [res1, res2] = await Promise.all([
            connection.getParsedTokenAccountsByOwner(walletPubKey, {
              programId: TOKEN_PROGRAM_ID,
            }),
            connection.getParsedTokenAccountsByOwner(walletPubKey, {
              programId: TOKEN_2022_PROGRAM_ID,
            }),
          ]);

          const combined = [...res1.value, ...res2.value];

          for (const acc of combined) {
            try {
              const parsed = acc.account.data as { parsed?: { info?: { mint: string; tokenAmount?: { uiAmount?: number; amount?: string; decimals?: number } } } };
              const info = parsed.parsed?.info;
              if (!info) continue;

              const mint: string = info.mint;
              const tokenAmount = info.tokenAmount || {};
              const uiAmount = tokenAmount.uiAmount ?? null;
              const amountRaw = tokenAmount.amount ?? "0";
              const decimals = tokenAmount.decimals;
              const tokenInfo = tokenMap.get(mint);

              if (uiAmount && uiAmount > 0) {
                allTokens.push({
                  tokenAccountAddress: acc.pubkey.toBase58(),
                  mint,
                  uiAmount,
                  amountRaw,
                  decimals,
                  symbol: tokenInfo?.symbol || 'DAMS',
                  logoURI: tokenInfo?.logoURI,
                });
              }
            } catch (e) {
              console.warn("Error parsing token account", e);
            }
          }
        } catch (walletError) {
          console.warn(`Error fetching tokens for wallet ${walletAddress}:`, walletError);
        }
      }

      return allTokens;
    } catch (error) {
      console.error('Error fetching tokens from wallets:', error);
      return [];
    }
  }

  async getAssetsSummary(): Promise<AssetSummary[]> {
    try {
      const [tokens, transactions] = await Promise.all([
        this.getTokensFromWallets(),
        solanaService.getRecentTransactions(200)
      ]);

      // Group tokens by symbol
      const tokenGroups = tokens.reduce((groups, token) => {
        const symbol = token.symbol || 'UNKNOWN';
        if (!groups[symbol]) {
          groups[symbol] = {
            symbol,
            name: symbol,
            totalBalance: 0,
            usdValue: 0,
            holders: new Set<string>(),
            transactions: 0,
            status: 'active' as const
          };
        }
        
        groups[symbol].totalBalance += token.uiAmount || 0;
        groups[symbol].holders.add(token.tokenAccountAddress);
        
        return groups;
      }, {} as Record<string, { symbol: string; name: string; totalBalance: number; usdValue: number; holders: Set<string>; transactions: number; status: 'active' }>);

      // Count transactions per token (simplified simulation)
      Object.keys(tokenGroups).forEach(symbol => {
        tokenGroups[symbol].transactions = Math.floor(Math.random() * transactions.length * 0.3);
      });

      return Object.values(tokenGroups).map(group => ({
        ...group,
        holders: group.holders.size,
        usdValue: group.totalBalance * (Math.random() * 100 + 10) // Mock USD value
      }));
    } catch (error) {
      console.error('Error getting assets summary:', error);
      return [];
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [assets, transactions] = await Promise.all([
        this.getAssetsSummary(),
        solanaService.getRecentTransactions(100)
      ]);

      const totalValue = assets.reduce((sum, asset) => sum + asset.usdValue, 0);
      const successfulTxs = transactions.filter(tx => tx.status === 'success').length;
      const successRate = transactions.length > 0 ? (successfulTxs / transactions.length) * 100 : 0;
      const transactionVolume = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);

      return {
        totalAssets: assets.length,
        totalValue,
        totalTransactions: transactions.length,
        activeUsers: this.WALLET_ADDRESSES.length, // Simplified
        transactionVolume,
        successRate
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        totalAssets: 0,
        totalValue: 0,
        totalTransactions: 0,
        activeUsers: 0,
        transactionVolume: 0,
        successRate: 0
      };
    }
  }
}

export const dataService = new DataService();