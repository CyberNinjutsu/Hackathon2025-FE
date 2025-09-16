"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthContextType = {
  publicKey: string | null;
  login: (pubKey: string) => void;
  logout: () => void;
  isLoading?: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // load from localStorage on mount (client-only)
  useEffect(() => {
    try {
      const stored =
        typeof window !== "undefined"
          ? localStorage.getItem("userPublicKey")
          : null;
      if (stored) {
        setPublicKey(stored);
      }
    } catch (e) {
      console.error("Lỗi khi truy cập localStorage:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (pubKey: string) => {
    setPublicKey(pubKey);
    try {
      localStorage.setItem("userPublicKey", pubKey);
    } catch (e) {
      // ignore failure to write storage
      console.error("Lỗi khi ghi vào localStorage:", e);
    }
  };

  const logout = () => {
    setPublicKey(null);
    try {
      localStorage.removeItem("userPublicKey");
    } catch (e) {
      console.error("Lỗi khi xóa khỏi localStorage:", e);
    }
    // optional: redirect to login
    router.push("/");
  };

  const value: AuthContextType = {
    publicKey,
    login,
    logout,
    isLoading,
    isAuthenticated: !!publicKey,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
