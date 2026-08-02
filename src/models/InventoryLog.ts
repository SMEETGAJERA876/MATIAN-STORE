import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInventoryLog extends Document {
  id: string;
  productId: number;
  productName: string;
  previousStock: number;
  newStock: number;
  changeAmount: number;
  reason: string;
  adjustedBy: string;
  timestamp: string;
}

const InventoryLogSchema = new Schema<IInventoryLog>(
  {
    id: { type: String, required: true, unique: true },
    productId: { type: Number, required: true },
    productName: { type: String, required: true },
    previousStock: { type: Number, required: true },
    newStock: { type: Number, required: true },
    changeAmount: { type: Number, required: true },
    reason: { type: String, required: true },
    adjustedBy: { type: String, default: "Admin" },
    timestamp: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const InventoryLogModel: Model<IInventoryLog> =
  mongoose.models.InventoryLog || mongoose.model<IInventoryLog>("InventoryLog", InventoryLogSchema);
