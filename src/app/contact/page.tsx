"use client";

import { useState, FormEvent } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSubmitted(true);
    toast.success("Message sent successfully! Our team will reply within 24 hours.", {
      icon: "✉️",
    });
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] py-12">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            GET IN TOUCH
          </span>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl font-normal text-[#0A2E4E]">
            We&apos;re Here to Help You
          </h1>
          <p className="mt-3 text-slate-600 font-light text-sm leading-relaxed">
            Have questions regarding our products, bulk orders, or shipping? Reach out to us anytime!
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          
          <div className="rounded-3xl bg-[#F5F1EB] p-6 border border-[#EFEAE4]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF7F2] text-[#0A2E4E] mb-4">
              <Phone size={20} />
            </div>
            <h3 className="font-bold text-[#0A2E4E] text-xs uppercase tracking-wider">Customer Care</h3>
            <p className="text-xs text-slate-600 font-light mt-1">+91 98765 43210</p>
            <p className="text-xs text-slate-600 font-light">+91 98765 43211</p>
          </div>

          <div className="rounded-3xl bg-[#F5F1EB] p-6 border border-[#EFEAE4]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF7F2] text-[#0A2E4E] mb-4">
              <Mail size={20} />
            </div>
            <h3 className="font-bold text-[#0A2E4E] text-xs uppercase tracking-wider">Email Support</h3>
            <p className="text-xs text-slate-600 font-light mt-1">support@matrin.com</p>
            <p className="text-xs text-slate-600 font-light">info@matrin.com</p>
          </div>

          <div className="rounded-3xl bg-[#F5F1EB] p-6 border border-[#EFEAE4]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF7F2] text-[#0A2E4E] mb-4">
              <Clock size={20} />
            </div>
            <h3 className="font-bold text-[#0A2E4E] text-xs uppercase tracking-wider">Working Hours</h3>
            <p className="text-xs text-slate-600 font-light mt-1">Mon - Sat: 9:00 AM - 8:00 PM IST</p>
            <p className="text-xs font-semibold text-emerald-700">Sunday: Closed</p>
          </div>

          <div className="rounded-3xl bg-[#F5F1EB] p-6 border border-[#EFEAE4]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF7F2] text-[#0A2E4E] mb-4">
              <MapPin size={20} />
            </div>
            <h3 className="font-bold text-[#0A2E4E] text-xs uppercase tracking-wider">Head Office</h3>
            <p className="text-xs text-slate-600 font-light mt-1 leading-relaxed">
              Matrin Hub, SG Highway, Ahmedabad, Gujarat 380015
            </p>
          </div>

        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Contact Form Left */}
          <div className="lg:col-span-7 rounded-3xl bg-[#FAF7F2] p-8 sm:p-10 border border-[#EFEAE4]">
            <h2 className="font-serif text-3xl font-normal text-[#0A2E4E] mb-1">
              Send Us a Message
            </h2>
            <p className="text-xs text-slate-500 font-light mb-6">
              Fill out the form below and our team will get back to you within 24 hours.
            </p>

            {submitted ? (
              <div className="rounded-2xl bg-[#F5F1EB] p-8 text-center border border-[#EFEAE4]">
                <CheckCircle2 size={40} className="mx-auto text-emerald-700 mb-3" />
                <h3 className="font-serif text-2xl font-normal text-[#0A2E4E]">
                  Thank You, {formData.name}!
                </h3>
                <p className="text-xs text-slate-600 font-light mt-2">
                  Your message has been dispatched. We will review your inquiry and respond shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 rounded-full bg-[#0A2E4E] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs hover:bg-[#13426B]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-[#0A2E4E] mb-1.5 block">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Anjali Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-[#EFEAE4] bg-[#F5F1EB] px-4 py-3 text-xs font-medium focus:border-[#0A2E4E] focus:bg-white focus:outline-hidden"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0A2E4E] mb-1.5 block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="anjali@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-[#EFEAE4] bg-[#F5F1EB] px-4 py-3 text-xs font-medium focus:border-[#0A2E4E] focus:bg-white focus:outline-hidden"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-bold text-[#0A2E4E] mb-1.5 block">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-[#EFEAE4] bg-[#F5F1EB] px-4 py-3 text-xs font-medium focus:border-[#0A2E4E] focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#0A2E4E] mb-1.5 block">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full rounded-xl border border-[#EFEAE4] bg-[#F5F1EB] px-4 py-3 text-xs font-medium focus:border-[#0A2E4E] focus:bg-white focus:outline-hidden"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Order Tracking">Order Tracking</option>
                      <option value="Wholesale & Bulk">Wholesale & Bulk</option>
                      <option value="Feedback">Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#0A2E4E] mb-1.5 block">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-[#EFEAE4] bg-[#F5F1EB] px-4 py-3 text-xs font-medium focus:border-[#0A2E4E] focus:bg-white focus:outline-hidden"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-full bg-[#0A2E4E] px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-white shadow-xs hover:bg-[#13426B] transition active:scale-95 w-full sm:w-auto"
                >
                  <Send size={15} /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* Location Map Placeholder & Quick FAQ Right */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl bg-[#F5F1EB] p-6 border border-[#EFEAE4]">
              <h3 className="font-bold text-[#0A2E4E] text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                <MapPin size={16} /> Location Map
              </h3>
              
              <div className="relative aspect-16/9 overflow-hidden rounded-2xl bg-[#0A2E4E] flex flex-col items-center justify-center text-center p-6 text-[#FAF7F2]">
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mb-2 animate-bounce">
                  <MapPin size={20} />
                </div>
                <div className="font-serif text-lg font-normal text-white">Matrin Cleaning Headquarters</div>
                <div className="text-xs text-slate-300 font-light mt-0.5">SG Highway, Ahmedabad, India</div>
              </div>
            </div>

            <div className="rounded-3xl bg-[#0A2E4E] p-6 text-[#FAF7F2] shadow-md flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#E5D3C4]">INSTANT ANSWERS</span>
                <h4 className="font-serif text-xl font-normal text-white mt-1">Looking for FAQs?</h4>
                <p className="text-xs text-slate-300 font-light mt-1">Check out our answers to common questions.</p>
              </div>

              <Link
                href="/#faq-section"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-xs hover:bg-white/20"
              >
                <HelpCircle size={20} />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
