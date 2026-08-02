import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICategory extends Document {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  productCount: number;
  isActive: boolean;
  status: "Active" | "Hidden";
}

const CategorySchema = new Schema<ICategory>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    iconName: { type: String, default: "Sparkles" },
    productCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: ["Active", "Hidden"], default: "Active" },
  },
  { timestamps: true }
);

export const CategoryModel: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
