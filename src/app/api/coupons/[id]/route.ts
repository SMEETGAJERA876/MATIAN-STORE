import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import {
  deleteStoreRecord,
  listStoreRecords,
  patchStoreRecord,
} from "@/lib/firebaseStore";

type SheetCoupon = {
  id: string | number;
  [key: string]: unknown;
};

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const { id } = await params;
    const updated = await patchStoreRecord<SheetCoupon>("Coupons", id, await req.json());
    return updated
      ? jsonResponse({ success: true, coupon: updated })
      : jsonResponse({ error: "Coupon not found" }, 404);
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to update coupon" },
      503
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const { id } = await params;
    const coupons = await listStoreRecords<SheetCoupon>("Coupons");
    const coupon = coupons.find((entry) => String(entry.id) === id);
    if (!coupon) return jsonResponse({ error: "Coupon not found" }, 404);
    await deleteStoreRecord("Coupons", coupon.id);
    return jsonResponse({ success: true, message: "Coupon deleted" });
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to delete coupon" },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
