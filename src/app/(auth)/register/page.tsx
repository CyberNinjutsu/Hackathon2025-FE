"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Check,
  Coins,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

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

    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 2000));

    router.push("/");
  };

  return (
    <div className="auth-background flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md space-y-6 sm:space-y-8 relative z-10">
        {/* Logo and branding */}
        <div className="text-center space-y-4 floating uppercase font-bold">
          <div className="flex justify-center">
            <div className="glass-logo flex h-16 w-16 items-center justify-center rounded-2xl">
              <Coins className="h-8 w-8 text-white" />
            </div>
          </div>
          Create Your Own Wallet
        </div>

        {/* Registration Form */}
        <Card className="glass-card border-0">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-xl sm:text-2xl font-semibold glass-text-primary">
              Create Account
            </CardTitle>
            <CardDescription className="glass-text-secondary">
              Join thousands of users managing digital assets securely
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="glass-text-primary">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
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
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 glass-input border-0"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="glass-text-primary">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="glass-text-primary">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
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
                      showConfirmPassword ? "Hide password" : "Show password"
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
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Agree to Terms */}
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
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="font-bold glass-text-secondary hover:text-white underline-offset-4 hover:underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="font-bold glass-text-secondary hover:text-white underline-offset-4 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                className="w-full glass-button border-0"
                size="lg"
                disabled={isLoading || !agreeToTerms}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 flex items-start space-x-2 glass-notice rounded-lg p-3">
              <Shield className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <p className="glass-text-primary font-medium">
                  Secure Registration
                </p>
                <p className="glass-text-muted">
                  Your data is encrypted and protected. We never share
                  information with third parties.
                </p>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center text-sm">
              <span className="glass-text-muted">
                Already have an account?{" "}
              </span>
              <Link
                href="/login"
                className="glass-text-secondary hover:text-white font-medium underline-offset-4 hover:underline"
              >
                Login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs glass-text-muted">
          <p>
            By creating an account, you agree to the{" "}
            <Link href="/terms" className="underline hover:text-white/80">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-white/80">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
