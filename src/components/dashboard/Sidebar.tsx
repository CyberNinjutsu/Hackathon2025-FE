"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Coins, ArrowRightLeft, LogOut } from "lucide-react";
import { toast } from "sonner";
import Logo from "../Logo";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Tokens",
    href: "/admin/assets",
    icon: Coins,
  },
  {
    name: "Transactions",
    href: "/admin/transactions",
    icon: ArrowRightLeft,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAdminAuth();

  const handleLogout = async () => {
    try {
      logout();
      toast.success("Signed out successfully");
      router.push("/auth");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <div className="w-16 xl:w-64 bg-gray-900/80 backdrop-blur-xl border-r border-gray-800 flex flex-col relative z-10">
      {/* Logo */}
      <div className="px-3 py-[32px] md:py-7 xl:px-6 xl:py-9 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-3">
          <Logo />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 xl:p-4 space-y-1 xl:space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <div key={item.name} className="relative group flex item-center justify-center xl:block">
              <Link
                href={item.href}
                className={`
                  flex items-center gap-3 p-2 xl:px-4 xl:py-3 rounded-lg transition-all duration-300
                  ${isActive
                    ? "bg-primary/20 border border-primary/30 text-primary"
                    : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium hidden xl:block">{item.name}</span>
              </Link>

              {/* Tooltip for mobile/tablet */}
              <div className="xl:hidden absolute left-full ml-4 top-1/2 -translate-y-1/2
      flex items-center
      opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-15">
                {item.name}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800/90"></div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-2 xl:p-4 border-t border-gray-800">
        <div className="relative group">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-2 xl:px-4 xl:py-3 rounded-lg transition-all duration-300 text-gray-300 hover:bg-red-500/20 hover:text-red-400 hover:border hover:border-red-500/30"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium hidden xl:block">Logout</span>
          </button>

          {/* Tooltip for mobile/tablet */}
          <div className="xl:hidden absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-15 whitespace-nowrap border border-gray-700">
            Logout
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-800/90"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
