import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICoupon extends Document {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minSpend: number;
  maxDiscount?: number;
  usageCount: number;
  usageLimit?: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

const CouponSchema = new Schema<ICoupon>(
  {
    id: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    description: { type: String, default: "" },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true },
    minSpend: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    usageCount: { type: Number, default: 0 },
    usageLimit: { type: Number },
    validFrom: { type: String, required: true },
    validUntil: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CouponModel: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);
