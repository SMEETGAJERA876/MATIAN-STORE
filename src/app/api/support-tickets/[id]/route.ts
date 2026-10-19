import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { updateSupportTicket, deleteSupportTicket } from "@/lib/supportTicketsStore";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await updateSupportTicket(id, body);
    if (!updated) return jsonResponse({ error: "Ticket not found" }, 404);
    return jsonResponse({ success: true, ticket: updated });
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to update ticket" }, 500);
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const { id } = await params;

    await deleteSupportTicket(id);
    return jsonResponse({ success: true });
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to delete ticket" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
