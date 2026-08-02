"use client";

export default function AdminReviewsPage() {
  const reviews = [
    { id: 1, author: "Rahul Sharma", rating: 5, comment: "MATRIN Liquid Detergent smells fresh and removes tough stains easily!", status: "Approved", date: "2026-08-01" },
    { id: 2, author: "Priya Patel", rating: 5, comment: "Amazing quality, leaves my floors sparkling clean without chemical odor.", status: "Approved", date: "2026-07-29" },
    { id: 3, author: "Anish Verma", rating: 4, comment: "Fast shipping and great dishwash gel package.", status: "Approved", date: "2026-07-25" },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white">Customer Reviews Moderation</h1>
        <p className="text-xs text-slate-400 font-medium mt-1">Review ratings and feedback from verified purchasers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-[#1E293B] rounded-2xl border border-slate-800 p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">{rev.author}</h3>
                <span className="text-[10px] text-slate-400">{rev.date}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {rev.status}
              </span>
            </div>

            <div className="flex text-amber-400 text-xs gap-1">
              {"★".repeat(rev.rating)}
            </div>

            <p className="text-xs text-slate-300 italic">
              &ldquo;{rev.comment}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
