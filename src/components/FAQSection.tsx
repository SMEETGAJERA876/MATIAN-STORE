"use client";

import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "Are Matrin cleaning products safe for homes with pets and babies?",
    answer:
      "Yes! All Matrin products are non-toxic, free from harsh chlorine bleach, and formulated with bio-degradable surfactants. They are 100% safe for homes with children and pets when used as directed.",
  },
  {
    question: "Can I use Matrin Liquid Detergent in both top-load and front-load washing machines?",
    answer:
      "Absolutely. Matrin Liquid Detergent features a low-foam high-efficiency formula that works perfectly in front-load, top-load, and manual hand washes.",
  },
  {
    question: "What is the delivery timeframe for orders?",
    answer:
      "Standard delivery across India takes 2 to 4 business days. Metro cities usually receive orders within 24-48 hours. Orders above ₹499 qualify for Free Express Shipping.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0645B5] via-[#043694] to-[#102A5C] text-white py-12 lg:py-16 my-10 mx-auto max-w-7xl px-6 lg:px-12 shadow-xl shadow-blue-950/20 border border-blue-600/30" id="faq-section">
      
      {/* Background Decorative Ambient Lighting Circles */}
      <div className="absolute -top-12 -left-12 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-cyan-300 border border-white/20 backdrop-blur-xs shadow-2xs">
            <Sparkles size={13} /> QUESTIONS & ANSWERS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 font-medium">
            Have questions about our ingredients, delivery, or usage? We have answers.
          </p>
        </div>

        {/* FAQ Cards */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-3xl bg-white shadow-lg border border-white/40 transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-5 sm:p-6 text-left text-sm sm:text-base font-extrabold text-[#102A5C] hover:text-[#0645B5] transition"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 transition-transform duration-300 text-[#0645B5] ${
                      isOpen ? "rotate-180 text-[#0645B5]" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm leading-relaxed text-[#5F6B7A] font-medium border-t border-slate-100 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
