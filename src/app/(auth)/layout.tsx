import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { DM_Sans } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
};
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans", // Tùy chọn, để dùng trong CSS nếu cần
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark antialiased" suppressHydrationWarning>
      <body className={`font-sans ${dmSans.variable} homepage-container`}>
        <AuthProvider>
          {children}
          <Analytics />
        </AuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
