import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISettings extends Document {
  siteTitle: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  freeShippingThreshold: number;
  flatShippingRate: number;
  taxRatePercentage: number;
  banners: Array<{
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    ctaText: string;
    ctaLink: string;
    isActive: boolean;
    position: number;
  }>;
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteTitle: { type: String, default: "MATRIN - Pure Cleaning, Better Living" },
    contactEmail: { type: String, default: "support@matrin.com" },
    contactPhone: { type: String, default: "+91 1800-200-8899" },
    currency: { type: String, default: "₹" },
    freeShippingThreshold: { type: Number, default: 499 },
    flatShippingRate: { type: Number, default: 49 },
    taxRatePercentage: { type: Number, default: 18 },
    banners: [
      {
        id: String,
        title: String,
        subtitle: String,
        imageUrl: String,
        ctaText: String,
        ctaLink: String,
        isActive: Boolean,
        position: Number,
      },
    ],
  },
  { timestamps: true }
);

export const SettingsModel: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);
