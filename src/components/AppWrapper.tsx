"use client";

import { useAuth } from "@/context/AuthContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawerModal from "./CartDrawerModal";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A192F] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent" />
          <span className="text-xs font-extrabold tracking-widest uppercase text-cyan-300">
            Loading MATRIN Store...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <CartDrawerModal />
    </>
  );
}
