"use client";

import { Activity, TrendingUp, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface TransactionMetricsProps {
	totalTransactions: number;
	successCount: number;
	failedCount: number;
	pendingCount: number;
	totalVolume: number;
	totalFees: number;
}

export default function TransactionMetrics({
	totalTransactions,
	successCount,
	failedCount,
	pendingCount,
	totalVolume,
	totalFees,
}: TransactionMetricsProps) {
	const successRate = totalTransactions > 0 ? (successCount / totalTransactions) * 100 : 0;

	const metrics = [
		{
			title: "Total Transactions",
			value: totalTransactions.toLocaleString(),
			icon: Activity,
			color: "text-primary",
			bgColor: "bg-primary/20",
			change: "+12.5%",
			changeType: "positive" as const
		},
		{
			title: "Success Rate",
			value: `${successRate.toFixed(1)}%`,
			icon: CheckCircle,
			color: "text-green-400",
			bgColor: "bg-green-500/20",
			change: "+2.1%",
			changeType: "positive" as const
		},
		{
			title: "Failed Transactions",
			value: failedCount.toString(),
			icon: XCircle,
			color: "text-red-400",
			bgColor: "bg-red-500/20",
			change: "-0.8%",
			changeType: "negative" as const
		},
		{
			title: "Pending",
			value: pendingCount.toString(),
			icon: AlertCircle,
			color: "text-yellow-400",
			bgColor: "bg-yellow-500/20",
			change: "+5.2%",
			changeType: "positive" as const
		},
		{
			title: "Total Volume",
			value: `${totalVolume.toFixed(2)} SOL`,
			icon: TrendingUp,
			color: "text-cyan-400",
			bgColor: "bg-cyan-500/20",
			change: "+18.7%",
			changeType: "positive" as const
		},
		{
			title: "Total Fees",
			value: `${totalFees.toFixed(4)} SOL`,
			icon: Activity,
			color: "text-purple-400",
			bgColor: "bg-purple-500/20",
			change: "+3.4%",
			changeType: "positive" as const
		}
	];

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
			{metrics.map((metric, index) => (
				<div key={index} className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-300">
					<div className="flex items-center justify-between mb-3">
						<div className={`p-2 rounded-lg ${metric.bgColor}`}>
							<metric.icon className={`w-4 h-4 ${metric.color}`} />
						</div>
						<div className={`text-xs px-2 py-1 rounded-full ${metric.changeType === 'positive'
							? 'bg-green-900/30 text-green-400'
							: 'bg-red-900/30 text-red-400'
							}`}>
							{metric.change}
						</div>
					</div>

					<div className="space-y-1">
						<h3 className="text-sm font-medium text-gray-400">{metric.title}</h3>
						<p className={`text-xl font-bold ${metric.color}`}>
							{metric.value}
						</p>
					</div>
				</div>
			))}
		</div>
	);
}