"use client";

import { Star, CheckCircle2, Quote } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Rohan Kapoor",
    role: "Verified Buyer",
    rating: 5,
    comment:
      "Matrin's Liquid Detergent removed tough oil stains from my cotton shirts on the first wash! The fragrance is subtle yet lasts all week.",
    product: "Matrin Ultra Liquid Detergent",
    date: "2 days ago",
  },
  {
    id: 2,
    name: "Pooja Trivedi",
    role: "Homemaker",
    rating: 5,
    comment:
      "The Dish Wash is incredibly gentle on hands. Other products dried my skin out, but Matrin cleans grease effortlessly with just a few drops.",
    product: "Matrin Power Dish Wash",
    date: "1 week ago",
  },
  {
    id: 3,
    name: "Dr. Suresh Iyer",
    role: "Verified Buyer",
    rating: 5,
    comment:
      "Floor cleaner smells so fresh! With pets at home, having a safe antibacterial floor cleaner gives us complete peace of mind.",
    product: "Matrin Fresh Floor Cleaner",
    date: "2 weeks ago",
  },
];

export default function CustomerReviews() {
  return (
    <section className="bg-[#F8FAFC] py-16 lg:py-20" id="reviews">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#1E40AF] bg-blue-50 px-3 py-1 rounded-md border border-blue-100 inline-block">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2545] tracking-tight">
            Loved by 50,000+ Indian Households
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Discover why families trust Matrin for superior home care and daily cleaning.
          </p>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="relative flex flex-col justify-between rounded-3xl bg-white p-7 border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <Quote size={36} className="absolute top-6 right-6 text-[#1E40AF]/10" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-700 font-medium italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-[#0B2545] text-xs">
                    {rev.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold">
                    <CheckCircle2 size={13} /> {rev.role}
                  </div>
                </div>

                <span className="text-[10px] font-semibold text-slate-400">
                  {rev.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
