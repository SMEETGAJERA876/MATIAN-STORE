import { connectToDatabase } from "@/lib/db";
import { CouponModel } from "@/models/Coupon";
import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore } from "@/lib/inMemoryStore";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromReq(req);
  if (auth && auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const db = await connectToDatabase();
    if (db) {
      const updated = await CouponModel.findOneAndUpdate({ id }, { $set: body }, { new: true });
      if (updated) return jsonResponse({ success: true, coupon: updated });
    }

    const index = inMemoryStore.coupons.findIndex((c) => c.id === id);
    if (index !== -1) {
      inMemoryStore.coupons[index] = { ...inMemoryStore.coupons[index], ...body };
      return jsonResponse({ success: true, coupon: inMemoryStore.coupons[index] });
    }

    return jsonResponse({ error: "Coupon not found" }, 404);
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to update coupon" }, 500);
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthFromReq(req);
  if (auth && auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const { id } = await params;
    const db = await connectToDatabase();
    if (db) {
      await CouponModel.deleteOne({ id });
      return jsonResponse({ success: true, message: "Coupon deleted" });
    }

    inMemoryStore.coupons = inMemoryStore.coupons.filter((c) => c.id !== id);
    return jsonResponse({ success: true, message: "Coupon deleted" });
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to delete coupon" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
