"use client";

import { Star, CheckCircle2, Quote } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Riya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment:
      "Matrin detergent gives amazing results. Clothes look brand new even after multiple washes!",
    productName: "Ultra Liquid Detergent",
  },
  {
    id: 2,
    name: "Amit Verma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment:
      "Best floor cleaner! Long-lasting calming lavender fragrance and super effective on stains.",
    productName: "Floor Shine Lavender",
  },
  {
    id: 3,
    name: "Sneha Patil",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment:
      "Love the dish wash liquid. Removes grease easily with single drop and is very gentle on hands.",
    productName: "Dishwash Lemon",
  },
];

export default function CustomerReviews() {
  return (
    <section className="bg-[#F5FAFF] py-14 lg:py-18 border-t border-[#DCE8F5]" id="reviews">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Section Header */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#0645B5] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100 inline-block shadow-2xs mb-2">
              REAL TESTIMONIALS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#102A5C] tracking-tight">
              What Our Customers Say
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5F6B7A] font-medium max-w-md">
            Trusted by over 10,000+ happy households across India for premium home hygiene.
          </p>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between rounded-3xl bg-white p-6 border border-[#EAF0F8] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Header Profile Info */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.avatar}
                      alt={rev.name}
                      className="h-12 w-12 rounded-full object-cover shrink-0 border-2 border-[#0645B5]/20 shadow-xs"
                    />
                    <div>
                      <h3 className="font-extrabold text-[#102A5C] text-sm leading-tight">
                        {rev.name}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0645B5] mt-0.5">
                        <CheckCircle2 size={12} className="text-[#0645B5]" /> Verified Buyer
                      </span>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Highlighted Review Comment Box */}
                <div className="relative rounded-2xl bg-[#F0F5FA] p-4 border border-[#EAF0F8]">
                  <Quote size={20} className="text-[#0645B5]/20 absolute top-3 right-3" />
                  <p className="text-xs sm:text-sm font-bold text-[#102A5C] leading-relaxed relative z-10">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              </div>

              {/* Product Badge Footer */}
              <div className="mt-4 pt-3 border-t border-[#F0F5FA] flex items-center justify-between text-[11px] font-bold text-[#5F6B7A]">
                <span>Purchased: <strong className="text-[#0645B5] font-extrabold">{rev.productName}</strong></span>
                <span className="text-amber-500 font-extrabold">5.0 ★</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
