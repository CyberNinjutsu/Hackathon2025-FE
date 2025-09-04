"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Lock, Mail, Coins, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { goldCoinBlurUrl } from "@/lib/blur-bg";
export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    router.push("/");
  };

  return (
    <div className="auth-background flex items-center justify-center p-4">
      <Image
        src="/gold-bars3.jpg"
        alt="Blockchain background"
        fill
        className="opacity-70"
        priority
        quality={85}
        placeholder="blur"
        blurDataURL={goldCoinBlurUrl} // tiny base64 preview
      />
      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo và thương hiệu */}
        <div className="text-center space-y-4 floating">
          <div className="flex justify-center">
            <div className="glass-logo flex h-16 w-16 items-center justify-center rounded-2xl">
              <Coins className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-balance glass-text-warning">
              MysticalGold
            </h1>
            <p className="glass-text-secondary text-pretty">
              Truy cập an toàn vào tài sản blockchain của bạn
            </p>
          </div>
        </div>

        {/* Form đăng nhập */}
        <Card className="glass-card border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-semibold glass-text-primary">
              Chào mừng trở lại
            </CardTitle>
            <CardDescription className="glass-text-secondary">
              Đăng nhập để quản lý tài sản số của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="glass-text-primary">
                  Địa chỉ Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-black-400 glass-input pl-10 border-0"
                    required
                    aria-describedby="email-description"
                    name="email"
                  />
                </div>
              </div>

              {/* Mật khẩu */}
              <div className="space-y-2">
                <Label htmlFor="password" className="glass-text-primary">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 glass-input"
                    required
                    name="password"
                    aria-describedby="password-description"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p id="password-description" className="sr-only">
                  Nhập mật khẩu của bạn để đăng nhập.
                </p>
              </div>

              {/* Ghi nhớ & Quên mật khẩu */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    className="border-white/30 data-[state=checked]:bg-white/20"
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm font-normal glass-text-secondary"
                  >
                    Ghi nhớ đăng nhập
                  </Label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm glass-text-secondary hover:text-white underline-offset-4 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Nút đăng nhập */}
              <Button
                type="submit"
                className="border-0 w-full glass-button"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Đang đăng nhập...
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </form>

            {/* Thông báo bảo mật */}
            <div className="mt-6 flex items-start space-x-2 glass-notice rounded-lg p-3">
              <Shield className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-medium glass-text-primary">
                  Đăng nhập an toàn
                </p>
                <p className="glass-text-muted">
                  Kết nối của bạn được mã hóa và dữ liệu được bảo vệ với tiêu
                  chuẩn bảo mật cao.
                </p>
              </div>
            </div>

            {/* Link đăng ký */}
            <div className="mt-6 text-center text-sm">
              <span className="glass-text-muted">Chưa có tài khoản? </span>
              <Link
                href="/register"
                className="glass-text-secondary hover:text-white font-medium underline-offset-4 hover:underline"
              >
                Tạo tài khoản
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs glass-text-muted">
          <p>
            Khi đăng nhập, bạn đồng ý với{" "}
            <Link href="/terms" className="underline hover:text-white/80">
              Điều khoản dịch vụ
            </Link>{" "}
            và{" "}
            <Link href="/privacy" className="underline hover:text-white/80">
              Chính sách bảo mật
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
