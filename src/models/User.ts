import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "ADMIN" | "CUSTOMER";
  avatar?: string;
  phone?: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  status: "Active" | "Blocked";
}

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "CUSTOMER"], default: "CUSTOMER" },
    avatar: { type: String },
    phone: { type: String },
    createdAt: { type: String, default: () => new Date().toISOString().split("T")[0] },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Blocked"], default: "Active" },
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
