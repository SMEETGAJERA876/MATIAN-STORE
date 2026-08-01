"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <footer className="bg-[#0A192F] text-white pt-14 pb-8 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Top Newsletter Callout Bar (Matching Reference Image 2) */}
        <div className="rounded-3xl bg-[#1E40AF] p-6 sm:p-8 mb-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
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
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#0B2545] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-900 transition shrink-0"
            >
              <span>Subscribe</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 mb-12 text-xs">
          
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <img
                src="/images/matrin-logo-clean.webp"
                alt="MATRIN"
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Pure cleaning solutions for a better living. Safe for your family, tough on stains and kind to nature.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {["facebook", "instagram", "youtube", "twitter"].map((soc) => (
                <a
                  key={soc}
                  href="#"
                  className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:bg-[#1E40AF] hover:text-white transition"
                  title={soc}
                >
                  <span className="text-[10px] font-bold uppercase">{soc.charAt(0)}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="text-[#ffffff] text-sm sm:text-base font-extrabold uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b border-white/20">
              <span className="h-2 w-2 rounded-full bg-[#22D3EE] shrink-0"></span>
              <span style={{ color: "#ffffff" }}>Quick Links</span>
            </h4>
            <ul className="space-y-2 text-slate-300 font-medium">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link href="/products" className="hover:text-white transition">Products</Link></li>
              <li><Link href="/categories" className="hover:text-white transition">Categories</Link></li>
              <li><Link href="/products?sale=true" className="hover:text-white transition">Offers</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Categories Column */}
          <div className="space-y-4">
            <h4 className="text-[#ffffff] text-sm sm:text-base font-extrabold uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b border-white/20">
              <span className="h-2 w-2 rounded-full bg-[#22D3EE] shrink-0"></span>
              <span style={{ color: "#ffffff" }}>Categories</span>
            </h4>
            <ul className="space-y-2 text-slate-300 font-medium">
              <li><Link href="/products?category=Laundry Care" className="hover:text-white transition">Detergent</Link></li>
              <li><Link href="/products?category=Dish Care" className="hover:text-white transition">Dishwash</Link></li>
              <li><Link href="/products?category=Floor Care" className="hover:text-white transition">Floor Cleaner</Link></li>
              <li><Link href="/products?category=Toilet Care" className="hover:text-white transition">Toilet Cleaner</Link></li>
              <li><Link href="/products?category=Multi-Surface" className="hover:text-white transition">Glass Cleaner</Link></li>
              <li><Link href="/products?category=Dish Care" className="hover:text-white transition">Kitchen Cleaner</Link></li>
            </ul>
          </div>

          {/* Customer Support Column */}
          <div className="space-y-4">
            <h4 className="text-[#ffffff] text-sm sm:text-base font-extrabold uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b border-white/20">
              <span className="h-2 w-2 rounded-full bg-[#22D3EE] shrink-0"></span>
              <span style={{ color: "#ffffff" }}>Customer Support</span>
            </h4>
            <ul className="space-y-2 text-slate-300 font-medium">
              <li><Link href="/contact" className="hover:text-white transition">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Shipping & Delivery</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Returns & Refunds</Link></li>
              <li><Link href="/#faq-section" className="hover:text-white transition">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Track Order</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Store Locator</Link></li>
            </ul>
          </div>

          {/* Contact Us Column */}
          <div className="space-y-4">
            <h4 className="text-[#ffffff] text-sm sm:text-base font-extrabold uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b border-white/20">
              <span className="h-2 w-2 rounded-full bg-[#22D3EE] shrink-0"></span>
              <span style={{ color: "#ffffff" }}>Contact Us</span>
            </h4>
            <div className="space-y-2 text-slate-300 font-medium leading-relaxed">
              <div className="font-bold text-white text-sm">+91 98765 43210</div>
              <div>support@matrin.com</div>
              <div>Matrin House, Clean City, Mumbai, Maharashtra - 400001</div>
              <div className="text-[11px] text-slate-400">Mon - Sat: 9:00 AM - 6:00 PM</div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Terms Bar (Exact Match with Reference Images 2 & 3) */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 font-medium gap-3">
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