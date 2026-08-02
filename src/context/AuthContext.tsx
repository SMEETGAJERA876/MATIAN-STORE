"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthContextType } from "@/types/auth";
import toast from "react-hot-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Initialize Auth & fetch session from API / localStorage
  useEffect(() => {
    async function loadAuth() {
      try {
        const savedToken = localStorage.getItem("matrin_jwt_token");
        const savedUser = localStorage.getItem("matrin_auth_user");

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
        if (savedToken) {
          setToken(savedToken);
        }

        // Verify session via API
        const res = await fetch("/api/auth/me", {
          headers: savedToken ? { Authorization: `Bearer ${savedToken}` } : {},
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            localStorage.setItem("matrin_auth_user", JSON.stringify(data.user));
          }
        }
      } catch (e) {
        console.error("Auth loading error:", e);
      } finally {
        setIsLoaded(true);
      }
    }

    loadAuth();
  }, []);

  const openAuthModal = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const closeAuthModal = () => {};

  const login = async (identifier: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identifier, password: pass }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Login failed.");
        return false;
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("matrin_auth_user", JSON.stringify(data.user));
      localStorage.setItem("matrin_jwt_token", data.token);

      toast.success(`Welcome back, ${data.user.name}!`, { icon: "👤" });

      if (typeof window !== "undefined") {
        const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3001";
        if (data.user.role === "ADMIN" || data.user.email?.toLowerCase().includes("admin")) {
          window.location.href = adminUrl;
        } else {
          window.location.href = "/";
        }
      }

      return true;
    } catch (e: unknown) {
      const error = e as Error;
      toast.error(error.message || "An unexpected error occurred during login.");
      return false;
    }
  };

  const quickUserLogin = () => {
    login("user@matrin.com", "User123!");
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: pass }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed.");
        return false;
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("matrin_auth_user", JSON.stringify(data.user));
      localStorage.setItem("matrin_jwt_token", data.token);

      toast.success(`Account created! Welcome, ${data.user.name}!`, { icon: "🚀" });

      if (typeof window !== "undefined") {
        window.location.href = "/";
      }

      return true;
    } catch (e: unknown) {
      const error = e as Error;
      toast.error(error.message || "Registration failed.");
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout API error:", e);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("matrin_auth_user");
      localStorage.removeItem("matrin_jwt_token");
      toast.success("Signed out successfully");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
  };

  const quickAdminLogin = () => {
    login("admin@matrin.com", "Admin123!");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        token,
        isAuthenticated: !!user,
        isLoaded,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        quickUserLogin,
        quickAdminLogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
