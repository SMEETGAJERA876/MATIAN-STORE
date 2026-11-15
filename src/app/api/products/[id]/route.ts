import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import {
  deleteStoreRecord,
  listStoreRecords,
  patchStoreRecord,
} from "@/lib/firebaseStore";

type SheetProduct = {
  id: string | number;
  name: string;
  slug?: string;
  [key: string]: unknown;
};

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const products = await listStoreRecords<SheetProduct>("Products");
    const product = products.find((entry) => String(entry.id) === id || entry.slug === id);
    return product
      ? jsonResponse(product)
      : jsonResponse({ error: "Product not found" }, 404);
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to load product" },
      503
    );
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const products = await listStoreRecords<SheetProduct>("Products");
    const existing = products.find((entry) => String(entry.id) === id || entry.slug === id);
    if (!existing) return jsonResponse({ error: "Product not found" }, 404);

    const updated = await patchStoreRecord<SheetProduct>("Products", existing.id, body);
    return updated
      ? jsonResponse({ success: true, product: updated })
      : jsonResponse({ error: "Product not found" }, 404);
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to update product" },
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
    const products = await listStoreRecords<SheetProduct>("Products");
    const product = products.find((entry) => String(entry.id) === id || entry.slug === id);
    if (!product) return jsonResponse({ error: "Product not found" }, 404);
    await deleteStoreRecord("Products", product.id);
    return jsonResponse({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to delete product" },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
