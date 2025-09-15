import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import Header from "@/components/Home/Header";
import Footer from "@/components/Home/Footer";

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark antialiased">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} custom-scrollbar homepage-container`}
      >
        <Header />
        <main>
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </main>

        <Footer />
      </body>
    </html>
  );
}
