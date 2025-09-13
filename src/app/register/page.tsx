"use client";

import type React from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Coins,
  Shield,
  User,
  Check,
} from "lucide-react";
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
import goldbarBg from "@/assets/goldbar-bg.jpg";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    router.push("/");
  };

  return (
    <div className="auth-background with-image flex items-center justify-center p-4 sm:p-6 md:p-8">
      <Image
        src={goldbarBg}
        alt="Blockchain background"
        fill
        priority
        quality={85}
        placeholder="blur"
        className="object-cover object-center"
      />
      <div className="w-full max-w-md space-y-6 sm:space-y-8 relative z-10">
        {/* Logo và thương hiệu */}
        <div className="text-center space-y-4 floating">
          <div className="flex justify-center">
            <div className="glass-logo flex h-16 w-16 items-center justify-center rounded-2xl">
              <Coins className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            {/* SỬA ĐỔI: Thêm cỡ chữ responsive */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance glass-text-warning">
              MysticalGold
            </h1>
            <p className="glass-text-secondary text-pretty">
              Bắt đầu quản lý tài sản blockchain của bạn ngay hôm nay
            </p>
          </div>
        </div>

        {/* Form Đăng ký */}
        <Card className="glass-card border-0">
          <CardHeader className="space-y-1 text-center">
            {/* SỬA ĐỔI: Thêm cỡ chữ responsive */}
            <CardTitle className="text-xl sm:text-2xl font-semibold glass-text-primary">
              Tạo tài khoản
            </CardTitle>
            <CardDescription className="glass-text-secondary">
              Tham gia cùng hàng ngàn người dùng quản lý tài sản số một cách an
              toàn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Họ và tên */}
              {/* SỬA ĐỔI: Đồng bộ space-y-2 cho nhất quán */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="glass-text-primary">
                  Họ và tên
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Nhập họ và tên của bạn"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="glass-input pl-10 border-0"
                    required
                    autoComplete="name"
                  />
                </div>
              </div>

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
                    className="pl-10 glass-input border-0"
                    required
                    autoComplete="email"
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
                    placeholder="Tạo mật khẩu mạnh"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 glass-input"
                    required
                    autoComplete="new-password"
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
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="glass-text-primary">
                  Xác nhận mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 glass-input border-0"
                    required
                    autoComplete="new-password"
                    aria-invalid={
                      !!(confirmPassword && confirmPassword !== password)
                    }
                    aria-describedby={
                      confirmPassword && confirmPassword !== password
                        ? "confirmPassword-error"
                        : "confirmPassword"
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  {confirmPassword && confirmPassword === password && (
                    <Check className="absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 text-green-400 font-extrabold" />
                  )}
                </div>
                {confirmPassword && confirmPassword !== password && (
                  <p
                    id="confirmPassword-error"
                    className="text-sm text-red-800"
                  >
                    Mật khẩu không khớp
                  </p>
                )}
              </div>

              {/* Đồng ý điều khoản */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) =>
                    setAgreeToTerms(checked as boolean)
                  }
                  className="mt-0.5 border-white/30 data-[state=checked]:bg-white/20 shrink-0"
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms"
                    className="text-sm font-normal leading-relaxed glass-text-secondary"
                  >
                    Tôi đồng ý với{" "}
                    <Link
                      href="/terms"
                      className="font-bold glass-text-secondary hover:text-white underline-offset-4 hover:underline"
                    >
                      Điều khoản dịch vụ
                    </Link>{" "}
                    và{" "}
                    <Link
                      href="/privacy"
                      className="font-bold glass-text-secondary hover:text-white underline-offset-4 hover:underline"
                    >
                      Chính sách bảo mật
                    </Link>
                  </label>
                </div>
              </div>

              {/* Nút đăng ký */}
              <Button
                type="submit"
                className="w-full glass-button border-0"
                size="lg"
                disabled={isLoading || !agreeToTerms}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Đang tạo tài khoản...
                  </>
                ) : (
                  "Tạo tài khoản"
                )}
              </Button>
            </form>

            {/* Thông báo bảo mật */}
            <div className="mt-6 flex items-start space-x-2 glass-notice rounded-lg p-3">
              <Shield className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <p className="glass-text-primary font-medium">
                  Đăng ký an toàn
                </p>
                <p className="glass-text-muted">
                  Dữ liệu của bạn được mã hóa và bảo vệ. Chúng tôi không bao giờ
                  chia sẻ thông tin với bên thứ ba.
                </p>
              </div>
            </div>

            {/* Link đăng nhập */}
            <div className="mt-6 text-center text-sm">
              <span className="glass-text-muted">Đã có tài khoản? </span>
              <Link
                href="/login"
                className="glass-text-secondary hover:text-white font-medium underline-offset-4 hover:underline"
              >
                Đăng nhập
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs glass-text-muted">
          <p>
            Bằng việc tạo tài khoản, bạn đồng ý với{" "}
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
