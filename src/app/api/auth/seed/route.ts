import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import {
  inMemoryStore,
  initialCategories,
  initialCoupons,
  initialNotifications,
  initialOrders,
  initialReviews,
  initialSettings,
  initialSupportTickets,
} from "@/lib/inMemoryStore";
import { listOrSeedStoreRecords } from "@/lib/firebaseStore";

async function seedFirebase(req: Request) {
  const auth = await getAuthFromReq(req);
  if (auth?.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    await Promise.all([
      listOrSeedStoreRecords("Products", inMemoryStore.products),
      listOrSeedStoreRecords("Categories", initialCategories),
      listOrSeedStoreRecords("Coupons", initialCoupons),
      listOrSeedStoreRecords("Reviews", initialReviews),
      listOrSeedStoreRecords("Orders", initialOrders),
      listOrSeedStoreRecords("SupportTickets", initialSupportTickets),
      listOrSeedStoreRecords("Notifications", initialNotifications),
      listOrSeedStoreRecords("Settings", [{ ...initialSettings, id: "settings_main" }]),
    ]);
    return jsonResponse({ success: true, message: "Firebase collections initialized." });
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Firebase initialization failed" },
      503
    );
  }
}

export async function POST(req: Request) {
  return seedFirebase(req);
}

export async function GET(req: Request) {
  return seedFirebase(req);
}
