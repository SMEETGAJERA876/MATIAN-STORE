import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  id: string;
  invoiceNumber: string;
  orderDate: string;
  dueDate?: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    houseFlatNo?: string;
    streetArea?: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
    addressType?: "Home" | "Office" | "Other";
  };
  items: Array<{
    product: {
      id: number;
      name: string;
      price: number;
      image: string;
      category: string;
    };
    quantity: number;
  }>;
  subtotal: number;
  discountAmount: number;
  appliedCoupon?: string;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: "Paid" | "Pending" | "Cash on Delivery" | "Failed";
  orderStatus: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  transactionId?: string;
}

const OrderSchema = new Schema<IOrder>(
  {
    id: { type: String, required: true, unique: true },
    invoiceNumber: { type: String, required: true, unique: true },
    orderDate: { type: String, default: () => new Date().toISOString().split("T")[0] },
    dueDate: { type: String },
    customer: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      houseFlatNo: { type: String, default: "" },
      streetArea: { type: String, default: "" },
      addressLine: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: "Maharashtra" },
      pincode: { type: String, required: true },
      addressType: { type: String, enum: ["Home", "Office", "Other"], default: "Home" },
    },
    items: [
      {
        product: {
          id: Number,
          name: String,
          price: Number,
          image: String,
          category: String,
        },
        quantity: Number,
      },
    ],
    subtotal: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    appliedCoupon: { type: String },
    shippingFee: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: "upi" },
    paymentStatus: { type: String, default: "Paid" },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    transactionId: { type: String },
  },
  { timestamps: true }
);

export const OrderModel: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
