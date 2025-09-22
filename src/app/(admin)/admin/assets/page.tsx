"use client";

import { useState, useEffect } from "react";
import { Search, RefreshCw, TrendingUp, Users, Activity } from "lucide-react";
import { dataService, AssetSummary } from "@/lib/dataService";

export default function AssetsPage() {
	const [assets, setAssets] = useState<AssetSummary[]>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const fetchAssets = async () => {
		try {
			setLoading(true);
			const data = await dataService.getAssetsSummary();
			setAssets(data);
		} catch (error) {
			console.error('Error fetching assets:', error);
		} finally {
			setLoading(false);
		}
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
		asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'bg-green-900/30 text-green-400';
			case 'inactive': return 'bg-red-900/30 text-red-400';
			default: return 'bg-gray-900/30 text-gray-400';
		}
	};

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent mb-2">
						Assets Overview
					</h1>
					<p className="text-gray-400">
						Real-time view of tokens from monitored wallets
					</p>
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

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
						<div className="p-2 bg-cyan-500/20 rounded-lg">
							<Activity className="w-5 h-5 text-cyan-400" />
						</div>
						<h3 className="text-lg font-semibold text-white">Total Balance</h3>
					</div>
					<p className="text-3xl font-bold text-cyan-400">
						{assets.reduce((sum, asset) => sum + asset.totalBalance, 0).toFixed(2)}
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
						${assets.reduce((sum, asset) => sum + asset.usdValue, 0).toFixed(2)}
					</p>
					<p className="text-sm text-gray-400 mt-1">Estimated total value</p>
				</div>
			</div>

			{/* Search and Filters */}
			<div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							type="text"
							placeholder="Search assets..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300"
						/>
					</div>
					<select className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300">
						<option value="">All Status</option>
						<option value="active">Active</option>
						<option value="paused">Paused</option>
						<option value="deprecated">Deprecated</option>
					</select>
				</div>
			</div>

			{/* Assets Table */}
			<div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl overflow-hidden">
				{loading ? (
					<div className="p-12 text-center">
						<RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
						<p className="text-gray-400">Loading assets from wallets...</p>
					</div>
				) : filteredAssets.length === 0 ? (
					<div className="p-12 text-center">
						<TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
						<h3 className="text-lg font-semibold text-gray-400 mb-2">No assets found</h3>
						<p className="text-gray-500">No tokens found in the monitored wallets.</p>
					</div>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-800/50">
								<tr>
									<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Asset</th>
									<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Balance</th>
									<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">USD Value</th>
									<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Holders</th>
									<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Transactions</th>
									<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
								</tr>
							</thead>
							<tbody>
								{filteredAssets.map((asset, index) => (
									<tr key={`${asset.symbol}-${index}`} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors duration-300">
										<td className="py-4 px-6">
											<div>
												<div className="font-medium text-white">{asset.name}</div>
												<div className="text-sm text-gray-400">{asset.symbol}</div>
											</div>
										</td>
										<td className="py-4 px-6">
											<div className="text-white font-medium">
												{asset.totalBalance.toFixed(4)}
											</div>
										</td>
										<td className="py-4 px-6 text-white font-medium">
											${asset.usdValue.toFixed(2)}
										</td>
										<td className="py-4 px-6 text-white">
											{asset.holders}
										</td>
										<td className="py-4 px-6 text-white">
											{asset.transactions}
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