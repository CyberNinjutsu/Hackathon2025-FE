import { Suspense } from "react";
import Header from "@/components/Home/Header";
import Footer from "@/components/Home/Footer";
import "../globals.css";
import { DM_Sans } from "next/font/google";
import { AuthProvider } from "@/lib/AuthContext";
// import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";
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
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark antialiased" suppressHydrationWarning>
      <body
        className={`font-sans ${dmSans.variable}  custom-scrollbar homepage-container`}
      >
        <AuthProvider>
          <Header />
          <main>
            <Suspense fallback={null}>{children}</Suspense>
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
