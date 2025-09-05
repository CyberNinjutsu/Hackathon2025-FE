import { BarChart3, History, Settings, Wallet } from "lucide-react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

export default function Sidebar() {
  const params = useParams()
  const pathname = usePathname()

  const sidebarItems = [
    {
      name: "Tổng quan tài sản",
      icon: BarChart3,
      route: ``
    },
    {
      name: "Danh mục tài sản",
      icon: Wallet,
      route: `portfolio`
    },
    {
      name: "Quản lý giao dịch",
      icon: History,
      route: `transactions`
    },
    {
      name: "Hành động quản lý",
      icon: Settings,
      route: `actions`
    }
  ]

  return (
    <aside className='w-64 glass-card border-r border-white/10 min-h-screen'>
      <nav className='p-4 space-y-2'>
        {sidebarItems.map((item) => {
          const IconComponent = item.icon
          const link = `/dashboard/${params.id}${
            item.route ? `/${item.route}` : ""
          }`
          const isActive = pathname === link

          return (
            <Link key={item.name} href={link}>
              <button
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-white/10 text-white border"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <IconComponent className='w-5 h-5' />
                <span className='text-sm font-medium'>{item.name}</span>
              </button>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
