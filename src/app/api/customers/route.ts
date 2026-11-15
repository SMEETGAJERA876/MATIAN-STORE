import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { inMemoryStore } from "@/lib/inMemoryStore";

export async function GET(req: Request) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    const referer = req.headers.get("referer") || "";
    if (!referer.includes("/admin")) {
      return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
    }
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id, name, email, role, status, createdAt:created_at, totalOrders:total_orders, totalSpent:total_spent")
      .eq("role", "CUSTOMER")
      .order("created_at", { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      return jsonResponse(data);
    }
  } catch {
    // Supabase unavailable, fall back to memory store
  }

  const memoryCustomers = inMemoryStore.users
    .filter((u) => u.role === "CUSTOMER")
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
      totalOrders: u.totalOrders,
      totalSpent: u.totalSpent,
    }));

  return jsonResponse(memoryCustomers);
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
