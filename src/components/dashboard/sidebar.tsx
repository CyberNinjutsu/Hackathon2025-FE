"use client"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"
import {
  ArrowLeftRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  Wallet,
  X,
  Zap
} from "lucide-react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { useState } from "react"

const navigation = [
  {
    name: "Tổng quan",
    href: "",
    icon: LayoutDashboard
  },
  {
    name: "Danh mục tài sản",
    href: "portfolio",
    icon: Wallet
  },
  {
    name: "Thêm giao dịch",
    href: "actions",
    icon: Zap
  },
  {
    name: "Lịch sử ",
    href: "transactions",
    icon: ArrowLeftRight
  },
  {
    name: "Bảo mật",
    href: "security",
    icon: Shield
  }
]

export function Sidebar() {
  const params = useParams()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "flex flex-col bg-card border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b border-border'>
        {!isCollapsed && (
          <Link
            href={`/dashboard/${params.id}`}
            className='flex items-center gap-2'
          >
            <Logo />
          </Link>
        )}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setIsCollapsed(!isCollapsed)}
          className='ml-auto'
        >
          {isCollapsed ? (
            <Menu className='w-4 h-4' />
          ) : (
            <X className='w-4 h-4' />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className='flex-1 flex flex-col p-4 gap-[5px]'>
        {navigation.map((item) => {
          const link = `/dashboard/${params.id}${
            item.href ? `/${item.href}` : ""
          }`
          const isActive = pathname === link

          return (
            <Link key={item.name} href={link}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isCollapsed && "px-2 flex justify-center items-center"
                )}
              >
                <item.icon className='w-4 h-4 flex-shrink-0' />
                {!isCollapsed && <span>{item.name}</span>}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className='p-4 border-t border-border'>
        <Button
          variant='ghost'
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
            isCollapsed && "px-2"
          )}
        >
          <LogOut className='w-4 h-4 flex-shrink-0' />
          {!isCollapsed && <span>Đăng xuất</span>}
        </Button>
      </div>
    </div>
  )
}
