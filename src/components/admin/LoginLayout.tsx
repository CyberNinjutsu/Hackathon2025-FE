"use client";

import { ReactNode } from "react";
import { Shield, Lock } from "lucide-react";
import BackgroundGlow from "@/components/Glow/BackgroundGlow";

interface LoginLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  isLoading?: boolean;
}

export default function LoginLayout({
  children,
  title,
  subtitle,
  isLoading = false,
}: LoginLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center p-4">
      {/* Background Effects */}
      <BackgroundGlow />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-xl p-8 flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400">Processing...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Logo/Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-cyan-400/20 border border-primary/30 rounded-xl mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent mb-2">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && <p className="text-gray-400 text-lg">{subtitle}</p>}
        </div>

        {/* Form Container */}
        <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl p-8">
          {children}
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span>Secure Admin Access</span>
          </div>
        </div>
      </div>
    </div>
  );
}
