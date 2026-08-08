"use client";

import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Riya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment:
      "Matrin detergent gives amazing results. Clothes look new even after multiple washes!",
  },
  {
    id: 2,
    name: "Amit Verma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment:
      "Best floor cleaner! Long-lasting fragrance and super effective.",
  },
  {
    id: 3,
    name: "Sneha Patil",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    comment:
      "Love the dish wash liquid. Removes grease easily and is gentle on hands.",
  },
];

export default function CustomerReviews() {
  return (
    <section className="bg-[#F5FAFF] dark:bg-[#FFFFFF] py-12 lg:py-16" id="reviews">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Section Header matching reference image */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-[#102A5C] tracking-tight">
            What Our Customers Say
          </h2>
        </div>

        {/* Reviews Cards Grid matching reference image */}
        <div className="grid gap-6 md:grid-cols-3">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="flex items-start gap-4 rounded-2xl bg-white dark:bg-[#152238] p-5 border border-[#DCE8F5] dark:border-[#233554] shadow-xs"
            >
              <img
                src={rev.avatar}
                alt={rev.name}
                className="h-12 w-12 rounded-full object-cover shrink-0 border border-[#DCE8F5]"
              />

              <div className="space-y-1">
                <h3 className="font-bold text-[#102A5C] dark:text-white text-xs">
                  {rev.name}
                </h3>

                {/* Rating Stars */}
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="text-xs leading-relaxed text-[#5F6B7A] dark:text-slate-300 font-medium pt-1">
                  {rev.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
