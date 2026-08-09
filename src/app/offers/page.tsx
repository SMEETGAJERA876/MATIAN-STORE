"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Tag,
  Copy,
  Check,
  Gift,
  ShoppingBag,
  Percent,
  ChevronRight,
  ShieldCheck,
  Zap,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";
import ProductCard from "@/components/ProductCard";
import { useProductStore } from "@/context/ProductStoreContext";

export default function OffersPage() {
  const { products } = useProductStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied to clipboard!`, {
      icon: "🎉",
      style: {
        background: "#0645B5",
        color: "#FFFFFF",
        fontWeight: "bold",
        borderRadius: "12px",
      },
    });
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const festivalOffers = [
    {
      id: "fest_10",
      code: "FESTIVAL10",
      title: "Grand Festival Special",
      discount: "10% OFF",
      description: "Get 10% Extra Discount on all Festival purchases above ₹1,500",
      minSpend: 1500,
      badge: "FESTIVAL EXCLUSIVE",
      gradient: "from-[#0645B5] via-[#043694] to-[#102A5C]",
      highlightColor: "text-amber-300",
      popular: true,
    },
    {
      id: "fest_5",
      code: "FESTIVE5",
      title: "Festive Starter Savings",
      discount: "5% OFF",
      description: "Get 5% Instant Discount on orders above ₹800",
      minSpend: 800,
      badge: "SEASONAL OFFER",
      gradient: "from-sky-600 via-blue-700 to-[#0645B5]",
      highlightColor: "text-cyan-200",
      popular: false,
    },
    {
      id: "super_15",
      code: "SUPER15",
      title: "Mega Household Saver",
      discount: "15% OFF",
      description: "Get 15% Max Discount on bulk festival shopping above ₹2,500",
      minSpend: 2500,
      badge: "BEST VALUE",
      gradient: "from-indigo-700 via-blue-900 to-[#0A192F]",
      highlightColor: "text-[#67E8F9]",
      popular: false,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F5FAFF] pb-20">
      {/* Top Banner Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#0645B5] via-[#043694] to-[#102A5C] py-12 lg:py-16 text-white shadow-lg">
        <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-amber-300 border border-white/20 backdrop-blur-xs">
                <Sparkles size={13} /> FESTIVAL DISCOUNTS & DEALS
              </span>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Exclusive Offers & Savings
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 font-medium max-w-xl">
                Unlock up to 10% OFF on Festival orders above ₹1,500. Copy your preferred coupon code below and apply at checkout!
              </p>

              <nav className="pt-2 flex items-center gap-2 text-xs font-semibold text-blue-200">
                <Link href="/" className="hover:text-white transition">Home</Link>
                <ChevronRight size={14} className="text-blue-300" />
                <span className="text-cyan-300">Offers & Coupons</span>
              </nav>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 max-w-md shrink-0">
              <div className="h-12 w-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                <Gift size={24} />
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">Festival Special Bonus</h4>
                <p className="text-[11px] text-blue-100 font-medium">Free Express Delivery on orders above ₹499 + Extra 10% OFF over ₹1,500.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Coupons Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-10 space-y-12">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#102A5C] tracking-tight">
                Active Festival Coupons
              </h2>
              <p className="text-xs text-[#5F6B7A] font-medium">
                Click copy to save coupon codes to your clipboard
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {festivalOffers.map((offer) => {
              const isCopied = copiedCode === offer.code;
              return (
                <div
                  key={offer.id}
                  className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${offer.gradient} text-white p-6 shadow-xl border border-white/20 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02]`}
                >
                  {offer.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-amber-500 text-[#102A5C] text-[10px] font-black uppercase tracking-wider px-4 py-1 rounded-bl-2xl shadow-md">
                      POPULAR FESTIVAL DEAL
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/15 px-3 py-1 rounded-full border border-white/20 backdrop-blur-xs">
                        {offer.badge}
                      </span>
                    </div>

                    <div>
                      <div className={`text-4xl font-black ${offer.highlightColor} tracking-tight`}>
                        {offer.discount}
                      </div>
                      <h3 className="text-lg font-bold text-white mt-1">
                        {offer.title}
                      </h3>
                      <p className="text-xs text-blue-100 font-medium leading-relaxed mt-2">
                        {offer.description}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white/10 p-3 border border-white/15 backdrop-blur-xs flex items-center justify-between">
                      <div className="text-[11px] font-semibold text-blue-100">
                        Min. Order Value: <strong className="text-white font-extrabold">₹{offer.minSpend.toLocaleString()}</strong>
                      </div>
                      <span className="text-[10px] font-extrabold uppercase text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-400/30">
                        VALID NOW
                      </span>
                    </div>
                  </div>

                  {/* Copy Coupon Action */}
                  <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between gap-3">
                    <div className="font-mono text-sm font-black text-cyan-200 tracking-wider bg-black/20 px-3 py-1.5 rounded-xl border border-white/20">
                      {offer.code}
                    </div>

                    <button
                      onClick={() => handleCopy(offer.code)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider transition-all shadow-md active:scale-95 ${
                        isCopied
                          ? "bg-emerald-500 text-white"
                          : "bg-white text-[#0645B5] hover:bg-cyan-50"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check size={14} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy Code
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Festival Threshold Highlight Box */}
        <section className="rounded-3xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-[#102A5C] p-6 lg:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 border border-amber-300">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/40 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#102A5C]">
              <Zap size={14} /> SPECIAL FESTIVAL RULE
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#102A5C] tracking-tight">
              Spend ₹1,500+ & Get Flat 10% OFF Instantly!
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-[#102A5C]/80 max-w-xl">
              Add products worth ₹1,500 to your cart and enter code <strong className="font-mono bg-white/60 px-2 py-0.5 rounded text-[#0645B5]">FESTIVAL10</strong> at checkout to claim your 10% festival discount.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full bg-[#102A5C] text-white hover:bg-[#0645B5] px-8 py-3.5 text-xs font-black uppercase tracking-wider transition-all shadow-md shrink-0 active:scale-95"
          >
            <span>Shop Qualifying Items</span>
            <ShoppingBag size={15} />
          </Link>
        </section>

        {/* Featured Festival Products Grid */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#102A5C] tracking-tight">
                Recommended Festival Products
              </h2>
              <p className="text-xs text-[#5F6B7A] font-medium">
                Combine these items to reach ₹1,500 and claim 10% OFF!
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold text-[#0645B5] hover:underline flex items-center gap-1"
            >
              View Full Catalog <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
