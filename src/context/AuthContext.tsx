"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthContextType } from "@/types/auth";
import toast from "react-hot-toast";

const initialUsers: User[] = [
  {
    id: "usr_admin",
    name: "Matrin Admin",
    email: "admin@matrin.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    createdAt: "2025-01-01",
    totalOrders: 28,
    totalSpent: 14500,
    status: "Active",
  },
  {
    id: "usr_demo",
    name: "Standard User",
    email: "user@matrin.com",
    role: "user",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    createdAt: "2025-05-01",
    totalOrders: 2,
    totalSpent: 1290,
    status: "Active",
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(initialUsers);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("matrin_auth_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      const savedUsers = localStorage.getItem("matrin_all_users");
      if (savedUsers) {
        setAllUsers(JSON.parse(savedUsers));
      }
    } catch (e) {
      console.error("Failed to parse stored auth user:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const openAuthModal = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const closeAuthModal = () => {};

  const login = (identifier: string, pass: string): boolean => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Check Admin login (username 'admin' or 'admin@matrin.com')
    if (cleanId === "admin" || cleanId === "admin@matrin.com") {
      if (cleanPass === "ADMIN!@#$" || cleanPass === "admin123" || cleanPass === "admin") {
        const adminUser = allUsers.find(u => u.role === "admin") || initialUsers[0];
        setUser(adminUser);
        localStorage.setItem("matrin_auth_user", JSON.stringify(adminUser));
        toast.success("Welcome back, Admin!", { icon: "👑" });
        closeAuthModal();
        if (typeof window !== "undefined") {
          window.location.href = "/admin";
        }
        return true;
      } else {
        toast.error("Incorrect Admin Password.");
        return false;
      }
    }

    // Check Standard User login (username 'user' or 'user@matrin.com')
    if (cleanId === "user" || cleanId === "user@matrin.com") {
      if (cleanPass === "USER!@#$" || cleanPass === "user123" || cleanPass === "user") {
        const standardUser = allUsers.find(u => u.email === "user@matrin.com") || initialUsers[1];
        setUser(standardUser);
        localStorage.setItem("matrin_auth_user", JSON.stringify(standardUser));
        toast.success("Welcome back, User!", { icon: "👤" });
        closeAuthModal();
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
        return true;
      } else {
        toast.error("Incorrect Password.");
        return false;
      }
    }

    // Check other registered users
    const matched = allUsers.find(u => u.email.toLowerCase() === cleanId || u.name.toLowerCase() === cleanId);
    if (matched) {
      setUser(matched);
      localStorage.setItem("matrin_auth_user", JSON.stringify(matched));
      toast.success(`Welcome back, ${matched.name}!`, { icon: "✨" });
      closeAuthModal();
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
      return true;
    }

    // Allow mock fallback login for custom email/user
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: identifier.split("@")[0] || "Customer",
      email: cleanId.includes("@") ? cleanId : `${cleanId}@matrin.com`,
      role: "user",
      createdAt: new Date().toISOString().split("T")[0],
      totalOrders: 0,
      totalSpent: 0,
      status: "Active",
    };
    
    setUser(newUser);
    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    localStorage.setItem("matrin_auth_user", JSON.stringify(newUser));
    localStorage.setItem("matrin_all_users", JSON.stringify(updatedUsers));
    toast.success(`Welcome to Matrin, ${newUser.name}!`, { icon: "🎉" });
    closeAuthModal();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    return true;
  };

  const quickAdminLogin = () => {
    login("admin", "ADMIN!@#$");
  };

  const quickUserLogin = () => {
    login("user", "USER!@#$");
  };

  const register = (name: string, email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (allUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      toast.error("An account with this email already exists!");
      return false;
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      role: "user",
      createdAt: new Date().toISOString().split("T")[0],
      totalOrders: 0,
      totalSpent: 0,
      status: "Active",
    };

    const updatedUsers = [...allUsers, newUser];
    setAllUsers(updatedUsers);
    setUser(newUser);
    localStorage.setItem("matrin_auth_user", JSON.stringify(newUser));
    localStorage.setItem("matrin_all_users", JSON.stringify(updatedUsers));
    toast.success(`Account created! Welcome, ${newUser.name}!`, { icon: "🚀" });
    closeAuthModal();
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("matrin_auth_user");
    toast.success("Signed out successfully");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isLoaded,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        quickAdminLogin,
        quickUserLogin,
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
