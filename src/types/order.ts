import { CartItem } from "@/types/product";

export type PaymentMethod = "upi" | "card" | "netbanking" | "cod";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderInvoice {
  id: string;
  invoiceNumber: string;
  orderDate: string;
  dueDate: string;
  customer: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  appliedCoupon?: string;
  shippingFee: number;
  taxAmount: number; // GST 18%
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "Paid" | "Pending" | "Cash on Delivery" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";
  transactionId?: string;
}
