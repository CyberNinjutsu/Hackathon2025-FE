import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import React from "react";

export default function LayoutDashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-2 custom-scrollbar">
      {/* Header */}
      <Header />

      <div className="flex mt-2 overflow-hidden">
        <Sidebar />
        {/* Main Content */}
        <main className="flex-1 p-6 max-h-screen overflow-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
