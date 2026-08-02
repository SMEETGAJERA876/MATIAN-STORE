"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Lock,
  Mail,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Key,
  Leaf,
  Sparkles,
  RefreshCw,
  Headphones,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import toast from "react-hot-toast";

export default function LoginScreen() {
  const { login, quickUserLogin, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Real-time password validation rules
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasLetter && hasNumber;

  const handleSocialComingSoon = (provider: string) => {
    toast(`${provider} login coming soon — please use email login for now.`, {
      icon: "🚀",
      duration: 4000,
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    login(email, password);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password) return;

    if (!isPasswordValid) {
      toast.error("Password must be at least 8 characters with 1 letter & 1 number.");
      return;
    }

    register(name, email, password);
  };

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen w-full bg-white overflow-y-auto font-sans">
      <div className="flex min-h-full w-full flex-col lg:flex-row">
        
        {/* Left Column: Liquid Artwork & Branding Showcase (Exact Match with Reference Image 2) */}
        <div className="hidden lg:flex w-1/2 flex-col justify-between bg-gradient-to-b from-[#EBF3FB] via-[#F2F7FD] to-[#E5EFF9] p-12 lg:p-14 relative overflow-hidden border-r border-slate-100">
          
          {/* Subtle Floating Water Drops Graphics */}
          <div className="absolute top-10 right-10 text-cyan-400/40 text-4xl animate-pulse pointer-events-none">💧</div>

          {/* Top Brand Logo */}
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2">
              <img
                src="/images/matrin-logo-clean.webp"
                alt="MATRIN"
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Hero Content & Product Lineup */}
          <div className="relative z-10 my-auto space-y-6 max-w-lg">
            <div className="space-y-2">
              <h1 className="font-sans text-4xl lg:text-5xl font-extrabold text-[#0B2545] leading-tight">
                Pure Cleaning.
              </h1>
              <h1 className="font-sans text-4xl lg:text-5xl font-extrabold text-[#1E40AF] leading-tight">
                Better Living.
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-md">
              Eco-friendly cleaning solutions that are tough on stains and safe for your family.
            </p>

            {/* Product Bottles Lineup Image */}
            <div className="pt-2 flex justify-center">
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                src="/images/matrin-hero-lineup.png"
                alt="Matrin Products Showcase"
                className="h-auto max-h-[300px] w-auto object-contain drop-shadow-xl"
              />
            </div>

            {/* Bottom 4 Feature Badges Card (Exact Match with Image 2) */}
            <div className="rounded-2xl bg-white/90 p-4 border border-slate-200/80 shadow-sm backdrop-blur-md grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-slate-700">
              <div className="flex flex-col items-center gap-1">
                <div className="h-7 w-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <Leaf size={14} />
                </div>
                <span>Plant Based Ingredients</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="h-7 w-7 rounded-full bg-blue-50 text-[#1E40AF] flex items-center justify-center border border-blue-100">
                  <ShieldCheck size={14} />
                </div>
                <span>Safe for Your Family</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="h-7 w-7 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <Sparkles size={14} />
                </div>
                <span>Powerful Cleaning</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <div className="h-7 w-7 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                  <RefreshCw size={14} />
                </div>
                <span>Eco Friendly Packaging</span>
              </div>
            </div>
          </div>

          {/* Left Footer copyright */}
          <div className="relative z-10 text-[11px] text-slate-400 font-medium">
            © 2026 MATRIN STORE INDIA. All rights reserved.
          </div>
        </div>

        {/* Right Column: Clean Login Card (Exact Match with Reference Image 2) */}
        <div className="flex w-full flex-col justify-between p-8 sm:p-12 lg:w-1/2 lg:p-14 xl:p-16 bg-white min-h-screen">
          
          {/* Top Header: Back to Home Link */}
          <div className="flex items-center justify-end">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#1E40AF] transition"
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Form Container */}
          <div className="my-auto max-w-md w-full mx-auto py-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Centered Brand Logo */}
              <div className="flex justify-center">
                <img
                  src="/images/matrin-logo-clean.webp"
                  alt="MATRIN"
                  className="h-10 w-auto object-contain"
                />
              </div>

              {/* Title & Subtitle */}
              <div className="text-center space-y-1">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545] tracking-tight">
                  {mode === "login" ? "Welcome Back!" : "Create Account"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  {mode === "login"
                    ? "Login to your account and continue shopping"
                    : "Register to unlock exclusive offers & rewards"}
                </p>
              </div>

              {/* Preset 1-Click Credentials Box */}
              {process.env.NODE_ENV === "development" && (
                <div className="rounded-2xl bg-blue-50/60 p-3.5 border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#1E40AF]">
                    <span className="flex items-center gap-1.5">
                      <Key size={14} className="text-amber-600" /> Demo Accounts
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">Click for 1-Click Login</span>
                  </div>

                  <div className="pt-0.5">
                    <button
                      type="button"
                      onClick={quickUserLogin}
                      className="w-full p-2.5 rounded-xl bg-white border border-blue-200 text-left hover:bg-blue-50 transition flex items-center justify-between"
                    >
                      <div>
                        <span className="font-bold text-blue-950 text-xs block">👤 Demo Customer Login</span>
                        <span className="text-[10px] text-slate-500 font-mono">user: user@matrin.com</span>
                      </div>
                      <span className="text-xs font-bold text-[#1E40AF]">1-Click Login &rarr;</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Login / Register Form */}
              {mode === "login" ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative flex items-center">
                      <Mail size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <Lock size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF] focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    {/* Real-Time Password Validation Guidance */}
                    <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-slate-500 font-medium">
                        <span>Must be at least 8 characters with 1 letter & 1 number:</span>
                        {password && (
                          <span className={isPasswordValid ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                            {isPasswordValid ? "✓ Strong Password" : "Incomplete"}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                        <div className={`flex items-center gap-1 font-medium transition ${hasMinLength ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
                          {hasMinLength ? <CheckCircle2 size={12} className="shrink-0 text-emerald-600" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-300 ml-1 mr-0.5" />}
                          <span>8+ Chars</span>
                        </div>
                        <div className={`flex items-center gap-1 font-medium transition ${hasLetter ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
                          {hasLetter ? <CheckCircle2 size={12} className="shrink-0 text-emerald-600" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-300 ml-1 mr-0.5" />}
                          <span>1 Letter</span>
                        </div>
                        <div className={`flex items-center gap-1 font-medium transition ${hasNumber ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
                          {hasNumber ? <CheckCircle2 size={12} className="shrink-0 text-emerald-600" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-300 ml-1 mr-0.5" />}
                          <span>1 Number</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="flex justify-end pt-0.5">
                    <button
                      type="button"
                      onClick={() => toast("Password reset link will be sent to your email.", { icon: "📧" })}
                      className="text-xs font-semibold text-[#1E40AF] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Primary Login Button (Exact Image 2) */}
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E40AF] py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 hover:bg-[#1a3899] transition active:scale-98"
                  >
                    <span>Login</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#1E40AF] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#1E40AF] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#1E40AF] focus:outline-hidden"
                    />

                    {/* Real-Time Password Validation Guidance */}
                    <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-slate-500 font-medium">
                        <span>Must be at least 8 characters with 1 letter & 1 number:</span>
                        {password && (
                          <span className={isPasswordValid ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                            {isPasswordValid ? "✓ Strong Password" : "Incomplete"}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                        <div className={`flex items-center gap-1 font-medium transition ${hasMinLength ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
                          {hasMinLength ? <CheckCircle2 size={12} className="shrink-0 text-emerald-600" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-300 ml-1 mr-0.5" />}
                          <span>8+ Chars</span>
                        </div>
                        <div className={`flex items-center gap-1 font-medium transition ${hasLetter ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
                          {hasLetter ? <CheckCircle2 size={12} className="shrink-0 text-emerald-600" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-300 ml-1 mr-0.5" />}
                          <span>1 Letter</span>
                        </div>
                        <div className={`flex items-center gap-1 font-medium transition ${hasNumber ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
                          {hasNumber ? <CheckCircle2 size={12} className="shrink-0 text-emerald-600" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-300 ml-1 mr-0.5" />}
                          <span>1 Number</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E40AF] py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#1a3899] transition"
                  >
                    <span>Sign Up</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}

              {/* Social Login Divider (Exact Image 2) */}
              <div className="relative flex items-center justify-center my-4">
                <div className="w-full border-t border-slate-200" />
                <span className="absolute bg-white px-3 text-xs text-slate-400 font-medium">
                  or continue with
                </span>
              </div>

              {/* Social Buttons Row (Google, Facebook, Apple) */}
              <div className="grid grid-cols-3 gap-3">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => handleSocialComingSoon("Google")}
                  className="relative flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs font-bold text-slate-700 opacity-80 hover:opacity-100 hover:bg-slate-50 transition shadow-2xs group"
                >
                  <span className="absolute -top-1.5 -right-1 text-[8px] font-extrabold uppercase bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded-full border border-slate-200 shadow-2xs group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition">
                    Soon
                  </span>
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.14C3.26 21.3 7.35 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.59H1.29C.47 8.23 0 10.06 0 12s.47 3.77 1.29 5.41l3.99-3.14z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.7 1.29 6.59l3.99 3.14c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Google</span>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={() => handleSocialComingSoon("Facebook")}
                  className="relative flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs font-bold text-slate-700 opacity-80 hover:opacity-100 hover:bg-slate-50 transition shadow-2xs group"
                >
                  <span className="absolute -top-1.5 -right-1 text-[8px] font-extrabold uppercase bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded-full border border-slate-200 shadow-2xs group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition">
                    Soon
                  </span>
                  <svg className="h-4 w-4 fill-[#1877F2]" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </button>

                {/* Apple */}
                <button
                  type="button"
                  onClick={() => handleSocialComingSoon("Apple")}
                  className="relative flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-xs font-bold text-slate-700 opacity-80 hover:opacity-100 hover:bg-slate-50 transition shadow-2xs group"
                >
                  <span className="absolute -top-1.5 -right-1 text-[8px] font-extrabold uppercase bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded-full border border-slate-200 shadow-2xs group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200 transition">
                    Soon
                  </span>
                  <svg className="h-4 w-4 fill-slate-900" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.12-1.96.99-3.1-.97.04-2.14.65-2.83 1.46-.62.72-1.16 1.88-1.01 3 .01 0 .04.01.07.01 1.09 0 2.19-.55 2.78-1.37z"/>
                  </svg>
                  <span>Apple</span>
                </button>
              </div>

              {/* Bottom Toggle Link */}
              <div className="text-center text-xs text-slate-600 pt-2">
                {mode === "login" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="font-bold text-[#1E40AF] hover:underline"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className="font-bold text-[#1E40AF] hover:underline"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>

          {/* Footer Security Badges (Exact Match with Image 2) */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold text-slate-500">
            <div className="flex items-center justify-center gap-1.5">
              <Shield size={14} className="text-[#1E40AF]" />
              <span>100% Secure Payments</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <RefreshCw size={14} className="text-[#1E40AF]" />
              <span>Easy Returns & Refunds</span>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <Headphones size={14} className="text-[#1E40AF]" />
              <span>24/7 Customer Support</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
