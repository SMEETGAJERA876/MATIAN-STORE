"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthContextType } from "@/types/auth";
import { supabase } from "@/lib/supabase/client";
import type { Session } from "@supabase/supabase-js";
import toast from "react-hot-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ACCESS_TOKEN_COOKIE = "sb-access-token";

function setAccessTokenCookie(session: Session | null) {
  if (typeof document === "undefined") return;

  if (!session) {
    document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0`;
    return;
  }

  const maxAge = Math.max(0, Math.floor((session.expires_at || 0) - Date.now() / 1000));
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
}

async function fetchProfile(userId: string, fallbackEmail: string): Promise<User | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, role, status, createdAt:created_at, totalOrders:total_orders, totalSpent:total_spent")
    .eq("id", userId)
    .single();

  if (error || !data) {
    console.error("Failed to load profile:", error?.message);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email || fallbackEmail,
    role: data.role,
    status: data.status,
    createdAt: data.createdAt,
    totalOrders: data.totalOrders || 0,
    totalSpent: data.totalSpent || 0,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadInitialSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!active) return;

        setAccessTokenCookie(session);
        setToken(session?.access_token || null);

        if (session?.user) {
          const profile = await fetchProfile(session.user.id, session.user.email || "");
          if (active) setUser(profile);
        }
      } catch (err) {
        console.warn("Could not load initial auth session:", err);
      } finally {
        if (active) setIsLoaded(true);
      }
    }

    loadInitialSession();

    const { data: subscription } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setAccessTokenCookie(session);
      setToken(session?.access_token || null);

      if (session?.user) {
        const profile = await fetchProfile(session.user.id, session.user.email || "");
        setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const openAuthModal = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const closeAuthModal = () => {};

  const login = async (identifier: string, pass: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: identifier.trim().toLowerCase(),
        password: pass,
      });

      if (error || !data.session || !data.user) {
        toast.error(error?.message || "Login failed.");
        return false;
      }

      const profile = await fetchProfile(data.user.id, data.user.email || "");
      setUser(profile);

      toast.success(`Welcome back, ${profile?.name || "there"}!`, { icon: "👤" });

      if (typeof window !== "undefined") {
        if (profile?.role?.toString().toUpperCase() === "ADMIN") {
          window.location.href = "/admin/dashboard";
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
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: pass,
        options: { data: { name: name.trim() } },
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return false;
      }

      if (!data.session) {
        toast.success("Account created! Please check your email to confirm before logging in.", { icon: "📧" });
        return true;
      }

      const profile = await fetchProfile(data.user!.id, data.user!.email || "");
      setUser(profile);

      toast.success(`Account created! Welcome, ${profile?.name || name}!`, { icon: "🚀" });

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
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      setUser(null);
      setToken(null);
      setAccessTokenCookie(null);
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
