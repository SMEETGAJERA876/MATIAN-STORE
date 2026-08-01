import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useProductStore } from "@/context/ProductStoreContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Heart, User, ShoppingBag, Menu, X, Shield, Sparkles, ArrowRight, Truck, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductImage from "./ProductImage";
import WishlistModal from "./WishlistModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { cartCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin } = useAuth();
  const { products } = useProductStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products", hasDropdown: true },
    { name: "Categories", href: "/categories" },
    { name: "Offers", href: "/products?sale=true" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileSearchOpen(false);
    }
  };

  const searchResults = searchQuery.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-50">
      {/* Top Announcement Bar */}
      <div className="bg-[#1E40AF] px-4 sm:px-6 py-2.5 text-white text-xs font-semibold border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 font-bold">
              <Truck size={16} className="text-cyan-300 shrink-0" />
              <span>Free Delivery on orders above ₹499</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-blue-100 font-medium">
              <Shield size={15} className="text-cyan-300 shrink-0" />
              <span>100% Secure Payments</span>
            </div>
            <div className="hidden xl:flex items-center gap-1.5 text-blue-100 font-medium">
              <Sparkles size={15} className="text-cyan-300 shrink-0" />
              <span>Eco-Friendly Products</span>
            </div>
          </div>

          <div className="flex items-center gap-5 text-xs sm:text-sm text-blue-100 font-medium">
            <Link href="/contact" className="hover:text-white transition hidden sm:inline">Track Order</Link>
            <span className="hidden sm:inline text-white/30">|</span>
            <Link href="/contact" className="hover:text-white transition hidden sm:inline">Support</Link>
            <span className="hidden sm:inline text-white/30">|</span>
            <Link href="/contact" className="hover:text-white transition flex items-center gap-1">
              <span>Store Locator</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar Header */}
      <nav
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/80"
            : "bg-white border-b border-slate-100"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 h-14 sm:h-16 lg:h-[64px]">
          
          {/* Brand Logo (Responsive: 28px Mobile, 32px Tablet/Desktop) */}
          <Link href="/" className="flex items-center gap-2 group shrink-0 py-1">
            <img
              src="/images/matrin-logo-clean.webp"
              alt="MATRIN"
              className="h-7 sm:h-8 lg:h-8 max-h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-103"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-semibold tracking-wide transition-colors flex items-center gap-1 py-1 relative ${
                    isActive
                      ? "text-[#1E40AF]"
                      : "text-slate-700 hover:text-[#1E40AF]"
                  }`}
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && <ChevronDown size={14} className="text-slate-400" />}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E40AF] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Bar (Tablet & Desktop) */}
          <div className="hidden items-center gap-4 md:flex">
            
            {/* Inline Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-44 lg:w-56 max-w-xs rounded-full border border-slate-200 bg-slate-50 h-9 py-1.5 pl-8.5 pr-3 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#1E40AF] focus:outline-hidden transition-all shadow-2xs"
              />
              <Search size={15} className="absolute left-3 text-slate-400 pointer-events-none" />

              {/* Autocomplete Dropdown */}
              {searchQuery.trim() && (
                <div className="absolute top-11 right-0 w-80 rounded-2xl bg-white p-3 shadow-2xl border border-slate-100 z-50 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">
                    Matches ({searchResults.length})
                  </div>
                  {searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <Link
                        key={item.id}
                        href={`/products/${item.id}`}
                        onClick={() => setSearchQuery("")}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition"
                      >
                        <div className="h-10 w-10 shrink-0">
                          <ProductImage src={item.image} alt={item.name} fitMode="cover" roundedClassName="rounded-md" />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-xs font-extrabold text-slate-900 truncate">{item.name}</div>
                          <div className="text-[11px] text-slate-500 font-semibold">{item.category} • ₹{item.price}</div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-400 font-medium">
                      No products found matching &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>
              )}
            </form>

            {/* Account Link */}
            <Link
              href="/login"
              className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-700 hover:text-[#1E40AF] transition-colors p-1.5 rounded-xl hover:bg-slate-50"
              title={user ? `Logged in as ${user.name}` : "Sign In / Account"}
            >
              {user ? (
                <div className="flex items-center gap-1.5 rounded-full bg-blue-50 py-1 px-3 border border-blue-200">
                  <span className="h-5 w-5 rounded-full bg-[#1E40AF] text-white text-[10px] font-bold flex items-center justify-center">
                    {user.name.charAt(0)}
                  </span>
                  <span className="text-xs font-bold text-[#1E40AF] max-w-[90px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-[#1E40AF] transition">
                  <User size={20} />
                  <span className="hidden sm:inline">Sign In</span>
                </div>
              )}
            </Link>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="min-h-[40px] min-w-[40px] relative flex items-center justify-center text-slate-700 hover:text-[#1E40AF] transition-colors p-1.5 rounded-xl hover:bg-slate-50"
              title="Wishlist"
            >
              <Heart size={20} className={wishlistCount > 0 ? "text-rose-500 fill-rose-500" : ""} />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1E40AF] text-[9px] font-extrabold text-white shadow-2xs">
                {wishlistCount}
              </span>
            </button>

            {/* Cart Button */}
            <button
              onClick={openCartDrawer}
              className="min-h-[40px] min-w-[40px] relative flex items-center justify-center text-slate-700 hover:text-[#1E40AF] transition-colors p-1.5 rounded-xl hover:bg-slate-50"
              title="Cart"
            >
              <ShoppingBag size={20} />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1E40AF] text-[9px] font-extrabold text-white shadow-2xs">
                {cartCount}
              </span>
            </button>

          </div>

          {/* Mobile Action Bar (<640px) with Guaranteed 44x44px Minimum Touch Targets */}
          <div className="flex items-center gap-1 md:hidden">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-700 hover:text-[#1E40AF] p-2 rounded-xl transition active:scale-95"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Mobile Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="min-h-[44px] min-w-[44px] relative flex items-center justify-center text-slate-700 hover:text-[#1E40AF] p-2 rounded-xl transition active:scale-95"
              title="Wishlist"
            >
              <Heart size={20} className={wishlistCount > 0 ? "text-rose-500 fill-rose-500" : ""} />
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1E40AF] text-[9px] font-extrabold text-white shadow-2xs">
                {wishlistCount}
              </span>
            </button>

            {/* Mobile Cart Button */}
            <button
              onClick={openCartDrawer}
              className="min-h-[44px] min-w-[44px] relative flex items-center justify-center text-slate-700 hover:text-[#1E40AF] p-2 rounded-xl transition active:scale-95"
              title="Cart"
            >
              <ShoppingBag size={20} />
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1E40AF] text-[9px] font-extrabold text-white shadow-2xs">
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger Menu Button (Guaranteed 44x44px Tap Area) */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-800 p-2 rounded-xl hover:bg-slate-100 transition active:scale-95"
              aria-label="Toggle Navigation"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>

        {/* Expandable Mobile Search Bar */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-slate-100 bg-slate-50/90 px-4 py-3 md:hidden"
            >
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#1E40AF] focus:outline-hidden shadow-2xs"
                />
                <Search size={16} className="absolute left-3 text-slate-400 pointer-events-none" />
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Navigation Drawer with 44px Minimum Tap Height Items */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-slate-100 bg-white px-4 py-4 md:hidden shadow-xl"
            >
              <div className="flex flex-col gap-1.5">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`min-h-[44px] py-3 px-4 rounded-xl text-base font-bold flex items-center justify-between transition ${
                        isActive
                          ? "bg-blue-50 text-[#1E40AF]"
                          : "text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      <span>{link.name}</span>
                      <ArrowRight size={16} className={isActive ? "text-[#1E40AF]" : "text-slate-400"} />
                    </Link>
                  );
                })}

                <div className="pt-3 border-t border-slate-100 mt-2 flex items-center gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="min-h-[44px] flex-1 py-3 px-4 rounded-xl bg-[#1E40AF] text-white font-bold text-center text-sm shadow-md"
                  >
                    {user ? `Account (${user.name.split(" ")[0]})` : "Sign In"}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Wishlist Modal Drawer */}
      <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </header>
  );
}