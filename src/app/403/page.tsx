"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white font-sans">
      <div className="max-w-md w-full text-center space-y-6 bg-slate-800/80 p-8 md:p-10 rounded-3xl border border-slate-700/60 shadow-2xl backdrop-blur-md">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
          <ShieldAlert size={44} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-rose-400">HTTP 403 FORBIDDEN</span>
          <h1 className="text-3xl font-extrabold text-white">Access Denied</h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
            You do not have Administrator privileges to access this area. If you believe this is an error, please log in with an Administrator account.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white hover:bg-blue-500 transition shadow-lg shadow-blue-600/20"
          >
            <Home size={16} />
            <span>Return to Storefront</span>
          </Link>
          <Link
            href="/admin/login"
            className="flex items-center justify-center gap-2 rounded-xl bg-slate-700 px-6 py-3 text-xs font-bold text-slate-200 hover:bg-slate-600 transition border border-slate-600"
          >
            <ArrowLeft size={16} />
            <span>Admin Login</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
