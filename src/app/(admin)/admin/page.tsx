"use client";

import { useState, useEffect } from "react";
import BarChart from "@/components/dashboard/BarChart";
import LineChart from "@/components/dashboard/LineChart";
import StatsCard from "@/components/dashboard/StatsCard";
import { ArrowRightLeft, Coins, DollarSign, Users, Activity } from "lucide-react";
import { dataService, DashboardStats } from "@/lib/dataService";
import { solanaService } from "@/lib/solana";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAssets: 0,
    totalValue: 0,
    totalTransactions: 0,
    activeUsers: 0,
    transactionVolume: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<Array<{ date: string; value: number }>>([]);
  const [assetDistribution, setAssetDistribution] = useState<Array<{ label: string; value: number; color: string }>>([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, assets, transactions] = await Promise.all([
        dataService.getDashboardStats(),
        dataService.getAssetsSummary(),
        solanaService.getRecentTransactions(50)
      ]);

      setStats(dashboardStats);

      // Generate chart data from transactions (last 7 days)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: 0
        };
      });

      transactions.forEach(tx => {
        if (tx.blockTime) {
          const txDate = new Date(tx.blockTime * 1000);
          const dayIndex = Math.floor((Date.now() - txDate.getTime()) / (1000 * 60 * 60 * 24));
          if (dayIndex >= 0 && dayIndex < 7) {
            const dataPoint = last7Days[6 - dayIndex];
            if (dataPoint) {
              dataPoint.value += tx.amount || 0;
            }
          }
        }
      });

      setChartData(last7Days);

      // Generate asset distribution
      const colors = ['#00ffb2', '#ffd700', '#8b4513', '#9932cc', '#c0c0c0', '#ff6b6b'];
      const distribution = assets.slice(0, 6).map((asset, index) => ({
        label: asset.name,
        value: asset.totalBalance,
        color: colors[index] || '#666666'
      }));

      setAssetDistribution(distribution);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 2 minutes
    const interval = setInterval(fetchDashboardData, 120000);
    return () => clearInterval(interval);
  }, []);

  const statsData = [
    {
      title: "Total Assets",
      value: loading ? "..." : stats.totalAssets.toString(),
      change: "+12.5%",
      changeType: "positive" as const,
      icon: Coins,
    },
    {
      title: "Total Value",
      value: loading ? "..." : `$${stats.totalValue.toFixed(0)}`,
      change: "+8.2%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Active Wallets",
      value: loading ? "..." : stats.activeUsers.toString(),
      change: "+15.3%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Transactions",
      value: loading ? "..." : stats.totalTransactions.toString(),
      change: `${stats.successRate.toFixed(1)}% success`,
      changeType: "positive" as const,
      icon: ArrowRightLeft,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-400">
          Real-time overview of wallet assets and transaction activity
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Monitored Wallets</h3>
            <div className="space-y-2">
              <p className="font-mono text-xs text-primary break-all">
                Gy2LZ5EEvuZFGDHbak6kmS7EgUhtAtKCDLA4siZDEcwE
              </p>
              <p className="font-mono text-xs text-cyan-400 break-all">
                BbyQ1KPKYx8NRvkW7Yymio44R2CmGAuZaeWSNscwDuvh
              </p>
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-2">System Status</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-400">Live Monitoring Active</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span className="text-xs text-gray-400">
                Transaction Volume: {stats.transactionVolume.toFixed(2)} SOL
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={chartData}
          title="Transaction Volume (Last 7 Days)"
          color="#00ffb2"
        />
        <BarChart
          data={assetDistribution}
          title="Token Distribution by Balance"
        />
      </div>
    </div>
  );
}
