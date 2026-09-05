import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const { id } = await params;
    const body = await req.json();

    // Only allow known, safe fields through to the profiles table.
    const update: ProfileUpdate = {};
    if (body.name !== undefined) update.name = body.name;
    if (body.status !== undefined) update.status = body.status;
    if (body.role !== undefined) update.role = body.role;

    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update(update)
      .eq("id", id)
      .select("id, name, email, role, status, createdAt:created_at, totalOrders:total_orders, totalSpent:total_spent")
      .single();

    if (error || !data) {
      return jsonResponse({ error: error?.message || "Customer not found" }, 404);
    }

    return jsonResponse({ success: true, customer: data });
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to update customer" }, 500);
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const { id } = await params;
    const supabaseAdmin = getSupabaseAdmin();
    // Deleting the auth user cascades to the profiles row (see the SQL schema).
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) {
      return jsonResponse({ error: error.message }, 500);
    }

    return jsonResponse({ success: true, message: "Customer deleted" });
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to delete customer" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
