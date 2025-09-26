"use client";

import { useState, useEffect } from "react";
import { Search, RefreshCw, TrendingUp, Users, Activity, AlertCircle } from "lucide-react";
import { dataService, AssetSummary } from "@/lib/dataService";
import { TokenAccount, TokenFetchConfig } from "@/utils/Types";
import { fetchMultiWalletTokens } from "@/utils/useTokenAccount";
const WALLET_ADDRESSES = [
  'Gy2LZ5EEvuZFGDHbak6kmS7EgUhtAtKCDLA4siZDEcwE',
  'BbyQ1KPKYx8NRvkW7Yymio44R2CmGAuZaeWSNscwDuvh'
];
const TOKEN_FETCH_CONFIG: TokenFetchConfig = {
  cluster: 'devnet',
  commitment: 'confirmed'
};
interface EnhancedTokenAccount extends TokenAccount {
  name: string;
  usdValue: number;
  holders: number;
  transactions: number;
  status: 'active' | 'inactive';
  walletAddress?: string;
}

interface FetchStats {
  totalWallets: number;
  successfulWallets: number;
  failedWallets: number;
  lastUpdated: Date;
}
export default function AssetsPage() {
  const [assets, setAssets] = useState<EnhancedTokenAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchStats, setFetchStats] = useState<FetchStats>({
    totalWallets: WALLET_ADDRESSES.length,
    successfulWallets: 0,
    failedWallets: 0,
    lastUpdated: new Date()
  });

  // Enhanced token processing function
  const processTokensToAssets = (tokens: TokenAccount[]): EnhancedTokenAccount[] => {
    return tokens.map(token => ({
      ...token,
      name: token.symbol || 'Unknown Token',
      usdValue: calculateUSDValue(token), // You'll need to implement this
      holders: 1, // Could be enhanced with on-chain data
      transactions: 0, // Could be enhanced with transaction history
      status: (token.uiAmount ?? 0) > 0 ? 'active' as const : 'inactive' as const
    }));
  };

  // Mock USD value calculation - replace with real price API
  const calculateUSDValue = (token: TokenAccount): number => {
    // This is a placeholder - you should integrate with a price API like CoinGecko
    const mockPrices: Record<string, number> = {
      'SOL': 20.5,
      'USDC': 1.0,
      'USDT': 1.0,
      'RAY': 0.15,
      // Add more known token prices
    };
    
    const price = mockPrices[token.symbol || ''] || 0;
    return (token.uiAmount || 0) * price;
  };

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch tokens from all wallets
      const result = await fetchMultiWalletTokens(WALLET_ADDRESSES, TOKEN_FETCH_CONFIG);
      
      // Update fetch statistics
      setFetchStats({
        totalWallets: result.results.length,
        successfulWallets: result.successfulWallets,
        failedWallets: result.failedWallets,
        lastUpdated: new Date()
      });

      // Process successful results
      const allTokens: TokenAccount[] = [];
      result.results
        .filter(r => r.success)
        .forEach(r => allTokens.push(...r.tokens));

      // Remove duplicates and process to enhanced format
      const uniqueTokens = removeDuplicateTokens(allTokens);
      const enhancedAssets = processTokensToAssets(uniqueTokens);
      
      setAssets(enhancedAssets);

      // Set error if some wallets failed
      if (result.failedWallets > 0) {
        const failedWallets = result.results.filter(r => !r.success);
        setError(`Failed to fetch from ${result.failedWallets} wallet(s): ${failedWallets.map(w => w.error).join(', ')}`);
      }

    } catch (error) {
      console.error('Error fetching assets:', error);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  // Remove duplicate tokens based on mint address
  const removeDuplicateTokens = (tokens: TokenAccount[]): TokenAccount[] => {
    const tokenMap = new Map<string, TokenAccount>();
    
    tokens.forEach(token => {
      const existing = tokenMap.get(token.mint);
      if (!existing || (token.uiAmount ?? 0) > (existing.uiAmount ?? 0)) {
        tokenMap.set(token.mint, token);
      }
    });
    
    return Array.from(tokenMap.values());
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAssets();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchAssets();

    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchAssets, 120000);
    return () => clearInterval(interval);
  }, []);

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-900/30 text-green-400';
      case 'inactive': return 'bg-red-900/30 text-red-400';
      default: return 'bg-gray-900/30 text-gray-400';
    }
  };

  // Calculate totals
  const totalBalance = assets.reduce((sum, asset) => sum + (asset.uiAmount || 0), 0);
  const totalUSDValue = assets.reduce((sum, asset) => sum + asset.usdValue, 0);
  const activeAssets = assets.filter(asset => asset.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent mb-2">
            Assets Overview
          </h1>
          <div className="space-y-1">
            <p className="text-gray-400">
              Real-time view of tokens from {WALLET_ADDRESSES.length} monitored wallets
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {fetchStats.lastUpdated.toLocaleTimeString()} | 
              Successful: {fetchStats.successfulWallets}/{fetchStats.totalWallets} wallets
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 px-4 py-2 rounded-lg text-gray-300 font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-red-400 font-medium">Partial Fetch Warning</h4>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search assets by name or symbol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-white">Total Assets</h3>
          </div>
          <p className="text-3xl font-bold text-primary">{assets.length}</p>
          <p className="text-sm text-gray-400 mt-1">Unique tokens found</p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Active Assets</h3>
          </div>
          <p className="text-3xl font-bold text-green-400">{activeAssets}</p>
          <p className="text-sm text-gray-400 mt-1">With positive balance</p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Total Balance</h3>
          </div>
          <p className="text-3xl font-bold text-cyan-400">
            {totalBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-400 mt-1">Combined token balance</p>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">USD Value</h3>
          </div>
          <p className="text-3xl font-bold text-green-400">
            ${totalUSDValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-400 mt-1">Estimated total value</p>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-400">Loading assets from {WALLET_ADDRESSES.length} wallets...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="p-12 text-center">
            <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-400 mb-2">
              {searchTerm ? 'No matching assets found' : 'No assets found'}
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? `No tokens match your search "${searchTerm}"`
                : 'No tokens found in the monitored wallets.'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Asset</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Balance</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">USD Value</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Mint Address</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Decimals</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset, index) => (
                  <tr 
                    key={`${asset.mint}-${index}`} 
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors duration-300"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {asset.logoURI && (
                          <img 
                            src={asset.logoURI} 
                            alt={asset.symbol || 'Token'} 
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        )}
                        <div>
                          <div className="font-medium text-white">{asset.name}</div>
                          <div className="text-sm text-gray-400">{asset.symbol || 'Unknown'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-white font-medium">
                        {asset.uiAmount?.toLocaleString('en-US', { 
                          maximumFractionDigits: Math.min(asset.decimals, 6) 
                        }) || '0'}
                      </div>
                      <div className="text-sm text-gray-400">
                        {asset.amountRaw} (raw)
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-medium">
                      ${asset.usdValue.toLocaleString('en-US', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-mono text-sm text-gray-300">
                        {asset.mint.slice(0, 8)}...{asset.mint.slice(-8)}
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(asset.mint)}
                        className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        Copy full address
                      </button>
                    </td>
                    <td className="py-4 px-6 text-white">
                      {asset.decimals}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}