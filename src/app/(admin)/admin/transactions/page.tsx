"use client";

import { useState } from "react";
import { Search, Filter, Download, ExternalLink } from "lucide-react";

interface Transaction {
	id: string;
	hash: string;
	type: 'mint' | 'burn' | 'transfer' | 'approve';
	asset: string;
	amount: number;
	from: string;
	to: string;
	timestamp: string;
	status: 'completed' | 'pending' | 'failed';
	gasUsed: number;
	gasPrice: number;
}

const mockTransactions: Transaction[] = [
	{
		id: "1",
		hash: "0x1234567890abcdef1234567890abcdef12345678",
		type: "mint",
		asset: "GOLD",
		amount: 1000,
		from: "0x0000000000000000000000000000000000000000",
		to: "0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4",
		timestamp: "2024-01-20T10:30:00Z",
		status: "completed",
		gasUsed: 65000,
		gasPrice: 20
	},
	{
		id: "2",
		hash: "0xabcdef1234567890abcdef1234567890abcdef12",
		type: "transfer",
		asset: "RE",
		amount: 500,
		from: "0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4",
		to: "0x8ba1f109551bD432803012645Hac136c22C177",
		timestamp: "2024-01-20T09:15:00Z",
		status: "completed",
		gasUsed: 21000,
		gasPrice: 25
	},
	{
		id: "3",
		hash: "0x567890abcdef1234567890abcdef1234567890ab",
		type: "burn",
		asset: "GEMS",
		amount: 250,
		from: "0x8ba1f109551bD432803012645Hac136c22C177",
		to: "0x0000000000000000000000000000000000000000",
		timestamp: "2024-01-20T08:45:00Z",
		status: "pending",
		gasUsed: 45000,
		gasPrice: 18
	}
];

export default function TransactionsPage() {
	const [transactions] = useState<Transaction[]>(mockTransactions);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterType, setFilterType] = useState("");
	const [filterStatus, setFilterStatus] = useState("");

	const filteredTransactions = transactions.filter(tx => {
		const matchesSearch = tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
			tx.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
			tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
			tx.to.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesType = !filterType || tx.type === filterType;
		const matchesStatus = !filterStatus || tx.status === filterStatus;

		return matchesSearch && matchesType && matchesStatus;
	});

	const getTypeColor = (type: string) => {
		switch (type) {
			case 'mint': return 'bg-green-900/30 text-green-400';
			case 'burn': return 'bg-red-900/30 text-red-400';
			case 'transfer': return 'bg-blue-900/30 text-blue-400';
			case 'approve': return 'bg-purple-900/30 text-purple-400';
			default: return 'bg-gray-900/30 text-gray-400';
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'completed': return 'bg-green-900/30 text-green-400';
			case 'pending': return 'bg-yellow-900/30 text-yellow-400';
			case 'failed': return 'bg-red-900/30 text-red-400';
			default: return 'bg-gray-900/30 text-gray-400';
		}
	};

	const formatAddress = (address: string) => {
		if (address === "0x0000000000000000000000000000000000000000") {
			return "Zero Address";
		}
		return `${address.slice(0, 6)}...${address.slice(-4)}`;
	};

	const formatTimestamp = (timestamp: string) => {
		return new Date(timestamp).toLocaleString();
	};

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent mb-2">
						Transactions
					</h1>
					<p className="text-gray-400">
						Monitor all token transactions and their details
					</p>
				</div>
				<button className="bg-primary/20 hover:bg-primary/30 border border-primary/40 px-4 py-2 rounded-lg text-primary font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2">
					<Download className="w-4 h-4" />
					Export Data
				</button>
			</div>

			{/* Filters */}
			<div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							type="text"
							placeholder="Search transactions..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300"
						/>
					</div>

					<select
						value={filterType}
						onChange={(e) => setFilterType(e.target.value)}
						className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300"
					>
						<option value="">All Types</option>
						<option value="mint">Mint</option>
						<option value="burn">Burn</option>
						<option value="transfer">Transfer</option>
						<option value="approve">Approve</option>
					</select>

					<select
						value={filterStatus}
						onChange={(e) => setFilterStatus(e.target.value)}
						className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300"
					>
						<option value="">All Status</option>
						<option value="completed">Completed</option>
						<option value="pending">Pending</option>
						<option value="failed">Failed</option>
					</select>

					<button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-all duration-300">
						<Filter className="w-4 h-4" />
						More Filters
					</button>
				</div>
			</div>

			{/* Transactions Table */}
			<div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-800/50">
							<tr>
								<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Transaction Hash</th>
								<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Type</th>
								<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Asset</th>
								<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Amount</th>
								<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">From</th>
								<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">To</th>
								<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Time</th>
								<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
								<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Gas</th>
							</tr>
						</thead>
						<tbody>
							{filteredTransactions.map((tx) => (
								<tr key={tx.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors duration-300">
									<td className="py-4 px-6">
										<div className="flex items-center gap-2">
											<span className="font-mono text-sm text-white">
												{formatAddress(tx.hash)}
											</span>
											<button className="text-gray-400 hover:text-primary transition-colors duration-300">
												<ExternalLink className="w-3 h-3" />
											</button>
										</div>
									</td>
									<td className="py-4 px-6">
										<span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(tx.type)}`}>
											{tx.type}
										</span>
									</td>
									<td className="py-4 px-6 text-white font-medium">{tx.asset}</td>
									<td className="py-4 px-6 text-white">{tx.amount.toLocaleString()}</td>
									<td className="py-4 px-6">
										<span className="font-mono text-sm text-gray-300">
											{formatAddress(tx.from)}
										</span>
									</td>
									<td className="py-4 px-6">
										<span className="font-mono text-sm text-gray-300">
											{formatAddress(tx.to)}
										</span>
									</td>
									<td className="py-4 px-6 text-gray-400 text-sm">
										{formatTimestamp(tx.timestamp)}
									</td>
									<td className="py-4 px-6">
										<span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
											{tx.status}
										</span>
									</td>
									<td className="py-4 px-6 text-gray-400 text-sm">
										{tx.gasUsed.toLocaleString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between">
				<div className="text-sm text-gray-400">
					Showing {filteredTransactions.length} of {transactions.length} transactions
				</div>
				<div className="flex items-center gap-2">
					<button className="px-3 py-1 bg-gray-800/50 border border-gray-700 rounded text-gray-400 hover:text-white hover:border-gray-600 transition-all duration-300">
						Previous
					</button>
					<span className="px-3 py-1 bg-primary/20 border border-primary/30 rounded text-primary">
						1
					</span>
					<button className="px-3 py-1 bg-gray-800/50 border border-gray-700 rounded text-gray-400 hover:text-white hover:border-gray-600 transition-all duration-300">
						Next
					</button>
				</div>
			</div>
		</div>
	);
}