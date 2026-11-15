import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import {
  deleteStoreRecord,
  listStoreRecords,
  patchStoreRecord,
} from "@/lib/firebaseStore";

type SheetCategory = {
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
    const updated = await patchStoreRecord<SheetCategory>(
      "Categories",
      id,
      await req.json()
    );
    return updated
      ? jsonResponse({ success: true, category: updated })
      : jsonResponse({ error: "Category not found" }, 404);
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to update category" },
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
    const categories = await listStoreRecords<SheetCategory>("Categories");
    const category = categories.find((entry) => String(entry.id) === id);
    if (!category) return jsonResponse({ error: "Category not found" }, 404);
    await deleteStoreRecord("Categories", category.id);
    return jsonResponse({ success: true, message: "Category deleted" });
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to delete category" },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
