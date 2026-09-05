import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useProductStore } from "@/context/ProductStoreContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Heart, User, ShoppingBag, Menu, X, Shield, Sparkles, ArrowRight, Truck, ChevronDown, LayoutDashboard, LogOut, UserCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductImage from "./ProductImage";
import WishlistModal from "./WishlistModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const accountRef = useRef<HTMLDivElement>(null);

  const { cartCount, openCartDrawer } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products", hasDropdown: true },
    { name: "Categories", href: "/categories", hasDropdown: true },
    { name: "Offers", href: "/offers" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const categoryItems = [
    { name: "Laundry Care", desc: "Detergent Liquid & Softener", href: "/products?category=Laundry Care" },
    { name: "Dish Care", desc: "Dishwash Gel & Paste", href: "/products?category=Dish Care" },
    { name: "Floor Care", desc: "Disinfectant Cleaner", href: "/products?category=Floor Care" },
    { name: "Toilet Care", desc: "Power Cleaner Gel", href: "/products?category=Toilet %26 Bath" },
    { name: "Multi-Surface", desc: "Glass & Surface Cleaner", href: "/products?category=Multi-Surface" },
  ];

  const featuredProducts = products.slice(0, 4);

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
      {/* Top Announcement Bar (Exact Match with Reference Image) */}
      <div className="bg-[#0645B5] px-4 sm:px-6 py-2 text-white text-[11px] font-semibold border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-5 text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5 font-bold">
              <Truck size={14} className="text-cyan-200 shrink-0" />
              <span>Free Delivery on orders above ₹499</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5 text-blue-100 font-medium">
              <Shield size={14} className="text-cyan-200 shrink-0" />
              <span>100% Secure Payments</span>
            </div>
            <div className="hidden xl:flex items-center gap-1.5 text-blue-100 font-medium">
              <Sparkles size={14} className="text-cyan-200 shrink-0" />
              <span>Eco-Friendly Products</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] sm:text-xs text-blue-100 font-medium">
            <Link href="/contact" className="hover:text-white transition flex items-center gap-1">
              <span>Store Locator</span>
            </Link>
          </div>
        </div>
      </div>      {/* Main Navbar Header (Desktop Height 84px - Largest Spacious View) */}
      <nav
        className={`transition-all duration-300 ${scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200/80"
          : "bg-white border-b border-slate-100"
          }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4 lg:py-5 h-16 sm:h-20 lg:h-[84px]">

          {/* Brand Logo & Desktop Navigation Wrapper */}
          <div className="flex items-center gap-8 lg:gap-14">
            {/* Large Brand Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0 py-1">
              <img
                src="/images/matrin-logo-sticker.png"
                alt="MATRIN"
                className="h-9 sm:h-11 lg:h-[50px] max-h-[52px] w-auto object-contain transition-transform duration-300 group-hover:scale-103"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden items-center gap-6 lg:gap-8 lg:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const isDropdownActive = activeDropdown === link.name;
                return (
                  <div
                    key={link.name}
                    className="relative group py-4"
                    onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Link
                      href={link.href}
                      className={`text-base sm:text-base lg:text-[16px] font-bold tracking-wide transition-colors flex items-center gap-1.5 py-1 relative ${isActive
                        ? "text-[#0645B5]"
                        : "text-slate-800 hover:text-[#0645B5]"
                        }`}
                    >
                      <span>{link.name}</span>
                      {link.hasDropdown && (
                        <ChevronDown
                          size={15}
                          className={`text-slate-400 transition-transform duration-200 ${isDropdownActive ? "rotate-180 text-[#0645B5]" : ""
                            }`}
                        />
                      )}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0645B5] rounded-full"
                        />
                      )}
                    </Link>

                    {/* Dropdown Menu for Products & Categories */}
                    {link.hasDropdown && (
                      <AnimatePresence>
                        {isDropdownActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 w-[540px] rounded-2xl bg-white p-5 shadow-2xl border border-slate-100 z-50 grid grid-cols-12 gap-5"
                          >
                            {/* Left Column: Categories List */}
                            <div className="col-span-6 space-y-2 border-r border-slate-100 pr-4">
                              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#0645B5] mb-3">
                                Shop by Category
                              </div>
                              {categoryItems.map((cat) => (
                                <Link
                                  key={cat.name}
                                  href={cat.href}
                                  onClick={() => setActiveDropdown(null)}
                                  className="block p-2 rounded-xl hover:bg-blue-50/80 transition group/item"
                                >
                                  <div className="text-xs font-bold text-slate-800 group-hover/item:text-[#0645B5] flex items-center justify-between">
                                    <span>{cat.name}</span>
                                    <ArrowRight size={12} className="opacity-0 group-hover/item:opacity-100 transition-opacity text-[#0645B5]" />
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-medium">{cat.desc}</div>
                                </Link>
                              ))}
                            </div>

                            {/* Right Column: Featured Products Preview */}
                            <div className="col-span-6 space-y-2">
                              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#0645B5] mb-3 flex items-center justify-between">
                                <span>Bestsellers</span>
                                <Link href="/products" onClick={() => setActiveDropdown(null)} className="text-[10px] text-slate-400 hover:text-[#0645B5] font-bold">
                                  View All →
                                </Link>
                              </div>
                              {featuredProducts.map((product) => (
                                <Link
                                  key={product.id}
                                  href={`/products/${product.id}`}
                                  onClick={() => setActiveDropdown(null)}
                                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition"
                                >
                                  <div className="h-11 w-11 shrink-0">
                                    <ProductImage
                                      src={product.image}
                                      alt={product.name}
                                      fitMode="contain"
                                      paddingClassName="p-1"
                                      roundedClassName="rounded-xl"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-extrabold text-slate-800 truncate">{product.name}</div>
                                    <div className="text-[10px] font-bold text-[#0645B5]">₹{product.price}</div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Action Bar (Tablet & Desktop) */}
          <div className="hidden items-center gap-4 md:flex ml-6 lg:ml-12">

            {/* Inline Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-60 max-w-xs rounded-full border border-slate-200 bg-slate-50 h-10 py-2 pl-9 pr-4 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#0645B5] focus:outline-hidden transition-all shadow-2xs"
              />
              <Search size={16} className="absolute left-3 text-slate-400 pointer-events-none" />

              {/* Autocomplete Dropdown */}
              {searchQuery.trim() && (
                <div className="absolute top-12 right-0 w-84 rounded-2xl bg-white p-3 shadow-2xl border border-slate-100 z-50 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">
                    Matches ({searchResults.length})
                  </div>
                  {searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <Link
                        key={item.id}
                        href={`/products/${item.id}`}
                        onClick={() => setSearchQuery("")}
                        className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition"
                      >
                        <div className="h-11 w-11 shrink-0">
                          <ProductImage
                            src={item.image}
                            alt={item.name}
                            fitMode="contain"
                            paddingClassName="p-1"
                            roundedClassName="rounded-xl"
                          />
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

            {/* Account / Login Button */}
            <div className="relative" ref={accountRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setIsAccountOpen((v) => !v)}
                    className="min-h-[44px] flex items-center gap-2 text-slate-700 hover:text-[#0645B5] transition-colors p-2 rounded-xl hover:bg-slate-50"
                    title="Account"
                  >
                    <div className="h-8 w-8 rounded-full bg-[#0645B5] text-white flex items-center justify-center text-xs font-extrabold uppercase shrink-0">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <span className="hidden lg:inline text-xs font-bold max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${isAccountOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isAccountOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-1 w-56 rounded-2xl bg-white p-2 shadow-2xl border border-slate-100 z-50"
                      >
                        <div className="px-3 py-2 border-b border-slate-100 mb-1">
                          <p className="text-xs font-extrabold text-slate-800 truncate">{user.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                        </div>
                        {isAdmin && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setIsAccountOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-[#0645B5] transition"
                          >
                            <LayoutDashboard size={16} />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            setIsAccountOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href="/login"
                  className="min-h-[44px] flex items-center gap-1.5 text-slate-700 hover:text-[#0645B5] transition-colors px-3 py-2 rounded-xl hover:bg-slate-50 text-xs font-bold"
                  title="Login"
                >
                  <UserCircle2 size={20} />
                  <span className="hidden lg:inline">Login</span>
                </Link>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="min-h-[44px] min-w-[44px] relative flex items-center justify-center text-slate-700 hover:text-[#0645B5] transition-colors p-2 rounded-xl hover:bg-slate-50"
              title="Wishlist"
            >
              <Heart size={21} className={wishlistCount > 0 ? "text-rose-500 fill-rose-500" : ""} />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0645B5] text-[9px] font-extrabold text-white shadow-2xs">
                {wishlistCount}
              </span>
            </button>

            {/* Cart Button */}
            <button
              onClick={openCartDrawer}
              className="min-h-[44px] min-w-[44px] relative flex items-center justify-center text-slate-700 hover:text-[#0645B5] transition-colors p-2 rounded-xl hover:bg-slate-50"
              title="Cart"
            >
              <ShoppingBag size={21} />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#0645B5] text-[9px] font-extrabold text-white shadow-2xs">
                {cartCount}
              </span>
            </button>

          </div>

          {/* Mobile Action Bar (<640px) */}
          <div className="flex items-center gap-1 md:hidden">
            {/* Mobile Account/Login Button */}
            <Link
              href={user ? (isAdmin ? "/admin/dashboard" : "/") : "/login"}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-700 hover:text-[#0645B5] p-2 rounded-xl transition active:scale-95"
              aria-label={user ? "Account" : "Login"}
            >
              {user ? (
                <div className="h-6 w-6 rounded-full bg-[#0645B5] text-white flex items-center justify-center text-[10px] font-extrabold uppercase">
                  {user.name?.charAt(0) || "U"}
                </div>
              ) : (
                <UserCircle2 size={20} />
              )}
            </Link>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-700 hover:text-[#0645B5] p-2 rounded-xl transition active:scale-95"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Mobile Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="min-h-[44px] min-w-[44px] relative flex items-center justify-center text-slate-700 hover:text-[#0645B5] p-2 rounded-xl transition active:scale-95"
              title="Wishlist"
            >
              <Heart size={20} className={wishlistCount > 0 ? "text-rose-500 fill-rose-500" : ""} />
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0645B5] text-[9px] font-extrabold text-white shadow-2xs">
                {wishlistCount}
              </span>
            </button>

            {/* Mobile Cart Button */}
            <button
              onClick={openCartDrawer}
              className="min-h-[44px] min-w-[44px] relative flex items-center justify-center text-slate-700 hover:text-[#0645B5] p-2 rounded-xl transition active:scale-95"
              title="Cart"
            >
              <ShoppingBag size={20} />
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0645B5] text-[9px] font-extrabold text-white shadow-2xs">
                {cartCount}
              </span>
            </button>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-800 p-2 rounded-xl hover:bg-slate-100 transition active:scale-95"
              aria-label="Toggle Navigation"
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
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
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#0645B5] focus:outline-hidden shadow-2xs"
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
                      className={`min-h-[44px] py-3 px-4 rounded-xl text-base font-bold flex items-center justify-between transition ${isActive
                        ? "bg-blue-50 text-[#0645B5]"
                        : "text-slate-800 hover:bg-slate-50"
                        }`}
                    >
                      <span>{link.name}</span>
                      <ArrowRight size={16} className={isActive ? "text-[#0645B5]" : "text-slate-400"} />
                    </Link>
                  );
                })}

                <div className="mt-2 pt-2 border-t border-slate-100">
                  {user ? (
                    <>
                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="min-h-[44px] py-3 px-4 rounded-xl text-base font-bold flex items-center gap-2.5 text-slate-800 hover:bg-slate-50 transition"
                        >
                          <LayoutDashboard size={18} className="text-slate-400" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          logout();
                        }}
                        className="w-full min-h-[44px] py-3 px-4 rounded-xl text-base font-bold flex items-center gap-2.5 text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsOpen(false)}
                      className="min-h-[44px] py-3 px-4 rounded-xl text-base font-bold flex items-center gap-2.5 text-slate-800 hover:bg-slate-50 transition"
                    >
                      <UserCircle2 size={18} className="text-slate-400" />
                      <span>Login / Sign Up</span>
                    </Link>
                  )}
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