import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import AIInvestmentChatbot from "@/components/AIInvestmentChatbot";
import { AuthProvider } from "@/lib/AuthContext";
import { Analytics } from "@vercel/analytics/next";
import { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import BackgroundGlow from "@/components/Glow/BackgroundGlow";

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
      <body className={`font-sans ${dmSans.variable} homepage-container select-none`}>
        <BackgroundGlow />
        <AuthProvider>
          {children}
          <Analytics />
          <AIInvestmentChatbot />
        </AuthProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
