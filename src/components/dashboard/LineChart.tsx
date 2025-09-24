"use client";

interface DataPoint {
	date: string;
	value: number;
}

interface LineChartProps {
	data: DataPoint[];
	title: string;
	color?: string;
}

export default function LineChart({ data, title, color = "#00ffb2" }: LineChartProps) {
	const maxValue = Math.max(...data.map(d => d.value));
	const minValue = Math.min(...data.map(d => d.value));
	const range = maxValue - minValue;

	const getY = (value: number) => {
		return 100 - ((value - minValue) / range) * 100;
	};

	const pathData = data.map((point, index) => {
		const x = (index / (data.length - 1)) * 100;
		const y = getY(point.value);
		return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
	}).join(' ');

	return (
		<div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
			<h3 className="text-lg font-semibold text-white mb-6">{title}</h3>

			<div className="relative h-64">
				<svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
					{/* Grid lines */}
					<defs>
						<pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
							<path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
						</pattern>
					</defs>
					<rect width="100" height="100" fill="url(#grid)" />

					{/* Area under curve */}
					<path
						d={`${pathData} L 100 100 L 0 100 Z`}
						fill={`${color}20`}
						stroke="none"
					/>

					{/* Line */}
					<path
						d={pathData}
						fill="none"
						stroke={color}
						strokeWidth="2"
						vectorEffect="non-scaling-stroke"
					/>

					{/* Data points */}
					{data.map((point, index) => {
						const x = (index / (data.length - 1)) * 100;
						const y = getY(point.value);
						return (
							<circle
								key={index}
								cx={x}
								cy={y}
								r="2"
								fill={color}
								vectorEffect="non-scaling-stroke"
							/>
						);
					})}
				</svg>

				{/* Y-axis labels */}
				<div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 -ml-12">
					<span>{maxValue.toLocaleString()}</span>
					<span>{((maxValue + minValue) / 2).toLocaleString()}</span>
					<span>{minValue.toLocaleString()}</span>
				</div>
			</div>

			{/* X-axis labels */}
			<div className="flex justify-between mt-4 text-xs text-gray-400">
				{data.map((point, index) => (
					<span key={index} className={index % 2 === 0 ? '' : 'hidden sm:block'}>
						{point.date}
					</span>
				))}
			</div>
		</div>
	);
}