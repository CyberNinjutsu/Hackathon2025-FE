"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface TransactionStatusData {
	name: string;
	value: number;
	color: string;
	[key: string]: string | number;
}

interface TransactionStatusChartProps {
	statusData: TransactionStatusData[];
	typeData: Array<{
		name: string;
		success: number;
		failed: number;
		pending: number;
	}>;
}

export default function TransactionStatusChart({ statusData, typeData }: TransactionStatusChartProps) {
	const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ dataKey: string; value: number; color: string }>; label?: string }) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-lg p-3 shadow-xl">
					<p className="text-white font-medium mb-2">{label}</p>
					{payload.map((entry, index: number) => (
						<p key={index} className="text-sm flex items-center justify-between gap-3" style={{ color: entry.color }}>
							<span className="capitalize">{entry.dataKey}:</span>
							<span className="font-semibold">{entry.value}</span>
						</p>
					))}
				</div>
			);
		}
		return null;
	};

	const PieTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) => {
		if (active && payload && payload.length) {
			const data = payload[0];
			const totalCount = statusData.reduce((sum, item) => sum + item.value, 0);
			const percentage = totalCount > 0 ? ((data.value / totalCount) * 100).toFixed(1) : '0';

			return (
				<div className="bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-lg p-3 shadow-xl">
					<p className="text-white font-medium mb-2 capitalize">{data.name}</p>
					<div className="space-y-1">
						<p className="text-sm flex items-center justify-between gap-3" style={{ color: data.payload.color }}>
							<span>Count:</span>
							<span className="font-semibold">{data.value}</span>
						</p>
						<p className="text-sm flex items-center justify-between gap-3 text-gray-400">
							<span>Percentage:</span>
							<span className="font-semibold">{percentage}%</span>
						</p>
					</div>
				</div>
			);
		}
		return null;
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{/* Pie Chart - Transaction Status Distribution */}
			<div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xl font-semibold text-white">Status Distribution</h3>
					<div className="flex items-center gap-4 text-sm">
						{statusData.map((entry, index) => (
							<div key={index} className="flex items-center gap-2">
								<div
									className="w-3 h-3 rounded-full"
									style={{ backgroundColor: entry.color }}
								></div>
								<span className="text-gray-400 capitalize">{entry.name}</span>
							</div>
						))}
					</div>
				</div>

				<div className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={statusData}
								cx="50%"
								cy="50%"
								innerRadius={60}
								outerRadius={120}
								paddingAngle={5}
								dataKey="value"
							>
								{statusData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Pie>
							<Tooltip content={<PieTooltip />} />
						</PieChart>
					</ResponsiveContainer>
				</div>

				{/* Status Summary */}
				<div className="mt-4 grid grid-cols-3 gap-4">
					{statusData.map((item, index) => (
						<div key={index} className="text-center">
							<div
								className="text-2xl font-bold mb-1"
								style={{ color: item.color }}
							>
								{item.value}
							</div>
							<div className="text-sm text-gray-400 capitalize">{item.name}</div>
						</div>
					))}
				</div>
			</div>

			{/* Bar Chart - Status by Transaction Type */}
			<div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-xl font-semibold text-white">Status by Type</h3>
					<div className="flex items-center gap-4 text-sm">
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-green-400 rounded-full"></div>
							<span className="text-gray-400">Success</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-red-400 rounded-full"></div>
							<span className="text-gray-400">Failed</span>
						</div>
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
							<span className="text-gray-400">Pending</span>
						</div>
					</div>
				</div>

				<div className="h-80">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={typeData}
							margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
							style={{ background: "transparent" }}
						>
							<CartesianGrid strokeDasharray="3 3" stroke="#374151" fill="transparent" />
							<XAxis
								dataKey="name"
								stroke="#9CA3AF"
								fontSize={12}
								angle={-45}
								textAnchor="end"
								height={80}
							/>
							<YAxis stroke="#9CA3AF" fontSize={12} />
							<Tooltip content={<CustomTooltip />} />
							<Legend />
							<Bar
								dataKey="success"
								fill="#22C55E"
								name="Success"
								radius={[2, 2, 0, 0]}
								background={{ fill: "transparent" }}
							/>
							<Bar
								dataKey="failed"
								fill="#EF4444"
								name="Failed"
								radius={[2, 2, 0, 0]}
								background={{ fill: "transparent" }}
							/>
							<Bar
								dataKey="pending"
								fill="#F59E0B"
								name="Pending"
								radius={[2, 2, 0, 0]}
								background={{ fill: "transparent" }}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
}