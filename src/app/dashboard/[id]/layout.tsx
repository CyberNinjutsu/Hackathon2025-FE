import Header from "@/components/dashboard/Header"
import Sidebar from "@/components/dashboard/sidebar"
import React from "react"

export default function LayoutDashboard({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900'>
      {/* Header */}
      <Header />

      <div className='flex'>
        <Sidebar />
        {/* Main Content */}
        <main className='flex-1 p-6'>{children}</main>
      </div>
    </div>
  )
}
