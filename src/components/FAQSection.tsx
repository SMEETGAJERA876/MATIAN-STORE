"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
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
    <section className="py-16 lg:py-20 bg-white dark:bg-[#0B132B]" id="faq-section">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#1E40AF] dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-md border border-blue-100 dark:border-blue-800/60 inline-block">
            QUESTIONS & ANSWERS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2545] dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Have questions about our ingredients, delivery, or usage? We have answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-[#152238] transition shadow-2xs"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-6 text-left text-base font-extrabold text-[#0B2545] dark:text-white hover:text-[#1E40AF] dark:hover:text-blue-400 transition"
                >
                  <span className="pr-4">{faq.question}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 transition-transform duration-300 text-slate-400 ${
                      isOpen ? "rotate-180 text-[#1E40AF] dark:text-blue-400" : ""
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
                      <div className="px-6 pb-6 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium border-t border-slate-200/60 dark:border-slate-800 pt-4">
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
