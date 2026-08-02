import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  id: string;
  productId: number;
  productName: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  comment: string;
  date: string;
  status: "Approved" | "Pending" | "Flagged";
  adminResponse?: string;
}

const ReviewSchema = new Schema<IReview>(
  {
    id: { type: String, required: true, unique: true },
    productId: { type: Number, required: true },
    productName: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: String, default: () => new Date().toISOString().split("T")[0] },
    status: { type: String, enum: ["Approved", "Pending", "Flagged"], default: "Pending" },
    adminResponse: { type: String },
  },
  { timestamps: true }
);

export const ReviewModel: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
