"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import toast from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      toast.success("Thank you for subscribing to Matrin!", { icon: "✨" });
      setEmail("");
    } else {
      toast.error("Please enter a valid email address.");
    }
  };

  return (
    <footer className="bg-[#F0F6FD] text-[#0A1C3E] pt-12 pb-8 border-t border-blue-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Footer Navigation Grid matching reference image */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-10 text-xs">

          {/* Brand Column */}
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <img
                src="/images/matrin-logo-sticker.png"
                alt="MATRIN"
                className="h-9 sm:h-11 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-xs">
              Matrin is committed to making your home cleaner, fresher and healthier with trusted cleaning solutions.
            </p>

            {/* Social Icons matching reference image */}
            <div className="flex items-center gap-2 pt-2 text-[#0038A8]">
              <a href="#" className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center font-bold text-xs hover:bg-[#0038A8] hover:text-white transition">f</a>
              <a href="#" className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center font-bold text-xs hover:bg-[#0038A8] hover:text-white transition">i</a>
              <a href="#" className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center font-bold text-xs hover:bg-[#0038A8] hover:text-white transition">y</a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-[#0A1C3E] uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-slate-600 font-medium">
              <li><Link href="/" className="hover:text-[#0038A8] transition">Home</Link></li>
              <li><Link href="/products" className="hover:text-[#0038A8] transition">Shop</Link></li>
              <li><Link href="/categories" className="hover:text-[#0038A8] transition">Categories</Link></li>
              <li><Link href="/products?sale=true" className="hover:text-[#0038A8] transition">Offers</Link></li>
              <li><Link href="/about" className="hover:text-[#0038A8] transition">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#0038A8] transition">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service Column */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-[#0A1C3E] uppercase tracking-wider">
              Customer Service
            </h4>
            <ul className="space-y-1.5 text-slate-600 font-medium">
              <li><Link href="/login" className="hover:text-[#0038A8] transition">My Account</Link></li>
              <li><Link href="/contact" className="hover:text-[#0038A8] transition">Track Order</Link></li>
              <li><Link href="/contact" className="hover:text-[#0038A8] transition">Shipping Policy</Link></li>
              <li><Link href="/contact" className="hover:text-[#0038A8] transition">Return Policy</Link></li>
              <li><Link href="/#faq-section" className="hover:text-[#0038A8] transition">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-[#0038A8] transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter Column matching reference image */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-[#0A1C3E] uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Subscribe to get special offers and updates.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-white border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0038A8] focus:outline-hidden shadow-2xs font-medium"
              />
              <button
                type="submit"
                className="w-full rounded-lg bg-[#0038A8] hover:bg-[#002D88] py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-sm transition"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright & Payment Methods Bar matching reference image */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-medium gap-3">
          <div>© 2024 Matrin. All Rights Reserved.</div>
          <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
            <span>Payment Methods:</span>
            <span className="text-[#0038A8] font-black">VISA</span>
            <span className="text-red-500 font-black">Mastercard</span>
            <span className="text-emerald-600 font-black">UPI</span>
          </div>
        </div>

      </div>
    </footer>
  );
}