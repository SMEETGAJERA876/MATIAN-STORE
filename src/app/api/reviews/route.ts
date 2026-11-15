import { jsonResponse } from "@/lib/auth";
import { inMemoryStore, initialReviews } from "@/lib/inMemoryStore";
import {
  listOrSeedStoreRecords,
  upsertStoreRecord,
} from "@/lib/firebaseStore";

type SheetReview = {
  id: string | number;
  productId: number;
  [key: string]: unknown;
};

export async function GET(req: Request) {
  try {
    const productId = new URL(req.url).searchParams.get("productId");
    let reviews = await listOrSeedStoreRecords<SheetReview>(
      "Reviews",
      [...inMemoryStore.reviews, ...initialReviews]
    );
    if (productId) {
      reviews = reviews.filter((review) => Number(review.productId) === Number(productId));
    }
    return jsonResponse(reviews.sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))));
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to load reviews" },
      503
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const reviewData = {
      id: body.id || `rev_${Date.now()}`,
      productId: Number(body.productId),
      productName: body.productName || "Cleaning Product",
      customerName: body.customerName || "Verified Customer",
      customerEmail: body.customerEmail,
      rating: Number(body.rating),
      comment: body.comment,
      date: body.date || new Date().toISOString().split("T")[0],
      status: body.status || "Pending",
    };
    const created = await upsertStoreRecord("Reviews", reviewData);
    return jsonResponse({ success: true, review: created }, 201);
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to submit review" },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
