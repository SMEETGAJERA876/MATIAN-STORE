import mongoose, { Schema, Document, Model } from "mongoose";

export interface INotification extends Document {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "order" | "inventory" | "system" | "customer";
  isRead: boolean;
  link?: string;
}

const NotificationSchema = new Schema<INotification>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    timestamp: { type: String, default: () => new Date().toISOString() },
    type: { type: String, enum: ["order", "inventory", "system", "customer"], default: "system" },
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

export const NotificationModel: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
