"use client";

import StatsCard from "@/components/dashboard/StatsCard";
import LineChart from "@/components/dashboard/LineChart";
import BarChart from "@/components/dashboard/BarChart";
import {
	Coins,
	TrendingUp,
	Users,
	ArrowRightLeft,
	DollarSign
} from "lucide-react";

// Mock data
const statsData = [
	{
		title: "Total Assets",
		value: "1,234",
		change: "+12.5%",
		changeType: "positive" as const,
		icon: Coins
	},
	{
		title: "Total Value",
		value: "$2.4M",
		change: "+8.2%",
		changeType: "positive" as const,
		icon: DollarSign
	},
	{
		title: "Active Users",
		value: "5,678",
		change: "+15.3%",
		changeType: "positive" as const,
		icon: Users
	},
	{
		title: "Transactions",
		value: "12,345",
		change: "-2.1%",
		changeType: "negative" as const,
		icon: ArrowRightLeft
	}
];

const lineChartData = [
	{ date: "Jan", value: 1200 },
	{ date: "Feb", value: 1900 },
	{ date: "Mar", value: 1500 },
	{ date: "Apr", value: 2200 },
	{ date: "May", value: 2800 },
	{ date: "Jun", value: 2400 },
	{ date: "Jul", value: 3100 }
];

const barChartData = [
	{ label: "Gold Tokens", value: 450, color: "#ffd700" },
	{ label: "Real Estate", value: 320, color: "#8b4513" },
	{ label: "Gemstones", value: 280, color: "#9932cc" },
	{ label: "Silver", value: 184, color: "#c0c0c0" }
];

const recentTransactions = [
	{
		id: "1",
		type: "Mint",
		asset: "Gold Token",
		amount: "100 GOLD",
		user: "0x1234...5678",
		time: "2 minutes ago",
		status: "completed"
	},
	{
		id: "2",
		type: "Transfer",
		asset: "Real Estate",
		amount: "50 RE",
		user: "0x8765...4321",
		time: "5 minutes ago",
		status: "pending"
	},
	{
		id: "3",
		type: "Burn",
		asset: "Gemstones",
		amount: "25 GEMS",
		user: "0x9876...1234",
		time: "10 minutes ago",
		status: "completed"
	}
];

export default function AdminDashboardPage() {
	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent mb-2">
					Admin Dashboard
				</h1>
				<p className="text-gray-400">
					Monitor your token ecosystem and track key metrics
				</p>
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
					data={lineChartData}
					title="Token Value Over Time"
					color="#00ffb2"
				/>
				<BarChart
					data={barChartData}
					title="Assets Distribution"
				/>
			</div>

			{/* Recent Transactions */}
			<div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
					<button className="text-primary hover:text-cyan-400 text-sm font-medium transition-colors duration-300">
						View All
					</button>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-800">
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Asset</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-400">User</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Time</th>
								<th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
							</tr>
						</thead>
						<tbody>
							{recentTransactions.map((tx) => (
								<tr key={tx.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors duration-300">
									<td className="py-3 px-4">
										<span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.type === 'Mint' ? 'bg-green-900/30 text-green-400' :
												tx.type === 'Transfer' ? 'bg-blue-900/30 text-blue-400' :
													'bg-red-900/30 text-red-400'
											}`}>
											{tx.type}
										</span>
									</td>
									<td className="py-3 px-4 text-white font-medium">{tx.asset}</td>
									<td className="py-3 px-4 text-gray-300">{tx.amount}</td>
									<td className="py-3 px-4 text-gray-300 font-mono text-sm">{tx.user}</td>
									<td className="py-3 px-4 text-gray-400 text-sm">{tx.time}</td>
									<td className="py-3 px-4">
										<span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.status === 'completed' ? 'bg-green-900/30 text-green-400' :
												'bg-yellow-900/30 text-yellow-400'
											}`}>
											{tx.status}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}