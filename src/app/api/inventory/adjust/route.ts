import { connectToDatabase } from "@/lib/db";
import { ProductModel } from "@/models/Product";
import { InventoryLogModel } from "@/models/InventoryLog";
import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore } from "@/lib/inMemoryStore";

export async function POST(req: Request) {
  const auth = getAuthFromReq(req);
  if (auth && auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const body = await req.json();
    const { productId, productIdentifier, quantityToAdd, reason, performedBy } = body;

    const qty = Number(quantityToAdd);
    if (!qty) {
      return jsonResponse({ error: "Quantity is required" }, 400);
    }

    const db = await connectToDatabase();

    if (db) {
      const query = productId ? { id: Number(productId) } : { name: { $regex: new RegExp(productIdentifier, "i") } };
      const product = await ProductModel.findOne(query);

      if (!product) {
        return jsonResponse({ error: "Product not found" }, 404);
      }

      const previousStock = product.stock || 0;
      const newStock = Math.max(0, previousStock + qty);
      product.stock = newStock;
      product.inStock = newStock > 0;
      await product.save();

      const log = await InventoryLogModel.create({
        id: `inv_log_${Date.now()}`,
        productId: product.id,
        productName: product.name,
        previousStock,
        newStock,
        changeAmount: qty,
        reason: reason || "Manual Adjustment",
        adjustedBy: performedBy || auth?.name || "Admin",
        timestamp: new Date().toISOString(),
      });

      return jsonResponse({ success: true, product, log });
    }

    // Fallback Memory Store
    const memProduct = inMemoryStore.products.find(
      (p) => p.id === Number(productId) || (productIdentifier && p.name.toLowerCase().includes(productIdentifier.toLowerCase()))
    );

    if (!memProduct) {
      return jsonResponse({ error: "Product not found" }, 404);
    }

    const previousStock = memProduct.stock;
    const newStock = Math.max(0, previousStock + qty);
    memProduct.stock = newStock;
    memProduct.inStock = newStock > 0;

    const memLog = {
      id: `inv_log_${Date.now()}`,
      productId: memProduct.id,
      productName: memProduct.name,
      previousStock,
      newStock,
      changeAmount: qty,
      reason: reason || "Manual Adjustment",
      adjustedBy: performedBy || auth?.name || "Admin",
      timestamp: new Date().toISOString(),
    };

    inMemoryStore.inventoryLogs.unshift(memLog);

    return jsonResponse({ success: true, product: memProduct, log: memLog });
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Stock adjustment failed" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
