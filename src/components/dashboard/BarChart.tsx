"use client";

interface BarData {
	label: string;
	value: number;
	color?: string;
}

interface BarChartProps {
	data: BarData[];
	title: string;
}

export default function BarChart({ data, title }: BarChartProps) {
	const maxValue = Math.max(...data.map(d => d.value));

	return (
		<div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
			<h3 className="text-lg font-semibold text-white mb-6">{title}</h3>

			<div className="space-y-4">
				{data.map((item, index) => {
					const percentage = (item.value / maxValue) * 100;
					const color = item.color || "#00ffb2";

					return (
						<div key={index} className="space-y-2">
							<div className="flex justify-between items-center">
								<span className="text-sm text-gray-300">{item.label}</span>
								<span className="text-sm font-medium text-white">
									{item.value.toLocaleString()}
								</span>
							</div>
							<div className="w-full bg-gray-800 rounded-full h-2">
								<div
									className="h-2 rounded-full transition-all duration-1000 ease-out"
									style={{
										width: `${percentage}%`,
										backgroundColor: color,
										boxShadow: `0 0 10px ${color}40`
									}}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}