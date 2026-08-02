import { connectToDatabase } from "@/lib/db";
import { CategoryModel } from "@/models/Category";
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
      const updated = await CategoryModel.findOneAndUpdate({ id }, { $set: body }, { new: true });
      if (updated) return jsonResponse({ success: true, category: updated });
    }

    const index = inMemoryStore.categories.findIndex((c) => c.id === id);
    if (index !== -1) {
      inMemoryStore.categories[index] = { ...inMemoryStore.categories[index], ...body };
      return jsonResponse({ success: true, category: inMemoryStore.categories[index] });
    }

    return jsonResponse({ error: "Category not found" }, 404);
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to update category" }, 500);
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
      await CategoryModel.deleteOne({ id });
      return jsonResponse({ success: true, message: "Category deleted" });
    }

    inMemoryStore.categories = inMemoryStore.categories.filter((c) => c.id !== id);
    return jsonResponse({ success: true, message: "Category deleted" });
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to delete category" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
