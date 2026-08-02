"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { AdminProvider } from "@/adminApp/store/adminStore";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Handle standalone admin login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Enforce Role-Based Access Control (RBAC) Protection for Admin Console
  useEffect(() => {
    if (isLoaded) {
      if (!user || user.role?.toUpperCase() !== "ADMIN") {
        router.push("/admin/login");
      }
    }
  }, [user, isLoaded, router]);

  if (!isLoaded || !user || user.role?.toUpperCase() !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white font-sans">
        <div className="h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verifying Admin Permissions...</p>
      </div>
    );
  }

  return <AdminProvider>{children}</AdminProvider>;
}
