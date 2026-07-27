"use client";

import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Heart, User, ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "PRODUCTS", href: "/products" },
    { name: "ABOUT", href: "/about" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Top Announcement Bar */}
      <div className="bg-[#0A2E4E] px-4 py-2 text-center text-[11px] font-medium uppercase tracking-widest text-[#FAF7F2]">
        <span>
          FREE DELIVERY ON ORDERS ABOVE ₹499 &nbsp;|&nbsp; PREMIUM CLEANING PRODUCTS FOR EVERY HOME &nbsp;|&nbsp;{" "}
          <Link href="/products" className="underline underline-offset-2 hover:text-[#E5D3C4]">
            SHOP NOW
          </Link>
        </span>
      </div>

      {/* Main Navbar Header */}
      <nav
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-[#FAF7F2]/95 backdrop-blur-md shadow-xs border-b border-[#EFEAE4]"
            : "bg-[#FAF7F2] border-b border-[#EFEAE4]"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          
          {/* Left Navigation Links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-semibold tracking-wider transition-colors ${
                    isActive
                      ? "text-[#0A2E4E] border-b-2 border-[#0A2E4E] pb-0.5"
                      : "text-slate-600 hover:text-[#0A2E4E]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Centered Brand Logo */}
          <Link href="/" className="flex flex-col items-center group">
            <div className="flex items-center gap-0.5 font-serif text-3xl font-normal tracking-[0.15em] text-[#0A2E4E] leading-none">
              MATRIN<span className="text-sm font-sans font-light -mt-2 text-[#0A2E4E]">+</span>
            </div>
            <span className="mt-1 text-[9px] font-medium tracking-[0.25em] text-slate-500 uppercase">
              Clean Home. Better Living.
            </span>
          </Link>

          {/* Right Actions: SEARCH, Wishlist, Account, Cart */}
          <div className="hidden items-center gap-6 md:flex">
            
            {/* Search Button */}
            <Link
              href="/products"
              className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-700 hover:text-[#0A2E4E]"
            >
              <span>SEARCH</span>
              <Search size={16} />
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/products"
              className="relative text-slate-700 hover:text-[#0A2E4E] transition-colors"
              title="Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#0A2E4E] text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Icon */}
            <button
              className="text-slate-700 hover:text-[#0A2E4E] transition-colors"
              title="Account"
            >
              <User size={20} />
            </button>

            {/* Cart Bag Icon with Counter */}
            <Link
              href="/cart"
              className="relative flex items-center text-slate-700 hover:text-[#0A2E4E] transition-colors"
              title="Cart"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#0A2E4E] text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex items-center gap-4 md:hidden">
            <Link href="/cart" className="relative text-slate-700">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0A2E4E] text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-800 p-1"
              aria-label="Toggle Navigation"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-[#EFEAE4] bg-[#FAF7F2] px-6 py-6 md:hidden"
            >
              <div className="flex flex-col gap-4 text-center">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`py-2 text-sm font-semibold tracking-wider ${
                      pathname === link.href
                        ? "text-[#0A2E4E] font-bold"
                        : "text-slate-600"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="pt-4 border-t border-[#EFEAE4] flex justify-center gap-6 text-slate-700">
                  <Link href="/products" onClick={() => setIsOpen(false)} className="flex items-center gap-1.5 text-xs font-semibold">
                    <Search size={16} /> SEARCH
                  </Link>
                  <Link href="/products" onClick={() => setIsOpen(false)} className="flex items-center gap-1.5 text-xs font-semibold">
                    <Heart size={16} /> WISHLIST ({wishlistCount})
                  </Link>
                  <Link href="/cart" onClick={() => setIsOpen(false)} className="flex items-center gap-1.5 text-xs font-semibold">
                    <ShoppingBag size={16} /> CART ({cartCount})
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}