"use client";

import { OrderInvoice } from "@/types/order";
import { COMPANY_INFO } from "@/data/companyInfo";
import { X, Printer, Download, CheckCircle2, ShieldCheck, FileText, Sparkles, AlertTriangle } from "lucide-react";
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
          <div className="relative p-8 sm:p-10 font-sans text-slate-800 space-y-8 bg-white print:p-6 overflow-hidden" id="invoice-print-area">

            {/* Invoice Top Header */}
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start border-b border-slate-200 pb-6 gap-6">
              <div>
                <img
                  src="/images/matrin-logo-sticker.png"
                  alt="MATRIN"
                  className="h-10 w-auto object-contain mb-2"
                />
                <p className="text-xs text-slate-500 font-medium">{COMPANY_INFO.legalName}</p>
                <p className="text-[11px] text-slate-400">GSTIN: {COMPANY_INFO.gstin} | CIN: {COMPANY_INFO.cin}</p>
                <p className="text-[11px] text-slate-400">{COMPANY_INFO.address}</p>
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
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-800 text-sm">{invoice.customer.fullName}</h4>
                  {invoice.customer.addressType && (
                    <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-[#0A2E4E]/10 text-[#0A2E4E]">
                      {invoice.customer.addressType === "Home" ? "🏠 Home" : invoice.customer.addressType === "Office" ? "🏢 Office" : "📍 Other"}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1 font-medium">
                  {invoice.customer.houseFlatNo ? `${invoice.customer.houseFlatNo}, ${invoice.customer.streetArea}` : invoice.customer.addressLine}
                </p>
                <p className="text-xs text-slate-600 font-medium">{invoice.customer.city}, {invoice.customer.state} - {invoice.customer.pincode}</p>
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
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${invoice.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
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
                    <th className="py-3 px-4 text-right">Unit Price (Incl. GST)</th>
                    <th className="py-3 px-4 text-right">GST (18% Included)</th>
                    <th className="py-3 px-4 text-right rounded-r-xl">Total (Incl. GST)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {invoice.items.map((item, idx) => {
                    const linePrice = item.product.price * item.quantity;
                    // GST included portion inside item price: linePrice * (18 / 118)
                    const gstIncluded = Math.round((linePrice * 18) / 118);
                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3.5 px-4 font-bold text-slate-400">{idx + 1}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800">{item.product.name}</div>
                          <span className="text-[10px] text-slate-400 font-medium">{item.product.category}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-700">{item.quantity}</td>
                        <td className="py-3.5 px-4 text-right font-medium">₹{item.product.price}</td>
                        <td className="py-3.5 px-4 text-right text-slate-500 font-mono">₹{gstIncluded}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-slate-900">₹{linePrice}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total Calculations */}
            {(() => {
              const netSubtotal = invoice.subtotal - invoice.discountAmount;
              const cgstIncluded = (netSubtotal * 9) / 118;
              const sgstIncluded = (netSubtotal * 9) / 118;
              const grandTotal = netSubtotal + invoice.shippingFee;

              return (
                <div className="flex flex-col sm:flex-row justify-between items-start pt-4 border-t border-slate-200 gap-6">
                  <div className="max-w-xs text-xs text-slate-500 space-y-1">
                    <span className="font-bold text-[#0A2E4E] block uppercase tracking-wider text-[10px]">TERMS & CONDITIONS</span>
                    <p>1. Prices listed are inclusive of 18% GST (CGST 9% + SGST 9%).</p>
                    <p>2. Returns accepted within policy guidelines.</p>
                    <p>3. This is a computer generated tax invoice requiring no physical signature.</p>
                  </div>

                  <div className="w-full sm:w-80 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-700 font-bold">
                      <span>Item Total (incl. GST):</span>
                      <span>₹{invoice.subtotal}</span>
                    </div>

                    {invoice.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Coupon Discount ({invoice.appliedCoupon}):</span>
                        <span>-₹{invoice.discountAmount}</span>
                      </div>
                    )}

                    {/* Informational Tax Breakdown (Included, not added on top) */}
                    <div className="pl-3 py-1.5 space-y-1 bg-slate-50 rounded-lg border-l-2 border-[#0645B5]">
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>Of which CGST (9%):</span>
                        <span className="font-mono text-slate-700">₹{cgstIncluded.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>Of which SGST (9%):</span>
                        <span className="font-mono text-slate-700">₹{sgstIncluded.toFixed(2)}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 italic">
                        * Tax amounts are included within Item Total, not added on top.
                      </div>
                    </div>

                    <div className="flex justify-between text-slate-700 pt-1">
                      <span>Delivery Charges:</span>
                      <span className="font-bold text-slate-900">
                        {invoice.shippingFee === 0 ? "FREE" : `₹${invoice.shippingFee}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-base font-extrabold text-[#102A5C] pt-3 border-t-2 border-[#102A5C]">
                      <span>Grand Total:</span>
                      <span>₹{grandTotal}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Official Stamp & Sign */}
            <div className="pt-6 flex justify-between items-end border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <CheckCircle2 size={18} /> Tax Paid & Verified Digitally
              </div>
              <div className="text-right">
                <div className="h-12 w-28 border-2 border-emerald-600/60 rounded-xl mx-auto flex flex-col items-center justify-center text-[9px] font-extrabold text-emerald-800 uppercase tracking-widest bg-emerald-50/40 p-1 shadow-2xs mb-1">
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={11} className="text-emerald-600" />
                    <span>MATRIN</span>
                  </div>
                  <span className="text-[7px] text-emerald-600 font-semibold tracking-normal mt-0.5">DIGITAL SEAL</span>
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
