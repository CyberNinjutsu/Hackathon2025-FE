"use client";

import { AuthContextType } from '@/utils/Types';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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