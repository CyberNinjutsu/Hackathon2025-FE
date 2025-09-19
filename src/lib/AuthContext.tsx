"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  publicKey: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (publicKey: string) => void;
  logout: () => void;
  savePublicKey: (publicKey: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedPublicKey = localStorage.getItem('userPublicKey');
    if (savedPublicKey) {
      setPublicKey(savedPublicKey);
    }
    setIsLoading(false);
  }, []);

  const login = (userPublicKey: string) => {
    setPublicKey(userPublicKey);
    localStorage.setItem('userPublicKey', userPublicKey);
  };

  const logout = () => {
    setPublicKey(null);
    localStorage.removeItem('userPublicKey');
  };

  const value = {
    publicKey,
    isAuthenticated: !!publicKey,
    isLoading,
    login,
    logout,
    savePublicKey: login, // Alias for login
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}