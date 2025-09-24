"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogOut, User, LayoutDashboard, Settings, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import images from "@/assets/iconheader.png";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Component Logo
const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <Image src={images} alt="Logo" className="h-7 w-7 text-primary" />
    <span className="text-xl font-bold text-foreground">DAMS</span>
  </Link>
);

export default function Header() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { publicKey, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Ngăn cuộn trang khi menu di động đang mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Hàm rút gọn địa chỉ ví
  const getShortenedKey = (key: string | null) => {
    if (!key) return "";
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };
  
  // Hàm xử lý điều hướng trên di động và đóng menu
  const handleMobileNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    setTimeout(() => {
      logout();
      if (isOpen) {
        setIsOpen(false);
      }
      toast.success("You have been logged out.", {
        style: {
          backgroundColor: "#00ffb21f",
          color: "white",
        },
      });
      router.replace("/");
    });
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-sm border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Logo />

        {/* Phần hành động (User Actions) cho Desktop */}
        <div className="hidden md:flex items-center gap-4 z-1">
          {publicKey ? (
            // Khi người dùng đã đăng nhập
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar>
                    <AvatarFallback className="bg-primary/20">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">My Wallet</p>
                    <p className="text-xs text-muted-foreground">
                      {getShortenedKey(publicKey)}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/account")}>
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/history")}>
                  <History className="mr-2 h-4 w-4" /> History
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/swap")}>
                  <Settings className="mr-2 h-4 w-4" /> Swap Token
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 focus:text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Khi người dùng chưa đăng nhập
            <>
              <Button className="rounded-full" asChild>
                <Link href="/login">Connect Wallet</Link>
              </Button>

            </>
          )}
        </div>

        {/* Nút bật/tắt menu cho di động */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Menu cho di động */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-20 z-40">
          {/* Lớp nền mờ */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Nội dung Menu */}
          <div className="relative h-full bg-background border-t border-border">
            <div className="h-full overflow-y-auto px-6 py-8">
              {/* PHẦN NAV LINKS ĐÃ BỊ XÓA */}
              <nav className="flex flex-col">
                <div>
                  {publicKey ? (
                    // Khi người dùng đã đăng nhập (mobile)
                    <div className="space-y-4">
                      <div className="px-3 py-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary/20">
                              <User className="h-6 w-6" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">My Wallet</p>
                            <p className="text-sm text-muted-foreground">
                              {getShortenedKey(publicKey)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <button
                          className="w-full flex items-center gap-3 text-left py-4 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                          onClick={() => handleMobileNavigation("/account")}
                        >
                          <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">Account</span>
                        </button>
                        <button
                          className="w-full flex items-center gap-3 text-left py-4 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                          onClick={() => handleMobileNavigation("/history")}
                        >
                          <History className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">History</span>
                        </button>
                        <button
                          className="w-full flex items-center gap-3 text-left py-4 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                          onClick={() => handleMobileNavigation("/swap")}
                        >
                          <Settings className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">Swap Token</span>
                        </button>
                        <button
                          className="w-full flex items-center gap-3 text-left py-4 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                          onClick={() => handleMobileNavigation("/settings")}
                        >
                          <Settings className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">Settings</span>
                        </button>
                        <button
                          className="w-full flex items-center gap-3 text-left py-4 px-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-red-500"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-5 w-5" />
                          <span className="font-medium">Log out</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Khi người dùng chưa đăng nhập (mobile)
                    <div className="space-y-4">
                      <Button asChild  size="lg" className="w-full rounded-lg h-12">
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          Connect Wallet
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}