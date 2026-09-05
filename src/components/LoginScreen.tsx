"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Lock,
  Mail,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Droplet,
  Leaf,
  CheckCircle2,
  KeyRound,
  Shield,
  Truck,
  Headphones,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function LoginScreen() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Password validation for registration
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please complete all registration fields.");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Password must be at least 8 characters with at least 1 letter and 1 number.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoCustomerLogin = async () => {
    setEmail("user@matrin.com");
    setPassword("User123!");
    setIsSubmitting(true);
    try {
      await login("user@matrin.com", "User123!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoAdminLogin = async () => {
    setEmail("admin@matrin.com");
    setPassword("Admin123!");
    setIsSubmitting(true);
    try {
      await login("admin@matrin.com", "Admin123!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EDF5FD] via-[#F6FAFF] to-[#E5F0FC] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Centered Auth Card Container */}
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-blue-900/10 border border-slate-100 grid lg:grid-cols-12 min-h-[640px]">
        
        {/* Left Column: Brand & Trust Showcase (5 cols on Desktop) */}
        <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between bg-gradient-to-br from-[#102A5C] via-[#0645B5] to-[#04286B] p-10 text-white overflow-hidden">
          
          {/* Subtle Decorative Ambient Lighting */}
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />

          {/* Top Logo & Slogan */}
          <div className="relative z-10 space-y-6">
            <Link href="/" className="inline-block group">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 transition-all group-hover:bg-white/20">
                <img
                  src="/images/matrin-logo-sticker.png"
                  alt="MATRIN"
                  className="h-9 w-auto object-contain"
                />
              </div>
            </Link>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold text-cyan-200 backdrop-blur-md uppercase tracking-wider">
                <Sparkles size={12} />
                Premium Cleaning Solutions
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                Pure Cleaning.<br />
                <span className="text-cyan-300">Naturally Powerful.</span>
              </h1>
              <p className="text-xs text-blue-100/80 leading-relaxed font-normal">
                Eco-friendly formulas that tackle tough stains while staying gentle on fabrics, skin, and the planet.
              </p>
            </div>
          </div>

          {/* Center Product Graphic */}
          <div className="relative z-10 my-6 flex justify-center items-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-cyan-300/10 blur-2xl transform scale-125" />
              <img
                src="/images/products/matrin-detergent-real.webp"
                alt="Matrin Ultra Detergent"
                className="relative z-10 h-52 w-auto object-contain drop-shadow-2xl transition-transform hover:scale-105 duration-300"
              />
            </div>
          </div>

          {/* Bottom 4 Highlights */}
          <div className="relative z-10 space-y-4">
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md p-2 border border-white/10">
                <Droplet size={14} className="text-cyan-300 shrink-0" />
                <span className="font-semibold text-white">3X Power Clean</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md p-2 border border-white/10">
                <Leaf size={14} className="text-emerald-300 shrink-0" />
                <span className="font-semibold text-white">Plant-Based</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md p-2 border border-white/10">
                <ShieldCheck size={14} className="text-amber-300 shrink-0" />
                <span className="font-semibold text-white">Pet & Child Safe</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-md p-2 border border-white/10">
                <Sparkles size={14} className="text-purple-300 shrink-0" />
                <span className="font-semibold text-white">Fabric Care</span>
              </div>
            </div>

            <p className="text-[10px] text-blue-200/60 text-center font-medium">
              © 2026 MATRIN Clean Technologies. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Column: Authentication Card (7 cols on Desktop) */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
          
          {/* Top Bar: Back to Home Link */}
          <div className="flex items-center justify-between">
            <div className="lg:hidden">
              <Link href="/">
                <img
                  src="/images/matrin-logo-sticker.png"
                  alt="MATRIN"
                  className="h-8 w-auto object-contain"
                />
              </Link>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0645B5] transition ml-auto"
            >
              <ArrowLeft size={14} />
              <span>Back to Store</span>
            </Link>
          </div>

          {/* Form Content Area */}
          <div className="my-auto max-w-md w-full mx-auto py-4">
            
            {/* Title Section */}
            <div className="text-center space-y-1.5 mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A5C] tracking-tight">
                {mode === "login" ? "Welcome Back!" : "Join MATRIN"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {mode === "login"
                  ? "Sign in to track orders, manage wishlist & claim coupons"
                  : "Create an account to unlock fast checkout and member perks"}
              </p>
            </div>

            {/* Segmented Switcher Tabs */}
            <div className="flex rounded-2xl bg-slate-100 p-1 mb-6 border border-slate-200/60">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
                  mode === "login"
                    ? "bg-[#0645B5] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
                  mode === "register"
                    ? "bg-[#0645B5] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Demo Quick-Login Presets (Visible on Sign In) */}
            {mode === "login" && (
              <div className="mb-6 rounded-2xl bg-blue-50/70 p-3 border border-blue-100/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#0645B5]">
                  <span className="flex items-center gap-1">
                    <KeyRound size={13} />
                    Quick 1-Click Demo Logins
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Pre-filled access</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleDemoCustomerLogin}
                    disabled={isSubmitting}
                    className="p-2 rounded-xl bg-white border border-blue-200/80 hover:bg-blue-50 text-left transition flex items-center justify-between text-[11px] font-bold text-slate-800 shadow-2xs group disabled:opacity-50"
                  >
                    <span>👤 Customer</span>
                    <span className="text-[#0645B5] group-hover:translate-x-0.5 transition-transform text-[10px]">&rarr;</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDemoAdminLogin}
                    disabled={isSubmitting}
                    className="p-2 rounded-xl bg-white border border-blue-200/80 hover:bg-blue-50 text-left transition flex items-center justify-between text-[11px] font-bold text-slate-800 shadow-2xs group disabled:opacity-50"
                  >
                    <span>👑 Admin</span>
                    <span className="text-[#0645B5] group-hover:translate-x-0.5 transition-transform text-[10px]">&rarr;</span>
                  </button>
                </div>
              </div>
            )}

            {/* Login Form */}
            {mode === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. user@matrin.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0645B5] focus:ring-1 focus:ring-[#0645B5] focus:outline-hidden transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => toast("Password reset link will be sent to your email.", { icon: "📧" })}
                      className="text-[11px] font-semibold text-[#0645B5] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <Lock size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-10 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0645B5] focus:ring-1 focus:ring-[#0645B5] focus:outline-hidden transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0645B5] py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-[#043694] active:scale-[0.99] transition disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Your Account</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative flex items-center">
                    <User size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0645B5] focus:ring-1 focus:ring-[#0645B5] focus:outline-hidden transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <Mail size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0645B5] focus:ring-1 focus:ring-[#0645B5] focus:outline-hidden transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Create Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-10 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0645B5] focus:ring-1 focus:ring-[#0645B5] focus:outline-hidden transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Password Strength Badges */}
                  <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span>Password requirements:</span>
                      {password && (
                        <span className={isPasswordValid ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                          {isPasswordValid ? "✓ Strong Password" : "Requirements incomplete"}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-1 pt-1 text-[10px]">
                      <div className={`flex items-center gap-1 transition ${hasMinLength ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
                        {hasMinLength ? <CheckCircle2 size={12} className="text-emerald-600 shrink-0" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-300 ml-1 mr-0.5" />}
                        <span>8+ Chars</span>
                      </div>
                      <div className={`flex items-center gap-1 transition ${hasLetter ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
                        {hasLetter ? <CheckCircle2 size={12} className="text-emerald-600 shrink-0" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-300 ml-1 mr-0.5" />}
                        <span>Letters</span>
                      </div>
                      <div className={`flex items-center gap-1 transition ${hasNumber ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
                        {hasNumber ? <CheckCircle2 size={12} className="text-emerald-600 shrink-0" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-300 ml-1 mr-0.5" />}
                        <span>Numbers</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0645B5] py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-[#043694] active:scale-[0.99] transition disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Bottom Toggle */}
            <div className="mt-5 text-center text-xs text-slate-500 font-medium">
              {mode === "login" ? (
                <span>
                  New to MATRIN?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="font-bold text-[#0645B5] hover:underline"
                  >
                    Create an account
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-bold text-[#0645B5] hover:underline"
                  >
                    Sign in here
                  </button>
                </span>
              )}
            </div>

          </div>

          {/* Bottom Security Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-500 font-medium">
            <div className="flex items-center justify-center gap-1">
              <Shield size={13} className="text-[#0645B5]" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Truck size={13} className="text-[#0645B5]" />
              <span>Free Delivery ₹499+</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Headphones size={13} className="text-[#0645B5]" />
              <span>24/7 Support</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
