"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import images from "@/assets/iconheader.png";

const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <Image src={images} alt="Logo" className="h-7 w-7 text-primary" />
    <span className="text-xl font-bold text-foreground">DAMS</span>
  </Link>
);

export default function Header() {
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
    <header
      className={cn(
        "fixed top-0 left-0 z-50 w-full transition-all duration-300 py-7 px-16",
        isScrolled
          ? "bg-background/90 backdrop-blur-sm border-b border-border"
          : "bg-transparent"
      )}
    >
      <Logo />
    </header>
  );
}
