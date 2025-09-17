import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "../globals.css";
import Header from "@/components/Home/Header";
import Footer from "@/components/Home/Footer";

export const metadata: Metadata = {
  title: "DAMS",
  description:
    "DAMS là nền tảng quản lý tài sản số hoá an toàn và minh bạch. Token hoá vàng, bất động sản, và đá quý giúp đầu tư dễ dàng, nhanh chóng và bảo mật.",
  keywords: [
    "DAMS",
    "quản lý token",
    "token hóa tài sản",
    "vàng số hóa",
    "bất động sản số hóa",
    "đá quý số hóa",
    "đầu tư blockchain",
    "token blockchain",
    "quản lý tài sản số",
  ],
  authors: [{ name: "DAMS Team" }],
  creator: "DAMS",
  publisher: "DAMS",
  applicationName: "DAMS - Digital Asset Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark antialiased" suppressHydrationWarning>
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
