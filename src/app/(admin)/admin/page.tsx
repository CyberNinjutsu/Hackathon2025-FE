"use client";
import { useState, useEffect } from "react";
import BarChart from "@/components/dashboard/BarChart";
import LineChart from "@/components/dashboard/LineChart";
import StatsCard from "@/components/dashboard/StatsCard";
import { ArrowRightLeft, Coins, DollarSign, Users, Activity } from "lucide-react";
// Bạn có thể comment out các import này vì chúng ta không dùng đến khi xài mock data
// import { dataService, DashboardStats } from "@/lib/dataService";
// import { solanaService } from "@/lib/solana";

// --- Bắt đầu phần Mock Data ---

// Định nghĩa lại kiểu DashboardStats nếu bạn đã comment out import ở trên
interface DashboardStats {
  totalAssets: number;
  totalValue: number;
  totalTransactions: number;
  activeUsers: number;
  transactionVolume: number;
  successRate: number;
}

const mockStats: DashboardStats = {
  totalAssets: 6,
  totalValue: 105000,
  totalTransactions: 12530,
  activeUsers: 842,
  transactionVolume: 1210.6,
  successRate: 98.7,
};

const mockChartData = [
  { date: 'May 20', value: 120.5 },
  { date: 'May 21', value: 155.2 },
  { date: 'May 22', value: 98.7 },
  { date: 'May 23', value: 210.0 },
  { date: 'May 24', value: 180.3 },
  { date: 'May 25', value: 250.8 },
  { date: 'May 26', value: 195.1 },
];

const mockAssetDistribution = [
  { label: 'DAMS', value: 50000, color: '#00ffb2' },
  { label: 'GOLD', value: 25000, color: '#ffd700' },
];

// --- Kết thúc phần Mock Data ---

export default function AdminDashboardPage() {
  // Khởi tạo state với mock data
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [loading, setLoading] = useState(false); // Set loading thành false
  const [chartData, setChartData] = useState(mockChartData);
  const [assetDistribution, setAssetDistribution] = useState(mockAssetDistribution);

  // Tạm thời vô hiệu hóa việc fetch dữ liệu thật
  /*
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardStats, assets, transactions] = await Promise.all([
        dataService.getDashboardStats(),
        dataService.getAssetsSummary(),
        solanaService.getRecentTransactions(50)
      ]);
      setStats(dashboardStats);
      // ... (phần logic còn lại)
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 120000);
    return () => clearInterval(interval);
  }, []);
  */

  const statsData = [
    {
      title: "Total Assets",
      value: loading ? "..." : 2,
      changeType: "positive" as const,
      icon: Coins,
    },
    {
      title: "Total Value",
      value: loading ? "..." : `$${stats.totalValue.toLocaleString()}`, // Dùng toLocaleString() cho đẹp
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Active Wallets",
      value: loading ? "..." : 2,
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Transactions",
      value: loading ? "..." : 122,
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
        <LineChart data={chartData} title="Transaction Volume (Last 7 Days)" color="#00ffb2" />
        <BarChart data={assetDistribution} title="Token Distribution by Balance" />
      </div>
    </div>
  );
}