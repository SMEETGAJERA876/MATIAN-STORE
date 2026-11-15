"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

function GoogleMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.27 5.48-4.77 7.18l7.73 6C44.4 37.99 46.98 31.85 46.98 24.55Z" />
      <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.8l-7.73-6c-2.14 1.45-4.88 2.3-8.17 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
    </svg>
  );
}

export default function LoginScreen() {
  const {
    login,
    loginWithGoogle,
    googleLinkPending,
    completeGoogleLink,
    cancelGoogleLink,
    register,
    resetPassword,
  } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordIsValid =
    password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      if (googleLinkPending) {
        await completeGoogleLink(email, password);
      } else {
        await login(email.trim(), password, "AUTO");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Enter your name to create an account.");
      return;
    }
    if (!passwordIsValid) {
      toast.error("Use at least 8 characters, including a letter and a number.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      toast.error("Enter your email address first.");
      return;
    }
    await resetPassword(email);
  };

  const inputClass =
    "w-full rounded-lg border border-[#d9ddd9] bg-white px-3.5 py-3 text-sm text-[#202820] outline-none transition placeholder:text-[#929991] focus:border-[#315b3d] focus:ring-2 focus:ring-[#315b3d]/10";

  return (
    <div className="min-h-screen bg-[#f4f3ee] px-4 py-5 sm:px-6 sm:py-8">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link href="/" aria-label="MATRIN home" className="inline-flex items-center">
          <Image
            src="/images/matrin-logo-sticker.png"
            alt="MATRIN"
            width={180}
            height={48}
            className="h-9 w-auto object-contain"
          />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#526056] transition hover:text-[#203d29]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to shop</span>
        </Link>
      </header>

      <main className="mx-auto flex w-full max-w-6xl items-center justify-center py-6 sm:py-10">
        <div className="grid w-full overflow-hidden rounded-2xl border border-[#e4e3dc] bg-white shadow-[0_12px_42px_rgba(31,43,33,0.07)] lg:min-h-[650px] lg:grid-cols-[0.92fr_1.08fr]">
          <section className="relative hidden flex-col justify-between bg-[#203d29] p-10 text-white lg:flex xl:p-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">
                MATRIN · HOME CARE
              </p>
              <h1 className="mt-8 max-w-sm text-4xl font-semibold leading-[1.14] tracking-tight">
                A cleaner home,
                <br />
                one simple step at a time.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
                Sign in to pick up where you left off and keep your everyday essentials close.
              </p>
            </div>

            <div className="my-8 flex min-h-64 items-center justify-center overflow-hidden rounded-xl bg-[#d2e8ef] p-3">
              <Image
                src="/images/login-welcome.png"
                alt="Illustration of a customer holding a MATRIN balloon"
                width={768}
                height={768}
                className="h-auto w-full max-w-[22rem] object-contain"
              />
            </div>

            <p className="text-xs text-white/60">
              Thoughtful essentials for the everyday.
            </p>
          </section>

          <section className="flex items-center px-6 py-8 sm:px-10 sm:py-12 lg:px-14">
            <div className="mx-auto w-full max-w-md">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#647168]">
                Your MATRIN account
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#202820]">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#687169]">
                {mode === "login"
                  ? "Sign in to view your orders and saved items."
                  : "A few details and you’re ready to shop."}
              </p>

              <div className="mt-7 flex border-b border-[#e7e8e2]">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`-mb-px px-1 pb-3.5 pr-5 text-sm font-semibold transition ${
                    mode === "login"
                      ? "border-b-2 border-[#315b3d] text-[#203d29]"
                      : "text-[#7b827b] hover:text-[#344a39]"
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => setMode("register")}
                  className={`-mb-px px-1 pb-3.5 text-sm font-semibold transition ${
                    mode === "register"
                      ? "border-b-2 border-[#315b3d] text-[#203d29]"
                      : "text-[#7b827b] hover:text-[#344a39]"
                  }`}
                >
                  Create account
                </button>
              </div>

              {mode === "login" && (
                <>
                  {!googleLinkPending ? (
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isSubmitting}
                      className="mt-6 flex w-full items-center justify-center gap-3 rounded-lg border border-[#d9ddd9] bg-white px-4 py-3 text-sm font-semibold text-[#303730] transition hover:bg-[#f8f9f7] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#315b3d] border-t-transparent" />
                      ) : (
                        <GoogleMark />
                      )}
                      Continue with Google
                    </button>
                  ) : (
                    <div className="mt-6 rounded-lg border border-[#d9ddd9] bg-[#f7f8f5] p-4 text-sm leading-6 text-[#526056]">
                      This Google address already has an email-and-password account. Enter those credentials below once to link Google for future sign-ins.
                      <button
                        type="button"
                        onClick={cancelGoogleLink}
                        className="mt-2 block text-xs font-semibold text-[#315b3d] hover:underline"
                      >
                        Cancel Google linking
                      </button>
                    </div>
                  )}

                  <div className="my-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#e7e8e2]" />
                    <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#929991]">
                      or use email
                    </span>
                    <div className="h-px flex-1 bg-[#e7e8e2]" />
                  </div>
                </>
              )}

              {mode === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-[#374239]">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail size={17} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#899189]" />
                      <input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <label htmlFor="login-password" className="text-sm font-medium text-[#374239]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={handlePasswordReset}
                        className="text-xs font-semibold text-[#315b3d] hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <LockKeyhole size={17} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#899189]" />
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter your password"
                        className={`${inputClass} pl-10 pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#899189] hover:text-[#374239]"
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 w-full rounded-lg bg-[#315b3d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#264a31] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting
                      ? googleLinkPending
                        ? "Linking Google…"
                        : "Signing in…"
                      : googleLinkPending
                        ? "Link Google and sign in"
                        : "Sign in"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label htmlFor="register-name" className="mb-1.5 block text-sm font-medium text-[#374239]">
                      Full name
                    </label>
                    <div className="relative">
                      <UserRound size={17} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#899189]" />
                      <input
                        id="register-name"
                        type="text"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Your name"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="register-email" className="mb-1.5 block text-sm font-medium text-[#374239]">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail size={17} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#899189]" />
                      <input
                        id="register-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="register-password" className="mb-1.5 block text-sm font-medium text-[#374239]">
                      Password
                    </label>
                    <div className="relative">
                      <LockKeyhole size={17} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#899189]" />
                      <input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="At least 8 characters"
                        className={`${inputClass} pl-10 pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#899189] hover:text-[#374239]"
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                    <p className="mt-1.5 text-xs text-[#7b827b]">
                      Use at least 8 characters, including a letter and a number.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 w-full rounded-lg bg-[#315b3d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#264a31] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Creating account…" : "Create account"}
                  </button>
                </form>
              )}

              <p className="mt-6 text-center text-xs leading-5 text-[#7b827b]">
                Need a hand?{" "}
                <Link href="/contact" className="font-semibold text-[#315b3d] hover:underline">
                  Contact us
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
