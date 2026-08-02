"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans antialiased text-slate-800">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
