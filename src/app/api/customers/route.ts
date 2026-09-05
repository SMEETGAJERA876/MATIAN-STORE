import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, name, email, role, status, createdAt:created_at, totalOrders:total_orders, totalSpent:total_spent")
    .eq("role", "CUSTOMER")
    .order("created_at", { ascending: false });

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse(data);
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
