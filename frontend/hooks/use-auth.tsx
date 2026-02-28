"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login as apiLogin, getUser, type User } from "@/lib/api";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    if (storedToken && storedUserId) {
      setToken(storedToken);
      getUser(storedUserId)
        .then(setUser)
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { access_token } = await apiLogin(email, password);
    // Decode JWT payload to get user id
    let userId: string;
    try {
      const payload = JSON.parse(atob(access_token.split(".")[1]));
      userId = payload.sub ?? payload.identity ?? payload.id;
      if (!userId) throw new Error("No user ID in token");
    } catch {
      throw new Error("Invalid token received from server");
    }
    localStorage.setItem("token", access_token);
    localStorage.setItem("userId", userId);
    setToken(access_token);
    const userData = await getUser(userId);
    setUser(userData);
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
