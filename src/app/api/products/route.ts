import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore } from "@/lib/inMemoryStore";
import { listOrSeedStoreRecords, upsertStoreRecord } from "@/lib/firebaseStore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    let products = await listOrSeedStoreRecords("Products", inMemoryStore.products);

    if (category && category !== "All") {
      products = products.filter((product) =>
        product.category?.toLowerCase().includes(category.toLowerCase())
      );
    }
    if (search) {
      products = products.filter((product) =>
        product.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return jsonResponse(products);
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to load products from Firebase" },
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
    const productData = {
      ...body,
      id: Number(body.id) || Date.now(),
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      price: Number(body.price),
      originalPrice: body.originalPrice || body.discountPrice
        ? Number(body.originalPrice || body.discountPrice)
        : Math.round(Number(body.price) * 1.3),
      rating: body.rating || 5,
      reviewsCount: body.reviewsCount || 0,
      image: body.image || "/images/products/detergent.webp",
      images: body.images || body.galleryImages || [body.image || "/images/products/detergent.webp"],
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

    const created = await upsertStoreRecord("Products", productData);
    return jsonResponse({ success: true, product: created }, 201);
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to create product" },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
