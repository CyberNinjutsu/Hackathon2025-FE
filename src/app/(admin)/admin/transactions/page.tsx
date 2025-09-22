"use client";

import TransactionMetrics from "@/components/dashboard/TransactionMetrics";
import TransactionStatusChart from "@/components/dashboard/TransactionStatusChart";
import { solanaService, SolanaTransaction } from "@/lib/solana";
import { useEffect, useState } from "react";

export default function TransactionsPage() {
	const [transactions, setTransactions] = useState<SolanaTransaction[]>([]);

	const fetchTransactions = async () => {
		try {
			const data = await solanaService.getRecentTransactions(100);
			setTransactions(data);
		} catch (error) {
			console.error('Error fetching transactions:', error);
		}
	};

	useEffect(() => {
		fetchTransactions();

		// Auto-refresh every 60 seconds
		const interval = setInterval(fetchTransactions, 60000);
		return () => clearInterval(interval);
	}, []);
	const totalVolume = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
	const totalFees = transactions.reduce((sum, tx) => sum + (tx.fee / 1e9), 0);


	// Generate status distribution data
	const statusCounts = transactions.reduce((acc, tx) => {
		acc[tx.status] = (acc[tx.status] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	const statusData = [
		{ name: 'success', value: statusCounts.success || 0, color: '#22C55E' },
		{ name: 'failed', value: statusCounts.failed || 0, color: '#EF4444' },
		{ name: 'pending', value: statusCounts.pending || 0, color: '#F59E0B' }
	].filter(item => item.value > 0);

	// Generate type vs status data
	const typeStatusData = transactions.reduce((acc, tx) => {
		if (!acc[tx.type]) {
			acc[tx.type] = { success: 0, failed: 0, pending: 0 };
		}
		if (tx.status === 'success') acc[tx.type].success++;
		else if (tx.status === 'failed') acc[tx.type].failed++;
		else if (tx.status === 'pending') acc[tx.type].pending++;
		return acc;
	}, {} as Record<string, { success: number; failed: number; pending: number }>);

	const typeData = Object.entries(typeStatusData).map(([type, counts]) => ({
		name: type.replace('-', ' ').toUpperCase(),
		...counts
	}));

	return (
		<div className="space-y-6">
			{/* Transaction Metrics */}
			<TransactionMetrics
				totalTransactions={transactions.length}
				successCount={statusCounts.success || 0}
				failedCount={statusCounts.failed || 0}
				pendingCount={statusCounts.pending || 0}
				totalVolume={totalVolume}
				totalFees={totalFees}
			/>

			{/* Transaction Status Charts */}
			<TransactionStatusChart statusData={statusData} typeData={typeData} />
		</div>
	);
}