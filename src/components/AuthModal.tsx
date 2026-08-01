import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProductStore } from "@/context/ProductStoreContext";
import InvoiceModal from "@/components/InvoiceModal";
import { OrderInvoice } from "@/types/order";
import { X, Lock, Mail, User as UserIcon, Shield, ArrowRight, Sparkles, FileText, ShoppingBag, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, register, quickAdminLogin, quickUserLogin, user, isAdmin, logout } = useAuth();
  const { products } = useProductStore();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Invoice state inside Profile
  const [selectedUserInvoice, setSelectedUserInvoice] = useState<OrderInvoice | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, password);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    register(name, email, password);
  };

  // Generate sample customer orders for invoice viewing in profile
  const userOrders = [
    {
      id: "ord_user_1",
      invoiceNumber: "INV-2026-9481",
      date: "2026-07-28",
      total: 947,
      itemsCount: 3,
      status: "Paid",
      paymentMethod: "upi" as const,
      items: [
        { product: products[0] || { id: 1, name: "Matrin Premium Liquid Detergent", price: 349, category: "Laundry Care" }, quantity: 2 },
        { product: products[1] || { id: 2, name: "Matrin Germ Defense Floor Cleaner", price: 249, category: "Floor Care" }, quantity: 1 },
      ],
    },
    {
      id: "ord_user_2",
      invoiceNumber: "INV-2026-8104",
      date: "2026-06-15",
      total: 598,
      itemsCount: 2,
      status: "Paid",
      paymentMethod: "card" as const,
      items: [
        { product: products[2] || { id: 3, name: "Matrin Ultra Dishwash Gel", price: 299, category: "Dish Care" }, quantity: 2 },
      ],
    },
  ];

  const handleViewInvoice = (order: typeof userOrders[0]) => {
    const sub = order.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const invoiceData: OrderInvoice = {
      id: order.id,
      invoiceNumber: order.invoiceNumber,
      orderDate: order.date,
      dueDate: order.date,
      customer: {
        fullName: user?.name || "Matrin Customer",
        email: user?.email || "customer@matrin.com",
        phone: "9876543210",
        addressLine: "Flat 402, Green Acres Apt, Bandra West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400050",
      },
      items: order.items as any,
      subtotal: sub,
      discountAmount: 50,
      appliedCoupon: "CLEAN50",
      shippingFee: 0,
      taxAmount: Math.round(sub * 0.18),
      totalAmount: sub - 50,
      paymentMethod: order.paymentMethod,
      paymentStatus: "Paid",
      transactionId: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
    };

    setSelectedUserInvoice(invoiceData);
    setIsInvoiceOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAuthModal}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FAF7F2] border border-[#EFEAE4] shadow-2xl"
        >
          {/* Top Decorative Header */}
          <div className="bg-[#0A2E4E] p-6 text-white text-center relative sticky top-0 z-20">
            <button
              onClick={closeAuthModal}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-1 text-slate-200 hover:bg-white/20 transition-colors"
            >
              <X size={18} />
            </button>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-300">
              <Shield size={24} />
            </div>
            <h3 className="font-serif text-2xl font-normal tracking-wide">
              {user ? `Account Profile` : tab === "login" ? "Welcome Back" : "Create Account"}
            </h3>
            <p className="mt-1 text-xs text-slate-300 font-light">
              {user ? user.email : "Access your Matrin account & orders"}
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6">
            {user ? (
              <div className="space-y-6 text-center">
                
                {/* Profile Card */}
                <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-[#F5F1EB] border border-[#EFEAE4]">
                  <div className="h-16 w-16 rounded-full bg-[#0A2E4E] text-white flex items-center justify-center font-bold text-xl uppercase shadow-md">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0A2E4E] text-base">{user.name}</h4>
                    <p className="text-xs text-slate-500">{user.email}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-blue-100 text-blue-800 border border-blue-200'}`}>
                      Role: {user.role.toUpperCase()}
                    </span>
                  </div>
                </div>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={closeAuthModal}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:bg-amber-700 transition"
                  >
                    <Sparkles size={16} /> Open Admin Dashboard
                  </Link>
                )}

                {/* My Orders & Tax Invoices Section */}
                <div className="text-left space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A2E4E] flex items-center gap-1.5">
                      <ShoppingBag size={14} /> My Orders & Tax Invoices
                    </h4>
                    <span className="text-[10px] text-slate-500 font-semibold">{userOrders.length} Orders</span>
                  </div>

                  <div className="space-y-2">
                    {userOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-3.5 rounded-2xl bg-white border border-[#EFEAE4] flex items-center justify-between shadow-2xs hover:border-[#0A2E4E]/30 transition"
                      >
                        <div>
                          <div className="font-mono font-bold text-xs text-[#0A2E4E]">{ord.invoiceNumber}</div>
                          <p className="text-[10px] text-slate-500">{ord.date} • ₹{ord.total} ({ord.itemsCount} items)</p>
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                            <CheckCircle2 size={10} /> Paid via {ord.paymentMethod.toUpperCase()}
                          </span>
                        </div>

                        <button
                          onClick={() => handleViewInvoice(ord)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0A2E4E] text-white text-[10px] font-bold hover:bg-[#13426B] transition shrink-0"
                        >
                          <FileText size={12} /> Tax Invoice
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    closeAuthModal();
                  }}
                  className="w-full py-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 font-semibold text-xs transition hover:bg-rose-100"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                {/* Tabs */}
                <div className="flex rounded-xl bg-[#EFEAE4] p-1 mb-6">
                  <button
                    onClick={() => setTab("login")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                      tab === "login"
                        ? "bg-white text-[#0A2E4E] shadow-xs"
                        : "text-slate-600 hover:text-[#0A2E4E]"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setTab("register")}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition ${
                      tab === "register"
                        ? "bg-white text-[#0A2E4E] shadow-xs"
                        : "text-slate-600 hover:text-[#0A2E4E]"
                    }`}
                  >
                    Register
                  </button>
                </div>

                {tab === "login" ? (
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input
                          type="email"
                          required
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#0A2E4E] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#0A2E4E] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-[#0A2E4E] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#13426B] transition flex items-center justify-center gap-2"
                    >
                      Sign In <ArrowRight size={14} />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input
                          type="text"
                          required
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#0A2E4E] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input
                          type="email"
                          required
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#0A2E4E] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-[#0A2E4E] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-[#0A2E4E] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#13426B] transition flex items-center justify-center gap-2"
                    >
                      Create Account <ArrowRight size={14} />
                    </button>
                  </form>
                )}

                {/* Quick Testing Login Shortcuts */}
                {process.env.NODE_ENV === "development" && (
                  <div className="mt-6 border-t border-[#EFEAE4] pt-4 space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                      Preset Login Credentials
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-left">
                      <button
                        type="button"
                        onClick={quickAdminLogin}
                        className="p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-[10px] hover:bg-amber-100 transition"
                      >
                        <span className="font-bold block">👑 Admin</span>
                        <span>Username: <strong>admin</strong></span><br/>
                        <span>Pass: <strong>ADMIN!@#$</strong></span>
                      </button>
                      <button
                        type="button"
                        onClick={quickUserLogin}
                        className="p-2 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 text-[10px] hover:bg-blue-100 transition"
                      >
                        <span className="font-bold block">👤 Customer</span>
                        <span>Username: <strong>user</strong></span><br/>
                        <span>Pass: <strong>USER!@#$</strong></span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>

        {/* Invoice Modal for Profile Orders */}
        <InvoiceModal
          invoice={selectedUserInvoice}
          isOpen={isInvoiceOpen}
          onClose={() => setIsInvoiceOpen(false)}
        />
      </div>
    </AnimatePresence>
  );
}
