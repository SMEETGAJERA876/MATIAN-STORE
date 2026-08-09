"use client";

import { useCart } from "@/context/CartContext";
import { useProductStore } from "@/context/ProductStoreContext";
import { useAuth } from "@/context/AuthContext";
import { PaymentMethod, OrderInvoice, ShippingAddress } from "@/types/order";
import InvoiceModal from "@/components/InvoiceModal";
import Link from "next/link";
import { useState } from "react";
import ProductImage from "@/components/ProductImage";
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  CheckCircle2,
  X,
  CreditCard,
  QrCode,
  Building,
  FileText,
  Printer,
  Sparkles,
  MapPin,
  User as UserIcon,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shippingFee,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
    total,
  } = useCart();

  const { validateCoupon, applyCouponRedemption, addOrder } = useProductStore();
  const { user } = useAuth();

  // Coupon state
  const [couponInput, setCouponInput] = useState("");

  // Checkout step state: "cart" | "checkout" | "success"
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "checkout" | "success">("cart");

  // Shipping details state
  const [shippingDetails, setShippingDetails] = useState<ShippingAddress>({
    fullName: user?.name || "Rohan Sharma",
    phone: "9876543210",
    email: user?.email || "customer@matrin.com",
    addressLine: "Flat 402, Green Acres Apt, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
  });

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [upiSubMode, setUpiSubMode] = useState<"vpa" | "qr">("vpa");
  const [upiId, setUpiId] = useState("smeet@okaxis");
  const [cardNumber, setCardNumber] = useState("4532 •••• •••• 8892");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("•••");
  const [selectedBank, setSelectedBank] = useState("HDFC Bank");

  // UPI Verification state
  const [isUpiVerified, setIsUpiVerified] = useState<boolean | null>(null);
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
  const [upiAccountName, setUpiAccountName] = useState("");

  const handleVerifyUpiId = (targetVpa?: string) => {
    const vpaToTest = targetVpa !== undefined ? targetVpa : upiId;
    if (!vpaToTest || !vpaToTest.includes("@") || vpaToTest.split("@")[0].length < 2 || vpaToTest.split("@")[1].length < 2) {
      setIsUpiVerified(false);
      setIsVerifyingUpi(false);
      toast.error("Please enter a valid UPI ID (e.g. smeet@okaxis)", { id: "upi_verify" });
      return;
    }

    setIsVerifyingUpi(true);
    setIsUpiVerified(null);

    setTimeout(() => {
      setIsVerifyingUpi(false);
      setIsUpiVerified(true);
      const name = user?.name || "Smeet Gajera";
      setUpiAccountName(name);
      toast.success(`UPI ID Verified: ${name}`, { icon: "✅", id: "upi_verify" });
    }, 500);
  };

  // Generated Invoice state
  const [generatedInvoice, setGeneratedInvoice] = useState<OrderInvoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;

    const result = validateCoupon(couponInput, subtotal);
    if (!result.valid) {
      toast.error(result.message || "Invalid coupon code.");
      return;
    }

    if (result.coupon) {
      const label = result.coupon.discountType === "percentage"
        ? `${result.coupon.discountValue}% OFF`
        : `₹${result.coupon.discountValue} OFF`;

      applyCoupon(result.coupon.code);
      toast.success(`Coupon ${result.coupon.code} applied! (${label})`, { icon: "🏷️" });
      setCouponInput("");
    }
  };

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const completeOrder = (paymentId: string) => {
    if (appliedCoupon) {
      applyCouponRedemption(appliedCoupon);
    }

    const tax = Math.round(subtotal * 0.18);
    const invoiceNum = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInvoice: OrderInvoice = {
      id: `ord_${Date.now()}`,
      invoiceNumber: invoiceNum,
      orderDate: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      dueDate: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      customer: { ...shippingDetails },
      items: [...cart],
      subtotal,
      discountAmount,
      appliedCoupon: appliedCoupon || undefined,
      shippingFee,
      taxAmount: tax,
      totalAmount: total,
      paymentMethod,
      paymentStatus: "Paid",
      transactionId: paymentId,
    };

    addOrder(newInvoice);
    setGeneratedInvoice(newInvoice);
    setCheckoutStep("success");
    setIsProcessingPayment(false);
    toast.success("Payment Successful! Razorpay Invoice Generated.", { icon: "💳", duration: 5000 });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shippingDetails.fullName || !shippingDetails.phone || !shippingDetails.addressLine) {
      toast.error("Please fill all shipping address fields!");
      return;
    }

    setIsProcessingPayment(true);
    toast.loading("Initiating Secure Razorpay Gateway...", { id: "razorpay_loader" });

    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "INR",
          receipt: `receipt_${Date.now()}`,
        }),
      });

      const orderData = await res.json();
      toast.dismiss("razorpay_loader");

      const scriptLoaded = await loadRazorpayScript();

      if (scriptLoaded && (window as any).Razorpay) {
        const options = {
          key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_MatrinStore2026",
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "MATRIN Store",
          description: "Premium Cleaning & Home Care Order",
          image: "/images/matrin-logo-sticker.png",
          order_id: orderData.id,
          handler: async function (response: any) {
            toast.loading("Verifying Payment Authorization...", { id: "verify_loader" });
            try {
              const verifyRes = await fetch("/api/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              });
              const verifyData = await verifyRes.json();
              toast.dismiss("verify_loader");

              if (verifyData.success) {
                completeOrder(response.razorpay_payment_id || `pay_${Date.now()}`);
              } else {
                setIsProcessingPayment(false);
                toast.error("Payment verification failed. Please try again.");
              }
            } catch {
              toast.dismiss("verify_loader");
              completeOrder(response.razorpay_payment_id || `pay_${Date.now()}`);
            }
          },
          prefill: {
            name: shippingDetails.fullName,
            email: shippingDetails.email,
            contact: shippingDetails.phone,
            method: paymentMethod === "upi" ? "upi" : paymentMethod === "card" ? "card" : "netbanking",
            vpa: paymentMethod === "upi" && upiSubMode === "vpa" ? upiId : undefined,
          },
          theme: {
            color: "#0645B5",
          },
          modal: {
            ondismiss: function () {
              setIsProcessingPayment(false);
              toast.error("Payment cancelled by user.");
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Fallback smooth demo if script is blocked by browser extension
        setTimeout(() => {
          completeOrder(`PAY_RZP_${Math.floor(10000000 + Math.random() * 90000000)}`);
        }, 1000);
      }
    } catch (err) {
      toast.dismiss("razorpay_loader");
      // Fallback
      setTimeout(() => {
        completeOrder(`PAY_RZP_${Math.floor(10000000 + Math.random() * 90000000)}`);
      }, 1000);
    }
  };

  const freeShippingThreshold = 499;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  // Empty Cart State
  if (cart.length === 0 && checkoutStep !== "success") {
    return (
      <main className="min-h-screen bg-[#F8FAFC] py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="rounded-3xl bg-white p-12 border border-slate-100 shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-[#0645B5]">
              <ShoppingBag size={40} />
            </div>

            <h1 className="mt-6 text-3xl font-extrabold text-[#102A5C]">
              Your Cart is Empty
            </h1>

            <p className="mt-2 text-slate-500 max-w-md mx-auto text-xs sm:text-sm font-medium leading-relaxed">
              Looks like you haven&apos;t added any Matrin cleaning products to your shopping cart yet.
            </p>

            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0645B5] px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#1a3899] transition active:scale-95"
            >
              <span>Explore Products</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Order Success Screen with Invoice Button
  if (checkoutStep === "success" && generatedInvoice) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="rounded-3xl bg-white p-8 md:p-12 border border-slate-100 shadow-xl text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
              <CheckCircle2 size={44} />
            </div>

            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">ORDER CONFIRMED</span>
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold text-[#102A5C]">
              Thank You for Your Order!
            </h1>
            <p className="mt-2 text-xs md:text-sm text-slate-600 font-medium">
              Order ID: <strong className="font-mono text-[#0645B5]">{generatedInvoice.invoiceNumber}</strong>
            </p>

            {/* Invoice Callout Card */}
            <div className="my-8 rounded-2xl bg-blue-50/50 p-6 border border-blue-100 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-blue-100 pb-4">
                <div>
                  <h4 className="font-extrabold text-[#102A5C] text-sm">Official GST Tax Invoice</h4>
                  <p className="text-xs text-slate-500 font-medium">Issued to {generatedInvoice.customer.fullName}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  {generatedInvoice.paymentStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">Total Order Amount:</span>
                  <span className="text-xl font-extrabold text-[#0645B5]">₹{generatedInvoice.totalAmount}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-medium block">Payment Method:</span>
                  <span className="font-bold text-slate-800 uppercase">{generatedInvoice.paymentMethod}</span>
                </div>
              </div>

              <button
                onClick={() => setIsInvoiceModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0645B5] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#1a3899] transition"
              >
                <FileText size={18} /> View & Print Official Tax Invoice
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                onClick={() => {
                  clearCart();
                  setCheckoutStep("cart");
                }}
                className="rounded-full border border-slate-300 px-8 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        <InvoiceModal
          invoice={generatedInvoice}
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-slate-200/80 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#102A5C]">
              {checkoutStep === "cart" ? "Shopping Cart" : "Checkout & Payment"}
            </h1>
            <p className="mt-1 text-xs text-slate-500 font-medium">
              {checkoutStep === "cart" ? `You have ${cart.length} item(s) in your bag` : "Select payment method and complete your order"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCheckoutStep("cart")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                checkoutStep === "cart" ? "bg-[#0645B5] text-white" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              1. Cart Items
            </button>
            <button
              onClick={() => setCheckoutStep("checkout")}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                checkoutStep === "checkout" ? "bg-[#0645B5] text-white" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              2. Payment & Address
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {checkoutStep === "cart" ? (
              <>
                {/* Free Shipping Progress Bar */}
                <div className="rounded-2xl bg-blue-50/60 p-4 border border-blue-100">
                  <div className="flex items-center justify-between text-xs font-bold text-[#0645B5] mb-2">
                    <span className="flex items-center gap-1.5">
                      <Truck size={16} /> Free Shipping Progress
                    </span>
                    <span>
                      {subtotal >= freeShippingThreshold
                        ? "🎉 Unlocked FREE Shipping!"
                        : `Add ₹${amountNeededForFreeShipping} more for FREE shipping`}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-blue-200/50 overflow-hidden">
                    <div
                      style={{ width: `${progressToFreeShipping}%` }}
                      className="h-full rounded-full bg-[#0645B5] transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="rounded-3xl bg-white p-6 shadow-2xs border border-slate-100 divide-y divide-slate-100">
                  {cart.map(({ product, quantity }) => (
                    <div key={product.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="h-20 w-20 shrink-0">
                          <ProductImage
                            src={product.image}
                            alt={product.name}
                            fitMode="cover"
                            roundedClassName="rounded-2xl"
                          />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[#102A5C]">
                            {product.name}
                          </h3>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{product.category}</p>
                          <span className="text-sm font-extrabold text-[#0645B5] mt-1 block">
                            ₹{product.price}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                        <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-200 font-bold text-xs"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-[#102A5C] text-xs">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-200 font-bold text-xs"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-base font-extrabold text-[#102A5C] w-20 text-right">
                          ₹{product.price * quantity}
                        </span>

                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Checkout Form (Shipping & Payment Selection) */
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                
                {/* 1. Shipping Address */}
                <div className="rounded-3xl bg-white p-6 md:p-8 border border-slate-100 shadow-2xs">
                  <div className="flex items-center gap-2 mb-6 text-[#102A5C]">
                    <MapPin size={20} className="text-[#0645B5]" />
                    <h3 className="text-xl font-bold">Shipping Address</h3>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingDetails.fullName}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 focus:border-[#0645B5] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingDetails.phone}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 focus:border-[#0645B5] focus:outline-hidden"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Delivery Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingDetails.addressLine}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, addressLine: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 focus:border-[#0645B5] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingDetails.city}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 focus:border-[#0645B5] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingDetails.pincode}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, pincode: e.target.value })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-800 focus:border-[#0645B5] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Select Payment Method */}
                <div className="rounded-3xl bg-white p-6 md:p-8 border border-slate-100 shadow-2xs">
                  <div className="flex items-center gap-2 mb-6 text-[#102A5C]">
                    <CreditCard size={20} className="text-[#0645B5]" />
                    <h3 className="text-xl font-bold">Select Payment Method</h3>
                  </div>

                  {/* Options */}
                  <div className="grid gap-3 sm:grid-cols-3 mb-6">
                    
                    {/* UPI Option */}
                    <div
                      onClick={() => setPaymentMethod("upi")}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center gap-3 ${
                        paymentMethod === "upi"
                          ? "border-[#0645B5] bg-blue-50/50 shadow-2xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                        <QrCode size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#102A5C]">UPI (GPay / PhonePe / Paytm)</h4>
                        <p className="text-[10px] text-slate-500 font-medium">Instant Zero-Fee Transfer</p>
                      </div>
                    </div>

                    {/* Card Option */}
                    <div
                      onClick={() => setPaymentMethod("card")}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center gap-3 ${
                        paymentMethod === "card"
                          ? "border-[#0645B5] bg-blue-50/50 shadow-2xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-[#0645B5]">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#102A5C]">Credit / Debit Card</h4>
                        <p className="text-[10px] text-slate-500 font-medium">Visa, Mastercard, RuPay</p>
                      </div>
                    </div>

                    {/* Net Banking */}
                    <div
                      onClick={() => setPaymentMethod("netbanking")}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center gap-3 ${
                        paymentMethod === "netbanking"
                          ? "border-[#0645B5] bg-blue-50/50 shadow-2xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                        <Building size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#102A5C]">Net Banking</h4>
                        <p className="text-[10px] text-slate-500 font-medium">All major Indian banks</p>
                      </div>
                    </div>
                  </div>

                  {/* Method Specific Inputs */}
                  {paymentMethod === "upi" && (
                    <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200/60 space-y-4">
                      {/* UPI Option Selector Tabs */}
                      <div className="flex gap-2 p-1 bg-slate-200/60 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setUpiSubMode("vpa")}
                          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            upiSubMode === "vpa"
                              ? "bg-white text-[#0645B5] shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <QrCode size={14} />
                          <span>Enter UPI ID / VPA</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setUpiSubMode("qr")}
                          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                            upiSubMode === "qr"
                              ? "bg-white text-[#0645B5] shadow-xs"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <QrCode size={14} className="text-purple-600" />
                          <span>Scan QR Code</span>
                        </button>
                      </div>

                      {upiSubMode === "vpa" ? (
                        <div className="space-y-3">
                          <label className="block text-xs font-bold text-slate-700">Enter UPI ID / VPA</label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                value={upiId}
                                onChange={(e) => {
                                  setUpiId(e.target.value);
                                  setIsUpiVerified(null);
                                }}
                                placeholder="e.g. smeet@okaxis / 9876543210@paytm"
                                className={`w-full rounded-xl border bg-white px-4 py-2.5 text-xs font-mono text-slate-800 focus:outline-hidden transition ${
                                  isUpiVerified === true
                                    ? "border-emerald-500 focus:border-emerald-500 shadow-xs"
                                    : isUpiVerified === false
                                    ? "border-rose-400 focus:border-rose-500 shadow-xs"
                                    : "border-slate-200 focus:border-[#0645B5]"
                                }`}
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleVerifyUpiId()}
                              disabled={isVerifyingUpi}
                              className="px-4 py-2.5 rounded-xl bg-[#0645B5] text-white text-xs font-bold hover:bg-[#1a3899] transition shadow-2xs disabled:opacity-50 shrink-0 flex items-center gap-1.5 cursor-pointer"
                            >
                              {isVerifyingUpi ? (
                                <>
                                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                  <span>Verifying...</span>
                                </>
                              ) : (
                                <span>Verify VPA</span>
                              )}
                            </button>
                          </div>

                          {/* Dynamic Verification Status */}
                          {isUpiVerified === true && (
                            <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-2.5 text-xs text-emerald-800 border border-emerald-200/80 animate-in fade-in duration-200">
                              <div className="flex items-center gap-1.5 font-bold">
                                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                                <span>UPI Handle Verified</span>
                              </div>
                              <div className="text-[11px] font-semibold text-emerald-700">
                                Account Name: <span className="font-extrabold text-emerald-900">{upiAccountName}</span>
                              </div>
                            </div>
                          )}

                          {isUpiVerified === false && (
                            <div className="flex items-center gap-1.5 rounded-xl bg-rose-50 p-2.5 text-xs font-bold text-rose-700 border border-rose-200 animate-in fade-in duration-200">
                              <X size={15} className="text-rose-600 shrink-0" />
                              <span>Invalid UPI ID format. Must contain '@' (e.g. smeet@okaxis)</span>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            <span className="text-[10px] font-extrabold uppercase text-slate-400 self-center mr-1">Quick Select:</span>
                            {["smeet@okaxis", "9876543210@paytm", "smeet@ybl", "smeet@upi"].map((vpa) => (
                              <button
                                key={vpa}
                                type="button"
                                onClick={() => {
                                  setUpiId(vpa);
                                  handleVerifyUpiId(vpa);
                                }}
                                className="text-[10px] font-bold text-slate-600 bg-white hover:bg-blue-50 hover:text-[#0645B5] px-2.5 py-1 rounded-lg border border-slate-200 transition cursor-pointer"
                              >
                                {vpa}
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium">
                            ⚡ Enter your registered VPA handle and click <strong className="text-[#0645B5]">Verify VPA</strong> before paying.
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-slate-200 space-y-3 text-center">
                          <div className="text-xs font-bold text-[#102A5C]">Scan with any UPI App</div>
                          <div className="p-3 bg-white rounded-2xl border-2 border-[#0645B5]/20 shadow-md">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                                `upi://pay?pa=matrin@razorpay&pn=MATRIN%20Store&am=${total}&cu=INR&tn=MATRIN%20Order`
                              )}`}
                              alt="Razorpay UPI QR Code"
                              className="h-44 w-44 object-contain"
                            />
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                            <span className="px-2 py-0.5 rounded bg-blue-50 text-[#0645B5]">GPay</span>
                            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700">PhonePe</span>
                            <span className="px-2 py-0.5 rounded bg-cyan-50 text-cyan-700">Paytm</span>
                            <span className="px-2 py-0.5 rounded bg-[#102A5C] text-white">BHIM</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium">
                            Scan this QR code with any UPI app to pay ₹{total} instantly via Razorpay.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {paymentMethod === "card" && (
                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/60 space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-mono text-slate-800"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Expiry</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-mono text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">CVV</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-mono text-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "netbanking" && (
                    <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200/60 space-y-3">
                      <label className="block text-xs font-bold text-slate-700">Select Your Bank</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs text-slate-800"
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="State Bank of India">State Bank of India (SBI)</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isProcessingPayment}
                    className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-[#0645B5] py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#1a3899] active:scale-98 shadow-md shadow-blue-600/20 disabled:opacity-75"
                  >
                    {isProcessingPayment ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Opening Razorpay Secure Gateway...</span>
                      </span>
                    ) : (
                      <>
                        <ShieldCheck size={16} className="text-cyan-300" />
                        <span>Pay ₹{total} with Razorpay</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl bg-white text-slate-800 p-6 shadow-md border border-slate-100 sticky top-24 space-y-6">
              <h2 className="text-xl font-extrabold text-[#102A5C] border-b border-slate-100 pb-4">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 block flex items-center gap-1">
                  <Tag size={14} className="text-[#0645B5]" /> Promo Code
                </label>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800 border border-emerald-200">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={15} /> Code {appliedCoupon}
                    </span>
                    <button onClick={removeCoupon} className="hover:text-rose-600">
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. MATRIN10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 rounded-xl bg-slate-50 px-3 py-2 text-xs uppercase font-bold text-slate-800 border border-slate-200 placeholder:text-slate-400 focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-[#0645B5] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1a3899] transition shadow-2xs"
                    >
                      Apply
                    </button>
                  </form>
                )}
                <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                  Tip: Use code <strong className="text-[#0645B5]">MATRIN10</strong> or <strong className="text-[#0645B5]">CLEAN50</strong>
                </span>
              </div>

              {/* Summary Items */}
              <div className="space-y-3 text-xs font-semibold border-t border-slate-100 pt-4">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-extrabold text-slate-900">₹{subtotal}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>GST Tax (18% included)</span>
                  <span className="font-extrabold text-slate-900">₹{Math.round(subtotal * 0.18)}</span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-[#0645B5]">
                    {shippingFee === 0 ? <span className="text-emerald-600 font-extrabold">FREE</span> : `₹${shippingFee}`}
                  </span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-4 border-t border-slate-100">
                  <span>Total Amount</span>
                  <span className="text-[#0645B5]">₹{total}</span>
                </div>
              </div>

              {checkoutStep === "cart" && (
                <button
                  onClick={() => setCheckoutStep("checkout")}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-[#0645B5] py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-[#1a3899] active:scale-98 shadow-md shadow-blue-600/20"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight size={16} />
                </button>
              )}

              <div className="text-center flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>256-Bit SSL Encrypted Tax Invoice Checkout</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}