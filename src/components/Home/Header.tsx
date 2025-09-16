"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Coins, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import images from "@/assets/iconheader.png";
const navLinks = [
  { label: "Why Cryptix?", href: "#why" },
  { label: "Cryptos", href: "#allcryptos" },
  { label: "How it works", href: "#howitworks" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "FAQ", href: "#faq" },
];

// Component Logo để tái sử dụng
const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <Image src={images} alt="Logo" className="h-7 w-7 text-primary" />
    <span className="text-xl font-bold text-foreground">Cryptix</span>
  </Link>
);
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Thêm event listener khi component mount
    window.addEventListener("scroll", handleScroll);

    // Dọn dẹp event listener khi component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    // <header className="border-b border-white/10 backdrop-blur-md bg-white/5">
    //   <div className="container mx-auto px-4 py-4 flex items-center justify-between">
    //     {/* Logo Section */}
    //     <div className="flex items-center space-x-3">
    //       <div className="w-10 h-10 glass-card flex items-center justify-center">
    //         <ArrowUpDown className="w-6 h-6 text-purple-300" />
    //       </div>
    //       <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">
    //         AssetVault
    //       </h1>
    //     </div>

    //     {/* Navigation */}
    //     <div className="flex items-center space-x-3">
    //       <Button
    //         variant="ghost"
    //         className="glass-button text-white hover:text-white"
    //       >
    //         <Link href="/login">Login</Link>
    //       </Button>

    //       <Button className="glass-button text-white hover:text-white">
    //         <Link href="/register">Sign Up</Link>
    //       </Button>
    //     </div>
    //   </div>
    // </header>
    <header
      className={cn(
        "fixed top-0 left-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-sm border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Logo />

        {/* --- Desktop Navigation --- */}
        <nav className="hidden md:flex">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="rounded-full">
            Connect Wallet
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/register">Sign Up</Link>
          </Button>
        </div>

        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* --- MOBILE NAVIGATION MENU (ĐÃ THAY ĐỔI) --- */}
      {isOpen && (
        <div className="md:hidden">
          <div className="absolute top-full left-0 w-full border-t border-border bg-background/95 px-6 pt-4 pb-8">
            <nav className="flex flex-col gap-6">
              {/* Nav links */}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg font-medium text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {/* Auth actions */}
              <div className="mt-6 flex flex-col gap-4 ">
                <Button variant="ghost" size="lg" className="rounded-full">
                  Connect Wallet
                </Button>
                <Button asChild className="rounded-full" size="lg">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
