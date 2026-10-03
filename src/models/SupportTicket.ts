import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISupportTicket extends Document {
  id: string;
  ticketNumber: string;
  subject: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  message: string;
  priority: "Urgent" | "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  category: "Billing" | "Shipping" | "Product Issue" | "General";
  createdAt: string;
}

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    id: { type: String, required: true, unique: true },
    ticketNumber: { type: String, required: true },
    subject: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String },
    message: { type: String, required: true },
    priority: { type: String, enum: ["Urgent", "High", "Medium", "Low"], default: "Medium" },
    status: { type: String, enum: ["Open", "In Progress", "Resolved", "Closed"], default: "Open" },
    category: { type: String, enum: ["Billing", "Shipping", "Product Issue", "General"], default: "General" },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const SupportTicketModel: Model<ISupportTicket> =
  mongoose.models.SupportTicket || mongoose.model<ISupportTicket>("SupportTicket", SupportTicketSchema);
