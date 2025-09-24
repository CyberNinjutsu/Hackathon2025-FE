"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { adminAuthService } from "@/lib/adminAuth";
import { Shield } from "lucide-react";

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export default function AdminAuthProvider({
  children,
}: AdminAuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      try {
        const authenticated = adminAuthService.validateSession();
        setIsAuthenticated(authenticated);

        // If not authenticated and not on auth page, redirect to auth
        if (!authenticated && pathname !== "/auth") {
          // console.log(`Redirecting to auth from: ${pathname}`);
          router.replace("/auth");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        if (pathname !== "/auth") {
          // console.log(`Auth error, redirecting to auth from: ${pathname}`);
          router.replace("/auth");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Check auth status periodically (every 30 seconds)
    const interval = setInterval(checkAuth, 30000);

    return () => clearInterval(interval);
  }, [pathname, router]);

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 border border-primary/30 rounded-xl">
            <Shield className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Verifying Access
            </h2>
            <p className="text-gray-400">Checking authentication status...</p>
          </div>
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // If on auth page, render without auth check
  if (pathname === "/auth") {
    return <>{children}</>;
  }

  // If not authenticated, show access denied (shouldn't happen due to redirect, but safety net)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 border border-red-500/30 rounded-xl">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Access Denied
            </h2>
            <p className="text-gray-400 mb-6">
              You need to be authenticated to access the admin dashboard.
            </p>
            <button
              onClick={() => router.replace("/auth")}
              className="bg-primary/20 hover:bg-primary/30 border border-primary/40 px-6 py-3 rounded-lg text-primary font-medium transition-all duration-300 hover:scale-105"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render children
  return <>{children}</>;
}
