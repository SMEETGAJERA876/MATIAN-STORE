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
      toast.success("Thank you for subscribing!", { icon: "✨" });
      setEmail("");
    } else {
      toast.error("Please enter a valid email address.");
    }
  };

  return (
    <footer className="bg-[#0A2E4E] text-[#FAF7F2] pt-16 pb-8 border-t border-[#13426B]">
      <div className="mx-auto max-w-7xl px-6">
        
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 mb-16">
          
          {/* Brand Info (Col 1-3) */}
          <div className="lg:col-span-3">
            <Link href="/" className="inline-block">
              <div className="font-serif text-3xl font-normal tracking-[0.15em] text-[#FAF7F2] leading-none">
                MATRIN<span className="text-sm font-sans font-light -mt-2 text-[#FAF7F2]">+</span>
              </div>
            </Link>
            <p className="mt-4 text-xs text-slate-300 leading-relaxed max-w-xs font-light">
              Premium cleaning solutions for modern Indian homes.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex items-center gap-4 text-slate-300">
              {/* Instagram SVG */}
              <a href="#" className="hover:text-white transition-colors" title="Instagram" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* Facebook SVG */}
              <a href="#" className="hover:text-white transition-colors" title="Facebook" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.714 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>

              {/* YouTube SVG */}
              <a href="#" className="hover:text-white transition-colors" title="YouTube" aria-label="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>

              {/* WhatsApp SVG */}
              <a href="#" className="hover:text-white transition-colors" title="WhatsApp" aria-label="WhatsApp">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* SHOP Column (Col 4-5) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FAF7F2] mb-4">
              SHOP
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-light">
              <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Liquid Detergent</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Dish Wash</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Floor Cleaner</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Toilet Cleaner</Link></li>
            </ul>
          </div>

          {/* COMPANY Column (Col 6-7) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FAF7F2] mb-4">
              COMPANY
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-light">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Our Ingredients</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Sustainability</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* SUPPORT Column (Col 8-9) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FAF7F2] mb-4">
              SUPPORT
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300 font-light">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/#faq-section" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* STAY UPDATED Newsletter Form (Col 10-12) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#FAF7F2] mb-4">
              STAY UPDATED
            </h4>
            <p className="text-xs text-slate-300 font-light leading-relaxed mb-4">
              Subscribe to our newsletter for offers and updates.
            </p>

            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full bg-white text-slate-900 px-4 py-3 pr-10 text-xs placeholder:text-slate-400 focus:outline-hidden"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#0A2E4E] text-white hover:bg-[#13426B] transition-colors"
                title="Subscribe"
              >
                <ArrowRight size={14} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-[#13426B] text-center text-[11px] text-slate-400 font-light">
          © 2026 Matrin. All rights reserved.
        </div>

      </div>
    </footer>
  );
}