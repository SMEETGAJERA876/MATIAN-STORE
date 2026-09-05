import { connectToDatabase } from "@/lib/db";
import { CouponModel } from "@/models/Coupon";
import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore, initialCoupons } from "@/lib/inMemoryStore";

export async function GET() {
  const db = await connectToDatabase();
  if (db) {
    const count = await CouponModel.countDocuments();
    if (count === 0) {
      await CouponModel.insertMany(initialCoupons);
    }
    const coupons = await CouponModel.find().sort({ createdAt: -1 });
    return jsonResponse(coupons);
  }

  return jsonResponse(inMemoryStore.coupons);
}

export async function POST(req: Request) {
  const auth = getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const body = await req.json();
    const couponData = {
      id: body.id || `cpn_${Date.now()}`,
      code: String(body.code).toUpperCase().trim(),
      description: body.description || "",
      discountType: body.discountType || "percentage",
      discountValue: Number(body.discountValue),
      minSpend: Number(body.minSpend || 0),
      maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : undefined,
      usageCount: 0,
      usageLimit: body.usageLimit ? Number(body.usageLimit) : 500,
      validFrom: body.validFrom || new Date().toISOString().split("T")[0],
      validUntil: body.validUntil || "2026-12-31",
      isActive: body.isActive !== undefined ? body.isActive : true,
    };

    const db = await connectToDatabase();
    if (db) {
      const created = await CouponModel.create(couponData);
      return jsonResponse({ success: true, coupon: created }, 201);
    }

    inMemoryStore.coupons.unshift(couponData as unknown as (typeof inMemoryStore.coupons)[0]);
    return jsonResponse({ success: true, coupon: couponData }, 201);
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to create coupon" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
