import { Suspense } from "react";
import Header from "@/components/Home/Header";
import Footer from "@/components/Home/Footer";
import "../globals.css";
import { DM_Sans } from "next/font/google";
import { AuthProvider } from "@/lib/AuthContext";
import { Metadata } from "next";
import BackgroundGlow from "@/components/Glow/BackgroundGlow";
export const metadata: Metadata = {
  title: "DAMS - Your trusted blockchain transaction and wallet management",
  description: "Created with v0",
  generator: "v0.app",
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
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
          <BackgroundGlow />

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
