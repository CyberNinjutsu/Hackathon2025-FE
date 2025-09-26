import { LucideIcon } from "lucide-react";

interface StatsCardProps {
	title: string;
	value: string;
	change: string;
	changeType: 'positive' | 'negative' | 'neutral';
	icon: LucideIcon;
}

export default function StatsCard({ title, value, changeType, icon: Icon }: StatsCardProps) {
	const changeColor = {
		positive: 'text-green-400',
		negative: 'text-red-400',
		neutral: 'text-gray-400'
	}[changeType];

	return (
		<div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
			<div className="flex items-center justify-between mb-4">
				<div className="w-12 h-12 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center">
					<Icon className="w-6 h-6 text-primary" />
				</div>
			</div>
			<div>
				<h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
				<p className="text-gray-400 text-sm">{title}</p>
			</div>
		</div>
	);
}