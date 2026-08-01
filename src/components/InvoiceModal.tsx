"use client";

import { OrderInvoice } from "@/types/order";
import { X, Printer, Download, CheckCircle2, ShieldCheck, FileText, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InvoiceModal({
  invoice,
  isOpen,
  onClose,
}: {
  invoice: OrderInvoice | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "upi":
        return "UPI Instant Transfer (Google Pay / PhonePe / Paytm)";
      case "card":
        return "Credit / Debit Card (Visa / Mastercard)";
      case "netbanking":
        return "Net Banking";
      case "cod":
        return "Cash on Delivery (COD)";
      default:
        return method.toUpperCase();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/70 backdrop-blur-xs print:p-0 print:bg-white">
        
        {/* Backdrop Click Listener */}
        <div className="fixed inset-0 print:hidden" onClick={onClose} />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl bg-white border border-[#EFEAE4] shadow-2xl print:shadow-none print:border-none print:rounded-none print:max-w-none print:w-full my-auto"
        >
          {/* Action Bar Header (Hidden in Print) */}
          <div className="flex items-center justify-between bg-[#0A2E4E] p-4 text-white print:hidden">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-cyan-300" />
              <span className="text-xs font-bold uppercase tracking-wider">TAX INVOICE GENERATOR</span>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-bold hover:bg-white/20 transition"
              >
                <Printer size={14} /> Print / Save PDF
              </button>
              <button
                onClick={onClose}
                className="flex items-center gap-1 rounded-xl bg-rose-500/20 text-rose-200 border border-rose-400/30 px-3 py-1.5 text-xs font-bold hover:bg-rose-500/40 transition"
              >
                <X size={14} /> Close Invoice
              </button>
            </div>
          </div>

          {/* Printable Invoice Body */}
          <div className="p-8 sm:p-10 font-sans text-slate-800 space-y-8 bg-white print:p-6" id="invoice-print-area">
            
            {/* Invoice Top Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 pb-6 gap-6">
              <div>
                <img
                  src="/images/matrin-logo-clean.webp"
                  alt="MATRIN"
                  className="h-10 w-auto object-contain mb-2"
                />
                <p className="text-xs text-slate-500 font-medium">MATRIN STORE INDIA PRIVATE LIMITED</p>
                <p className="text-[11px] text-slate-400">GSTIN: 27AAACM1234F1Z5 | CIN: U74999MH2025PTC123456</p>
                <p className="text-[11px] text-slate-400">Plot 42, Tech Park, Andheri East, Mumbai 400069</p>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-block rounded-lg bg-[#0A2E4E] px-3 py-1 text-xs font-bold text-white uppercase tracking-wider mb-2">
                  TAX INVOICE
                </span>
                <h3 className="text-lg font-bold font-mono text-[#0A2E4E]">{invoice.invoiceNumber}</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Date: {invoice.orderDate}</p>
                <p className="text-xs text-slate-500">Transaction ID: {invoice.transactionId || `TXN-${Date.now()}`}</p>
              </div>
            </div>

            {/* Billed To & Shipped To */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#FAF7F2] p-5 rounded-2xl border border-[#EFEAE4]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0A2E4E] block mb-1">
                  BILLED TO & SHIPPING ADDRESS
                </span>
                <h4 className="font-bold text-slate-800 text-sm">{invoice.customer.fullName}</h4>
                <p className="text-xs text-slate-600 mt-1">{invoice.customer.addressLine}</p>
                <p className="text-xs text-slate-600">{invoice.customer.city}, {invoice.customer.state} - {invoice.customer.pincode}</p>
                <p className="text-xs text-slate-600 font-mono mt-1">Phone: {invoice.customer.phone} | Email: {invoice.customer.email}</p>
              </div>

              <div className="space-y-2 border-t sm:border-t-0 sm:border-l sm:pl-6 border-[#EFEAE4] pt-4 sm:pt-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0A2E4E] block mb-1">
                  PAYMENT INFORMATION
                </span>
                <div className="text-xs">
                  <span className="text-slate-500 font-medium">Method:</span>{" "}
                  <span className="font-bold text-slate-800">{getPaymentMethodName(invoice.paymentMethod)}</span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-500 font-medium">Status:</span>{" "}
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    invoice.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {invoice.paymentStatus}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-light mt-2">
                  🔒 256-Bit SSL Encrypted & Verified Transaction
                </p>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#0A2E4E] text-white text-[11px] font-bold uppercase tracking-wider">
                    <th className="py-3 px-4 rounded-l-xl">#</th>
                    <th className="py-3 px-4">Item & Description</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">GST (18%)</th>
                    <th className="py-3 px-4 text-right rounded-r-xl">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {invoice.items.map((item, idx) => {
                    const linePrice = item.product.price * item.quantity;
                    const gst = Math.round(linePrice * 0.18);
                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-bold text-slate-400">{idx + 1}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800">{item.product.name}</div>
                          <span className="text-[10px] text-slate-400 font-medium">{item.product.category}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700">{item.quantity}</td>
                        <td className="py-3.5 px-4 text-right font-medium">₹{item.product.price}</td>
                        <td className="py-3.5 px-4 text-right text-slate-500">₹{gst}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900">₹{linePrice}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total Calculations */}
            <div className="flex flex-col sm:flex-row justify-between items-start pt-4 border-t border-slate-200 gap-6">
              <div className="max-w-xs text-xs text-slate-500 space-y-1">
                <span className="font-bold text-[#0A2E4E] block uppercase tracking-wider text-[10px]">TERMS & CONDITIONS</span>
                <p>1. Returns accepted within policy guidelines.</p>
                <p>2. This is a computer generated tax invoice and requires no physical signature.</p>
              </div>

              <div className="w-full sm:w-72 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-bold text-slate-800">₹{invoice.subtotal}</span>
                </div>

                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount ({invoice.appliedCoupon}):</span>
                    <span>-₹{invoice.discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>CGST (9%):</span>
                  <span>₹{Math.round(invoice.taxAmount / 2)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>SGST (9%):</span>
                  <span>₹{Math.round(invoice.taxAmount / 2)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Delivery Charges:</span>
                  <span className="font-bold text-slate-800">
                    {invoice.shippingFee === 0 ? "FREE" : `₹${invoice.shippingFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-[#0A2E4E] pt-3 border-t-2 border-[#0A2E4E]">
                  <span>Grand Total:</span>
                  <span>₹{invoice.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Official Stamp & Sign */}
            <div className="pt-6 flex justify-between items-end border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <CheckCircle2 size={18} /> Tax Paid & Verified Digitally
              </div>
              <div className="text-right">
                <div className="h-10 w-28 border border-dashed border-[#0A2E4E]/40 rounded-lg mx-auto flex items-center justify-center text-[10px] font-bold text-[#0A2E4E] uppercase tracking-wider mb-1 bg-blue-50/50">
                  [MATRIN SEAL]
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Authorized Signatory</span>
              </div>
            </div>

            {/* Bottom Action Footer (Hidden in Print) */}
            <div className="pt-6 border-t border-slate-200 flex justify-end gap-3 print:hidden">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-xl border border-[#0A2E4E] text-[#0A2E4E] px-4 py-2.5 text-xs font-bold hover:bg-[#0A2E4E] hover:text-white transition"
              >
                <Printer size={14} /> Print / Save PDF
              </button>
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-xl bg-[#0A2E4E] text-white px-5 py-2.5 text-xs font-bold hover:bg-[#13426B] transition shadow-xs"
              >
                <X size={14} /> Close Invoice
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
