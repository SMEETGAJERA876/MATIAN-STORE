import { connectToDatabase } from "@/lib/db";
import { ReviewModel } from "@/models/Review";
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
      const updated = await ReviewModel.findOneAndUpdate({ id }, { $set: body }, { new: true });
      if (updated) return jsonResponse({ success: true, review: updated });
    }

    const index = inMemoryStore.reviews.findIndex((r) => r.id === id);
    if (index !== -1) {
      inMemoryStore.reviews[index] = { ...inMemoryStore.reviews[index], ...body };
      return jsonResponse({ success: true, review: inMemoryStore.reviews[index] });
    }

    return jsonResponse({ error: "Review not found" }, 404);
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to update review" }, 500);
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
      await ReviewModel.deleteOne({ id });
      return jsonResponse({ success: true, message: "Review deleted" });
    }

    inMemoryStore.reviews = inMemoryStore.reviews.filter((r) => r.id !== id);
    return jsonResponse({ success: true, message: "Review deleted" });
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to delete review" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
