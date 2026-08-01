export type DiscountType = "percentage" | "fixed";

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number; // e.g. 15 for 15% or 100 for ₹100 off
  couponLimit: number; // max total redemptions allowed
  timesUsed: number; // current redemptions
  minOrderAmount: number; // minimum order total required
  isActive: boolean;
  expiryDate?: string;
  createdAt: string;
}
