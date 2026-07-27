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
  {
    question: "What is Matrin's return and refund policy?",
    answer:
      "We offer a 7-Day Hassle-Free Replacement/Return Policy. If you receive a damaged product or are unhappy with the performance, contact us for instant resolution.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-[#FAF7F2]" id="faq-section">
      <div className="mx-auto max-w-4xl px-6">
        
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            QUESTIONS & ANSWERS
          </span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#0A2E4E]">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-slate-600 font-light text-sm">
            Have questions about our ingredients, delivery, or usage? We have answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-[#EFEAE4] bg-[#F5F1EB] transition"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between p-6 text-left font-serif text-lg font-bold text-[#0A2E4E] hover:text-[#13426B]"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 text-slate-500 ${
                      isOpen ? "rotate-180 text-[#0A2E4E]" : ""
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
                      <div className="px-6 pb-6 text-xs leading-relaxed text-slate-600 font-light border-t border-[#EFEAE4] pt-4">
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
