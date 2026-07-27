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
    <section className="bg-[#FAF7F2] py-20">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            TESTIMONIALS
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0A2E4E]">
            Loved by 50,000+ Indian Households
          </h2>
          <p className="mt-3 text-slate-600 font-light text-sm">
            Discover why families trust Matrin for superior home care and daily cleaning.
          </p>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="relative flex flex-col justify-between rounded-3xl bg-[#F5F1EB] p-8 border border-[#EFEAE4] transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <Quote size={36} className="absolute top-6 right-6 text-[#0A2E4E]/10" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="mt-4 font-serif text-base leading-relaxed text-slate-800 italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-[#EFEAE4] flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#0A2E4E] text-xs uppercase tracking-wider">
                    {rev.name}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                    <CheckCircle2 size={12} /> {rev.role}
                  </div>
                </div>

                <span className="text-[10px] font-medium text-slate-400">
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
