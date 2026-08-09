"use client";

import Link from "next/link";
import { ArrowRight, Phone, Mail, MapPin, Clock } from "lucide-react";
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
    <footer className="bg-[#102A5C] text-white pt-14 pb-8 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Top Newsletter Callout Bar (Exact Match with Reference Image 2) */}
        <div className="rounded-3xl bg-[#0645B5] p-6 sm:p-8 mb-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Join the Matrin Family
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 font-medium">
              Subscribe to get special offers, cleaning tips and exclusive discounts.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full md:w-auto max-w-md">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:w-72 rounded-full bg-white px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden shadow-2xs font-medium"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#102A5C] hover:bg-[#091b3e] px-6 py-3 text-xs font-bold text-white shadow-md transition shrink-0"
            >
              <span>Subscribe</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>

        {/* Footer Navigation Columns (Exact Match with Reference Image 2) */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 mb-12 text-xs">

          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/images/matrin-logo-sticker.png"
                alt="MATRIN"
                className="h-10 sm:h-12 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-xs text-blue-100 font-medium leading-relaxed">
              Pure cleaning solutions for a better living. Safe for your family, tough on stains and kind to nature.
            </p>

            {/* Follow Us Social Icons (Moved under MATRIN logo) */}
            <div className="pt-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-white mb-2">FOLLOW US</div>
              <div className="flex items-center gap-2">
                {/* 1. Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="h-10 w-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-[#0645B5] hover:scale-105 transition-all border border-white/20 shadow-sm"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>

                {/* 2. Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="h-10 w-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-[#0645B5] hover:scale-105 transition-all border border-white/20 shadow-sm"
                >
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </a>

                {/* 3. YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="h-10 w-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-[#0645B5] hover:scale-105 transition-all border border-white/20 shadow-sm"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* 4. Twitter (X) */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="h-10 w-10 rounded-xl bg-white/10 text-white flex items-center justify-center hover:bg-[#0645B5] hover:scale-105 transition-all border border-white/20 shadow-sm"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white pb-2 border-b border-white/20">
              Quick Links
            </h4>
            <ul className="space-y-2 text-blue-100 font-medium">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/products" className="hover:text-white transition">Products</Link></li>
              <li><Link href="/categories" className="hover:text-white transition">Categories</Link></li>
              <li><Link href="/offers" className="hover:text-white transition">Offers</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Categories Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white pb-2 border-b border-white/20">
              Categories
            </h4>
            <ul className="space-y-2 text-blue-100 font-medium">
              <li><Link href="/products/1" className="hover:text-white transition">Detergent</Link></li>
              <li><Link href="/products/2" className="hover:text-white transition">Dishwash</Link></li>
              <li><Link href="/products/3" className="hover:text-white transition">Floor Cleaner</Link></li>
              <li><Link href="/products/4" className="hover:text-white transition">Toilet Cleaner</Link></li>
              <li><Link href="/products/6" className="hover:text-white transition">Glass Cleaner</Link></li>
              <li><Link href="/products/5" className="hover:text-white transition">Bathroom Cleaner</Link></li>
            </ul>
          </div>

          {/* Customer Support Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white pb-2 border-b border-white/20">
              Customer Support
            </h4>
            <ul className="space-y-2 text-blue-100 font-medium">
              <li><Link href="/contact" className="hover:text-white transition">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Shipping & Delivery</Link></li>
              <li><Link href="/#faq-section" className="hover:text-white transition">FAQ</Link></li>
              <li><Link href="/contact#map" className="hover:text-white transition">Store Locator</Link></li>
            </ul>
          </div>

          {/* Contact Us Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-white pb-2 border-b border-white/20">
              Contact Us
            </h4>
            <div className="space-y-2 text-blue-100 font-medium leading-relaxed">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <Phone size={14} className="text-cyan-300" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-cyan-300" />
                <span>support@matrin.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-cyan-300 shrink-0 mt-0.5" />
                <span>Matrin House, Clean City, Mumbai, Maharashtra - 400001</span>
              </div>
              <div className="text-[11px] text-blue-200 flex items-center gap-2">
                <Clock size={13} className="text-cyan-300" />
                <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Terms Bar (Exact Match with Reference Image 2) */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-blue-200 font-medium gap-3">
          <div>© 2025 Matrin. All Rights Reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-white transition">Privacy Policy</Link>
            <span>|</span>
            <Link href="/contact" className="hover:text-white transition">Terms & Conditions</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}