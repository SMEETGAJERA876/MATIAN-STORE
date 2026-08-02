"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@matrin.com");
  const [password, setPassword] = useState("Admin123!");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full space-y-8 bg-slate-900/90 border border-slate-800 p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-xl">
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 font-extrabold text-2xl">
            M
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">MATRIN Enterprise Admin</h2>
          <p className="text-xs text-slate-400 font-medium">
            Sign in with an Administrator account to manage store operations
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Admin Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@matrin.com"
                className="w-full rounded-xl bg-slate-800/80 border border-slate-700 pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-slate-800/80 border border-slate-700 pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-hidden transition"
              />
            </div>
          </div>

          <div className="rounded-xl bg-blue-500/10 p-3.5 border border-blue-500/20 text-xs text-blue-300 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-blue-400">
              <Sparkles size={14} /> Default Admin Credentials:
            </span>
            <p>Email: <strong className="font-mono text-white">admin@matrin.com</strong></p>
            <p>Password: <strong className="font-mono text-white">Admin123!</strong></p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 active:scale-98 transition disabled:opacity-50"
          >
            <span>{isLoading ? "Authenticating..." : "Sign In to Admin Dashboard"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs font-bold text-slate-400 hover:text-white transition">
            ← Back to Storefront
          </Link>
        </div>

      </div>
    </div>
  );
}
