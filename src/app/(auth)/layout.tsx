import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "../globals.css";

export const metadata: Metadata = {
	title: "Authentication - Cryptix",
	description: "Login or register to access your account",
};

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className="dark antialiased" suppressHydrationWarning>
			<body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} custom-scrollbar homepage-container`}>
				<main>
					<Suspense fallback={null}>{children}</Suspense>
					<Analytics />
				</main>
			</body>
		</html>
	);
}