import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import {
  deleteStoreRecord,
  listStoreRecords,
  patchStoreRecord,
} from "@/lib/firebaseStore";

type SheetReview = { id: string | number; [key: string]: unknown };

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const { id } = await params;
    const updated = await patchStoreRecord<SheetReview>("Reviews", id, await req.json());
    return updated
      ? jsonResponse({ success: true, review: updated })
      : jsonResponse({ error: "Review not found" }, 404);
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to update review" },
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
    const reviews = await listStoreRecords<SheetReview>("Reviews");
    const review = reviews.find((entry) => String(entry.id) === id);
    if (!review) return jsonResponse({ error: "Review not found" }, 404);
    await deleteStoreRecord("Reviews", review.id);
    return jsonResponse({ success: true, message: "Review deleted" });
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to delete review" },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
