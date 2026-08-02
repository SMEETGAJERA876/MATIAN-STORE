import { connectToDatabase } from "@/lib/db";
import { ProductModel } from "@/models/Product";
import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore } from "@/lib/inMemoryStore";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  const db = await connectToDatabase();
  if (db) {
    let query: Record<string, unknown> = {};
    if (category && category !== "All") {
      query.category = { $regex: new RegExp(category, "i") };
    }
    if (search) {
      query.name = { $regex: new RegExp(search, "i") };
    }

    const count = await ProductModel.countDocuments();
    if (count === 0) {
      await ProductModel.insertMany(inMemoryStore.products);
    }

    const dbProducts = await ProductModel.find(query).sort({ id: 1 });
    return jsonResponse(dbProducts);
  }

  // In-memory fallback
  let list = [...inMemoryStore.products];
  if (category && category !== "All") {
    list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (search) {
    list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  return jsonResponse(list);
}

export async function POST(req: Request) {
  const auth = getAuthFromReq(req);
  if (auth && auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const body = await req.json();
    const db = await connectToDatabase();

    const newId = body.id || Date.now();
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const productData = {
      id: newId,
      name: body.name,
      slug,
      price: Number(body.price),
      originalPrice: body.originalPrice ? Number(body.originalPrice) : Math.round(Number(body.price) * 1.3),
      rating: body.rating || 5.0,
      reviewsCount: body.reviewsCount || 0,
      image: body.image || "/images/products/detergent.webp",
      images: body.images || [body.image || "/images/products/detergent.webp"],
      category: body.category || "General",
      badge: body.badge,
      inStock: body.stock !== undefined ? Number(body.stock) > 0 : true,
      stock: body.stock !== undefined ? Number(body.stock) : 100,
      description: body.description || "",
      features: body.features || [],
      specifications: body.specifications || {},
      status: body.status || "Published",
      salesCount: 0,
    };

    if (db) {
      const created = await ProductModel.create(productData);
      return jsonResponse({ success: true, product: created }, 201);
    }

    // In-memory update
    inMemoryStore.products.unshift(productData as unknown as (typeof inMemoryStore.products)[0]);
    return jsonResponse({ success: true, product: productData }, 201);
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to create product" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
