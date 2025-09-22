"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react";

interface Asset {
	id: string;
	name: string;
	symbol: string;
	totalSupply: number;
	circulatingSupply: number;
	price: number;
	marketCap: number;
	status: 'active' | 'paused' | 'deprecated';
	createdAt: string;
}

const mockAssets: Asset[] = [
	{
		id: "1",
		name: "Gold Token",
		symbol: "GOLD",
		totalSupply: 1000000,
		circulatingSupply: 750000,
		price: 65.50,
		marketCap: 49125000,
		status: "active",
		createdAt: "2024-01-15"
	},
	{
		id: "2",
		name: "Real Estate Token",
		symbol: "RE",
		totalSupply: 500000,
		circulatingSupply: 320000,
		price: 125.75,
		marketCap: 40240000,
		status: "active",
		createdAt: "2024-02-20"
	},
	{
		id: "3",
		name: "Gemstone Token",
		symbol: "GEMS",
		totalSupply: 2000000,
		circulatingSupply: 1200000,
		price: 15.25,
		marketCap: 18300000,
		status: "paused",
		createdAt: "2024-03-10"
	}
];

export default function AssetsPage() {
	const [assets, setAssets] = useState<Asset[]>(mockAssets);
	const [searchTerm, setSearchTerm] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

	const filteredAssets = assets.filter(asset =>
		asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleEdit = (asset: Asset) => {
		setEditingAsset(asset);
		setIsModalOpen(true);
	};

	const handleDelete = (assetId: string) => {
		if (confirm("Are you sure you want to delete this asset?")) {
			setAssets(assets.filter(asset => asset.id !== assetId));
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'bg-green-900/30 text-green-400';
			case 'paused': return 'bg-yellow-900/30 text-yellow-400';
			case 'deprecated': return 'bg-red-900/30 text-red-400';
			default: return 'bg-gray-900/30 text-gray-400';
		}
	};

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent mb-2">
						Assets Management
					</h1>
					<p className="text-gray-400">
						Manage your tokenized assets and their properties
					</p>
				</div>
				<button
					className="bg-primary/20 hover:bg-primary/30 border border-primary/40 px-4 py-2 rounded-lg text-primary font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
					onClick={() => {
						setEditingAsset(null);
						setIsModalOpen(true);
					}}
				>
					<Plus className="w-4 h-4" />
					Add New Asset
				</button>
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
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-800/50">
							<tr>
								<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Asset</th>
								<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Supply</th>
								<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Price</th>
								<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Market Cap</th>
								<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
								<th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Actions</th>
							</tr>
						</thead>
						<tbody>
							{filteredAssets.map((asset) => (
								<tr key={asset.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors duration-300">
									<td className="py-4 px-6">
										<div>
											<div className="font-medium text-white">{asset.name}</div>
											<div className="text-sm text-gray-400">{asset.symbol}</div>
										</div>
									</td>
									<td className="py-4 px-6">
										<div>
											<div className="text-white">{asset.circulatingSupply.toLocaleString()}</div>
											<div className="text-sm text-gray-400">of {asset.totalSupply.toLocaleString()}</div>
										</div>
									</td>
									<td className="py-4 px-6 text-white font-medium">
										${asset.price.toFixed(2)}
									</td>
									<td className="py-4 px-6 text-white font-medium">
										${asset.marketCap.toLocaleString()}
									</td>
									<td className="py-4 px-6">
										<span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
											{asset.status}
										</span>
									</td>
									<td className="py-4 px-6">
										<div className="flex items-center gap-2">
											<button className="p-2 text-gray-400 hover:text-primary transition-colors duration-300">
												<Eye className="w-4 h-4" />
											</button>
											<button
												className="p-2 text-gray-400 hover:text-cyan-400 transition-colors duration-300"
												onClick={() => handleEdit(asset)}
											>
												<Edit className="w-4 h-4" />
											</button>
											<button
												className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-300"
												onClick={() => handleDelete(asset.id)}
											>
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Modal for Add/Edit Asset */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
					<div className="bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-xl p-6 w-full max-w-md">
						<h3 className="text-lg font-semibold text-white mb-4">
							{editingAsset ? 'Edit Asset' : 'Add New Asset'}
						</h3>
						<form className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-2">Asset Name</label>
								<input
									type="text"
									className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300"
									defaultValue={editingAsset?.name || ''}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-2">Symbol</label>
								<input
									type="text"
									className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300"
									defaultValue={editingAsset?.symbol || ''}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-400 mb-2">Total Supply</label>
								<input
									type="number"
									className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300"
									defaultValue={editingAsset?.totalSupply || ''}
								/>
							</div>
							<div className="flex gap-3 pt-4">
								<button
									type="button"
									className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-300"
									onClick={() => setIsModalOpen(false)}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="flex-1 px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary rounded-lg transition-all duration-300"
								>
									{editingAsset ? 'Update' : 'Create'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}