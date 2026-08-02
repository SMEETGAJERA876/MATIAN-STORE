import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  category: string;
  badge?: string;
  inStock: boolean;
  stock: number;
  minStockLevel?: number;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  volume?: string;
  sku?: string;
  status: "Published" | "Draft" | "Out of Stock";
  salesCount: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number, default: 5.0 },
    reviewsCount: { type: Number, default: 0 },
    image: { type: String, required: true },
    images: [{ type: String }],
    category: { type: String, required: true },
    badge: { type: String },
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 100 },
    minStockLevel: { type: Number, default: 10 },
    description: { type: String, default: "" },
    features: [{ type: String }],
    specifications: { type: Map, of: String, default: {} },
    volume: { type: String },
    sku: { type: String },
    status: { type: String, enum: ["Published", "Draft", "Out of Stock"], default: "Published" },
    salesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ProductModel: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
