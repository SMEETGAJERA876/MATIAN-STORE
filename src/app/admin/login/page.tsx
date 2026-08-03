"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, Sparkles, KeyRound, ArrowRight } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("admin@matrin.com");
  const [password, setPassword] = useState("Admin123!");
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in as admin, redirect automatically
  React.useEffect(() => {
    if (user && user.role?.toUpperCase() === "ADMIN") {
      router.push("/admin/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email and password");
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email.trim(), password);
      if (success) {
        toast.success("Admin authenticated successfully!");
        router.push("/admin/dashboard");
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to authenticate admin.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdminLogin = async () => {
    setEmail("admin@matrin.com");
    setPassword("Admin123!");
    setIsLoading(true);
    try {
      const success = await login("admin@matrin.com", "Admin123!");
      if (success) {
        toast.success("Logged in with Quick Admin account!");
        router.push("/admin/dashboard");
      }
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Quick admin login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#1B3A8C]/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-500/20 blur-[120px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 backdrop-blur-xl p-8 rounded-3xl shadow-2xl relative z-10 space-y-8">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-[#1B3A8C] to-blue-600 shadow-lg shadow-blue-900/40">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2">
              MATRIN <span className="text-cyan-400 font-extrabold text-xs uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800">Admin</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Enterprise Dashboard & Store Management System
            </p>
          </div>
        </div>

        {/* Quick Admin Access Preset */}
        <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 space-y-2">
          <div className="flex items-center justify-between text-xs text-blue-300 font-semibold">
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-cyan-400" />
              Demo Admin Account
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">admin@matrin.com</span>
          </div>
          <button
            type="button"
            onClick={handleQuickAdminLogin}
            disabled={isLoading}
            className="w-full py-2 px-3 rounded-xl bg-[#1B3A8C] hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <KeyRound size={14} />
            <span>One-Click Quick Admin Login</span>
          </button>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@matrin.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
              <Mail size={18} className="absolute left-3 top-3.5 text-slate-500" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
              />
              <Lock size={18} className="absolute left-3 top-3.5 text-slate-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#1B3A8C] to-blue-600 hover:from-blue-700 hover:to-blue-500 text-white font-extrabold text-sm transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Admin Console</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
          <Link href="/" className="hover:text-cyan-400 transition">
            ← Back to Storefront
          </Link>
          <span className="text-slate-600">MATRIN v1.0 Enterprise</span>
        </div>
      </div>
    </div>
  );
}
