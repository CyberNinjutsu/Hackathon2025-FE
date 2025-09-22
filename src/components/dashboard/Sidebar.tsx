"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	Coins,
	ArrowRightLeft,
	Menu,
	X
} from "lucide-react";
import { useState } from "react";

const sidebarItems = [
	{
		name: "Dashboard",
		href: "/admin",
		icon: LayoutDashboard,
	},
	{
		name: "Assets",
		href: "/admin/assets",
		icon: Coins,
	},
	{
		name: "Transactions",
		href: "/admin/transactions",
		icon: ArrowRightLeft,
	},
];

export default function Sidebar() {
	const pathname = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<>
			{/* Mobile menu button */}
			<button
				className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-lg text-white hover:bg-gray-700/80 transition-all duration-300"
				onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
			>
				{isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
			</button>

			{/* Sidebar */}
			<div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 
        bg-gray-900/80 backdrop-blur-xl border-r border-gray-800 
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
				{/* Logo */}
				<div className="p-6 border-b border-gray-800">
					<Link href="/dashboard" className="flex items-center gap-3">
						<div className="w-10 h-10 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center">
							<Coins className="w-6 h-6 text-primary" />
						</div>
						<div>
							<h1 className="text-xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
								Cryptix
							</h1>
							<p className="text-xs text-gray-400">Admin Panel</p>
						</div>
					</Link>
				</div>

				{/* Navigation */}
				<nav className="p-4 space-y-2">
					{sidebarItems.map((item) => {
						const isActive = pathname === item.href;
						const Icon = item.icon;

						return (
							<Link
								key={item.name}
								href={item.href}
								className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300
                  ${isActive
										? 'bg-primary/20 border border-primary/30 text-primary'
										: 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
									}
                `}
								onClick={() => setIsMobileMenuOpen(false)}
							>
								<Icon className="w-5 h-5" />
								<span className="font-medium">{item.name}</span>
							</Link>
						);
					})}
				</nav>
			</div>

			{/* Mobile overlay */}
			{isMobileMenuOpen && (
				<div
					className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
					onClick={() => setIsMobileMenuOpen(false)}
				/>
			)}
		</>
	);
}