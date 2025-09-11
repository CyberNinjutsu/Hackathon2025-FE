"use client";
import type React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Coins } from "lucide-react";
import { useRouter } from "next/navigation";

interface PolicyPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function PolicyPageLayout({
  title,
  lastUpdated,
  children,
}: PolicyPageLayoutProps) {
  const router = useRouter();

  return (
    <div className="flex justify-center p-4 sm:p-6 md:p-8 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width%3D%2260%22 height%3D%2260%22 viewBox%3D%220 0 60 60%22 xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg fill%3D%22none%22 fillRule%3D%22evenodd%22%3E%3Cg fill%3D%22%239C92AC%22 fillOpacity%3D%220.05%22%3E%3Ccircle cx%3D%2230%22 cy%3D%2230%22 r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none" />

      <div className="w-full max-w-4xl space-y-6 sm:space-y-8 relative z-10">
        {/* Logo và thương hiệu */}
        <div className="text-center space-y-4">
          <Link href="/login" className="inline-block">
            <div className="glass-logo flex h-16 w-16 items-center justify-center rounded-2xl mx-auto">
              <Coins className="h-8 w-8 text-white" />
            </div>
          </Link>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance glass-text-warning">
              MysticalGold
            </h1>
          </div>
        </div>

        {/* Thẻ chứa nội dung chính sách */}
        <Card className="glass-card border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-semibold glass-text-primary">
              {title}
            </CardTitle>
            <CardDescription className="glass-text-secondary">
              {lastUpdated}
            </CardDescription>
          </CardHeader>
          <CardContent className="prose-glass">{children}</CardContent>
          <CardFooter className="flex justify-center mt-6 ">
            <Button
              className="glass-button border-0 text-white"
              onClick={() => router.back()} 
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại trang trước
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
