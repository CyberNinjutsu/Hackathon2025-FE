"use client";

import { Bell, Search, User, LogOut } from "lucide-react";
import { useState } from "react";

export default function Header() {
	const [isProfileOpen, setIsProfileOpen] = useState(false);

	return (
		<header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 p-4 lg:p-6">
			<div className="flex items-center justify-between">
				{/* Search */}
				<div className="flex-1 max-w-md ml-0 lg:ml-4">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
						<input
							type="text"
							placeholder="Search..."
							className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all duration-300"
						/>
					</div>
				</div>

				{/* Right side */}
				<div className="flex items-center gap-4">
					{/* Notifications */}
					<button className="relative p-2 text-gray-400 hover:text-white transition-colors duration-300">
						<Bell className="w-5 h-5" />
						<span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
					</button>

					{/* Profile */}
					<div className="relative">
						<button
							className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
							onClick={() => setIsProfileOpen(!isProfileOpen)}
						>
							<div className="w-8 h-8 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center">
								<User className="w-4 h-4 text-primary" />
							</div>
							<div className="hidden sm:block text-left">
								<p className="text-sm font-medium text-white">Admin User</p>
								<p className="text-xs text-gray-400">admin@cryptix.com</p>
							</div>
						</button>

						{/* Profile dropdown */}
						{isProfileOpen && (
							<div className="absolute right-0 top-full mt-2 w-48 bg-gray-800/90 backdrop-blur-xl border border-gray-700 rounded-lg shadow-xl z-50">
								<div className="p-2">
									<button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-300">
										<User className="w-4 h-4" />
										Profile Settings
									</button>
									<button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-300">
										<LogOut className="w-4 h-4" />
										Sign Out
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
}