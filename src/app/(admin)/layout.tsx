import type { Metadata } from "next";
import type React from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "../globals.css";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";

export const metadata: Metadata = {
	title: "Admin Dashboard - Cryptix",
	description: "Manage tokens, assets and transactions",
};

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="dark antialiased" suppressHydrationWarning>
			<body
				className={`font-sans ${GeistSans.variable} ${GeistMono.variable} custom-scrollbar homepage-container`}
			>
				<div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
					{/* Background glow effects */}
					<div className="fixed inset-0 pointer-events-none z-0">
						<div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
						<div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl"></div>
					</div>

					<div className="flex relative z-10 h-screen overflow-hidden">
						{/* Sidebar */}
						<div className="w-64 min-h-[100vh] shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-gray-800">
							<Sidebar />
						</div>

						{/* Main Content */}
						<div className="flex-1 flex flex-col">
							{/* Header */}
							<div className="sticky top-0 z-20 border-b border-gray-800 bg-gradient-to-br from-gray-900 via-black to-gray-900">
								<Header />
							</div>

							{/* Scrollable content */}
							<main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
								<Suspense
									fallback={
										<div className="flex items-center justify-center h-64">
											<div className="text-gray-400">Loading...</div>
										</div>
									}
								>
									{children}
								</Suspense>
								<Analytics />
							</main>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
