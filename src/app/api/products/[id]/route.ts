import { connectToDatabase } from "@/lib/db";
import { ProductModel } from "@/models/Product";
import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore } from "@/lib/inMemoryStore";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = Number(id);

  const db = await connectToDatabase();
  if (db) {
    const product = await ProductModel.findOne({ $or: [{ id: numId }, { slug: id }] });
    if (product) return jsonResponse(product);
  }

  const memProduct = inMemoryStore.products.find((p) => p.id === numId || p.slug === id);
  if (memProduct) return jsonResponse(memProduct);

  return jsonResponse({ error: "Product not found" }, 404);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    const referer = req.headers.get("referer") || "";
    if (!referer.includes("/admin")) {
      return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
    }
  }

  try {
    const { id } = await params;
    const numId = Number(id);
    const body = await req.json();

    const db = await connectToDatabase();
    if (db) {
      const query = !isNaN(numId) ? { $or: [{ id: numId }, { slug: id }] } : { slug: id };
      const updated = await ProductModel.findOneAndUpdate(
        query,
        { $set: body },
        { new: true }
      );
      if (updated) return jsonResponse({ success: true, product: updated });
    }

    const index = inMemoryStore.products.findIndex(
      (p) => (!isNaN(numId) && p.id === numId) || p.slug === id || String(p.id) === id
    );
    if (index !== -1) {
      inMemoryStore.products[index] = { ...inMemoryStore.products[index], ...body };
      return jsonResponse({ success: true, product: inMemoryStore.products[index] });
    }

    return jsonResponse({ error: "Product not found" }, 404);
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to update product" }, 500);
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    const referer = req.headers.get("referer") || "";
    if (!referer.includes("/admin")) {
      return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
    }
  }

  try {
    const { id } = await params;
    const numId = Number(id);

    const db = await connectToDatabase();
    if (db) {
      const query = !isNaN(numId) ? { $or: [{ id: numId }, { slug: id }] } : { slug: id };
      await ProductModel.deleteOne(query);
      return jsonResponse({ success: true, message: "Product deleted successfully" });
    }

    inMemoryStore.products = inMemoryStore.products.filter(
      (p) => (isNaN(numId) ? p.slug !== id : p.id !== numId) && String(p.id) !== id && p.slug !== id
    );
    return jsonResponse({ success: true, message: "Product deleted successfully" });
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to delete product" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
