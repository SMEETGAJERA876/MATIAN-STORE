import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore, initialCoupons } from "@/lib/inMemoryStore";
import { listOrSeedStoreRecords, upsertStoreRecord } from "@/lib/firebaseStore";

export async function GET() {
  try {
    return jsonResponse(
      await listOrSeedStoreRecords("Coupons", [
        ...inMemoryStore.coupons,
        ...initialCoupons.filter(
          (initial) => !inMemoryStore.coupons.some((coupon) => coupon.id === initial.id)
        ),
      ])
    );
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to load coupons" },
      503
    );
  }
}

export async function POST(req: Request) {
  const auth = await getAuthFromReq(req);
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
    const created = await upsertStoreRecord("Coupons", couponData);
    return jsonResponse({ success: true, coupon: created }, 201);
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to create coupon" },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
