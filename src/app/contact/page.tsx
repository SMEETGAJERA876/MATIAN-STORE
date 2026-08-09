"use client";

import { useState, FormEvent } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Headphones,
  Zap,
  Heart,
  MessageSquare,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ContactPage() {
  const [mapError, setMapError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
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
    toast.success("Message sent successfully! Our team will reply within 24 hours.");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-16 font-sans">
      
      {/* Hero Section (Exact Match with Reference Image 3) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#EBF3FB] via-[#F2F7FD] to-white py-12 lg:py-16 border-b border-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 relative z-10">
          <div className="grid gap-10 lg:grid-cols-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#102A5C] tracking-tight">
                  Contact Us
                </h1>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0645B5] tracking-tight">
                  We&apos;re here to help!
                </h2>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-lg">
                Have a question, feedback or need support? Our team is always ready to assist you.
              </p>

              {/* 3 Top Badges (Exact Image 3) */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs font-bold text-slate-700">
                <div className="rounded-2xl bg-white p-3.5 border border-slate-200/80 shadow-2xs space-y-1">
                  <div className="mx-auto h-8 w-8 rounded-full bg-blue-50 text-[#0645B5] flex items-center justify-center">
                    <Headphones size={16} />
                  </div>
                  <div className="text-[11px] font-extrabold text-[#102A5C]">24/7 Support</div>
                  <div className="text-[10px] text-slate-400 font-normal">We&apos;re always here to help you.</div>
                </div>

                <div className="rounded-2xl bg-white p-3.5 border border-slate-200/80 shadow-2xs space-y-1">
                  <div className="mx-auto h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Zap size={16} />
                  </div>
                  <div className="text-[11px] font-extrabold text-[#102A5C]">Quick Response</div>
                  <div className="text-[10px] text-slate-400 font-normal">We reply within 24 hours.</div>
                </div>

                <div className="rounded-2xl bg-white p-3.5 border border-slate-200/80 shadow-2xs space-y-1">
                  <div className="mx-auto h-8 w-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
                    <Heart size={16} />
                  </div>
                  <div className="text-[11px] font-extrabold text-[#102A5C]">Customer First</div>
                  <div className="text-[10px] text-slate-400 font-normal">Your satisfaction is our priority.</div>
                </div>
              </div>
            </div>

            {/* Right Product Lineup Graphic */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-lg">
                <img
                  src="/images/matrin-hero-lineup.png"
                  alt="Matrin Products"
                  className="h-auto w-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Grid: Contact Form (Left Col 6) & Touch Cards (Right Col 6) (Exact Image 3) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-12">
        <div className="grid gap-8 lg:grid-cols-12 items-start">
          
          {/* Send Us a Message Form Card (Col 6) */}
          <div className="lg:col-span-6 rounded-3xl bg-white p-8 border border-slate-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-2xl font-extrabold text-[#102A5C]">
                Send Us a Message
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Fill out the form and our team will get back to you.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl bg-emerald-50 p-8 text-center border border-emerald-200 space-y-3">
                <CheckCircle2 size={40} className="mx-auto text-emerald-600" />
                <h4 className="text-xl font-bold text-emerald-950">Thank You, {formData.name}!</h4>
                <p className="text-xs text-emerald-800">Your message has been sent successfully. We will reply to {formData.email} within 24 hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 rounded-full bg-[#0645B5] px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#1a3899]"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0645B5] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0645B5] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0645B5] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0645B5] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Type your message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0645B5] focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0645B5] py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#1a3899] transition active:scale-98"
                >
                  <span>Send Message</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>

          {/* Get in Touch Touch Cards (Col 6 - Exact Image 3) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="rounded-3xl bg-white p-8 border border-slate-100 shadow-sm space-y-6">
              <div>
                <h3 className="text-2xl font-extrabold text-[#102A5C]">
                  Get in Touch
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Choose the best way to reach us.
                </p>
              </div>

              {/* 4 Touch Cards (Exact Image 3) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Call Us */}
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/60 flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-[#0645B5] flex items-center justify-center shrink-0 border border-blue-100">
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-[#102A5C]">Call Us</div>
                    <div className="text-xs font-bold text-[#0645B5] mt-0.5">+91 98765 43210</div>
                    <div className="text-[10px] text-slate-400 font-medium">Mon - Sat: 9:00 AM - 6:00 PM</div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/60 flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-[#102A5C]">WhatsApp</div>
                    <div className="text-xs font-bold text-emerald-700 mt-0.5">+91 98765 43210</div>
                    <div className="text-[10px] text-slate-400 font-medium">Chat with us on WhatsApp</div>
                  </div>
                </div>

                {/* Email Us */}
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/60 flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-[#102A5C]">Email Us</div>
                    <div className="text-xs font-bold text-purple-700 mt-0.5">support@matrin.com</div>
                    <div className="text-[10px] text-slate-400 font-medium">We reply within 24 hours</div>
                  </div>
                </div>

                {/* Visit Us */}
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/60 flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold text-[#102A5C]">Visit Us</div>
                    <div className="text-[11px] font-bold text-slate-700 mt-0.5">Matrin House, Clean City, Mumbai, Maharashtra - 400001</div>
                    <a href="#" className="text-[10px] font-extrabold text-[#0645B5] hover:underline block mt-1">View on Google Maps</a>
                  </div>
                </div>
              </div>

              {/* Follow Us Section */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-extrabold text-[#102A5C] mb-3">Follow Us</div>
                <div className="flex items-center gap-3">
                  {["facebook", "instagram", "youtube", "twitter", "linkedin"].map((soc) => (
                    <a
                      key={soc}
                      href="#"
                      className="h-9 w-9 rounded-full bg-blue-50 text-[#0645B5] flex items-center justify-center hover:bg-[#0645B5] hover:text-white transition shadow-2xs capitalize text-xs font-bold"
                    >
                      {soc.charAt(0).toUpperCase()}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Map Section with Real Embedded Google Map & Graceful Fallback */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-12 scroll-mt-24" id="map">
        <div className="relative overflow-hidden rounded-3xl bg-slate-100 h-80 sm:h-96 border border-slate-200 shadow-sm flex items-center p-6 sm:p-10">
          
          {/* TODO: Replace with your real Google Maps Embed URL or lat/long when available */}
          {!mapError ? (
            <iframe
              title="Matrin House Office Location Map"
              // Google Maps Embed URL for Matrin House placeholder address (Mumbai 400001)
              src="https://maps.google.com/maps?q=Mumbai+Maharashtra+400001&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="absolute inset-0 h-full w-full border-0 rounded-3xl"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              onError={() => setMapError(true)}
            />
          ) : (
            /* Graceful Fallback if map fails to load (offline preview) */
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-[#102A5C] p-6 flex flex-col items-center justify-center text-center text-white space-y-3 rounded-3xl">
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/20">
                <MapPin size={24} className="text-emerald-400" />
              </div>
              <div>
                <h4 className="text-lg font-extrabold">Matrin House Office Location</h4>
                <p className="text-xs text-blue-100 mt-1 max-w-md">
                  Clean City, Mumbai, Maharashtra – 400001
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=Mumbai+Maharashtra+400001"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-[#0645B5] shadow-md hover:bg-slate-50 transition"
              >
                <span>View on Google Maps</span>
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* Overlay Info Card (Exact Image Match) */}
          <div className="relative z-10 rounded-2xl bg-white/95 backdrop-blur-md p-6 border border-slate-200/80 shadow-xl max-w-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#0645B5]">
                <MapPin size={16} /> Our Office
              </div>
              <a
                href="https://maps.google.com/?q=Mumbai+Maharashtra+400001"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-extrabold text-[#0645B5] hover:underline flex items-center gap-1"
              >
                <span>Open Map</span>
                <ExternalLink size={10} />
              </a>
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#102A5C]">Matrin House, Clean City</div>
              <div className="text-xs text-slate-500 font-medium">Mumbai, Maharashtra – 400001</div>
            </div>

            <div className="space-y-1.5 pt-1 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600" /> Easy to reach location
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600" /> Nearby public transport
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-600" /> Ample parking space available
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Bottom 4 Trust Badges Bar (Exact Image 3) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-12">
        <div className="rounded-3xl bg-white p-6 shadow-2xs border border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-50 text-[#0645B5] flex items-center justify-center shrink-0 border border-blue-100">
              <Headphones size={20} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#102A5C]">Fast Support</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Quick solutions for all your queries.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#102A5C]">Safe & Secure</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Your information is always protected.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <Award size={20} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#102A5C]">Built for Every Home</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Formulated for Indian household needs.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#102A5C]">100% Satisfaction</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">We are committed to your satisfaction.</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
