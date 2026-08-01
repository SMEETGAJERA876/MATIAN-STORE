"use client";

import { useAuth } from "@/context/AuthContext";
import LoginScreen from "./LoginScreen";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AuthModal from "./AuthModal";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0A2E4E] border-t-transparent" />
          <span className="text-xs font-semibold text-[#0A2E4E] tracking-widest uppercase">Loading Matrin Store...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <AuthModal />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
