"use client";

import { Search, X } from "lucide-react";

type SearchBarProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function SearchBar({ search, setSearch }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative flex items-center">
        <Search size={18} className="absolute left-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search products by name, fragrance, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-[#EFEAE4] bg-[#F5F1EB] py-3.5 pl-12 pr-10 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:border-[#0A2E4E] focus:bg-white focus:outline-hidden transition"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3.5 text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}