import { Sidebar } from "@/components/dashboard/sidebar"
import type React from "react"

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex h-screen bg-background'>
      <Sidebar />
      <main className='flex-1 overflow-y-auto p-[15px]'>{children}</main>
    </div>
  )
}
