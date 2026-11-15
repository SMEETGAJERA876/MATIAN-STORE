import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import {
  deleteStoreRecord,
  listStoreRecords,
  patchStoreRecord,
} from "@/lib/firebaseStore";

type SheetTicket = { id: string | number; [key: string]: unknown };

function isAdmin(auth: Awaited<ReturnType<typeof getAuthFromReq>>) {
  return auth?.role === "ADMIN";
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(await getAuthFromReq(req))) {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const { id } = await params;
    const updated = await patchStoreRecord<SheetTicket>(
      "SupportTickets",
      id,
      await req.json()
    );
    return updated
      ? jsonResponse({ success: true, ticket: updated })
      : jsonResponse({ error: "Ticket not found" }, 404);
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to update ticket" },
      503
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(await getAuthFromReq(req))) {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const { id } = await params;
    const tickets = await listStoreRecords<SheetTicket>("SupportTickets");
    const ticket = tickets.find((entry) => String(entry.id) === id);
    if (!ticket) return jsonResponse({ error: "Ticket not found" }, 404);
    await deleteStoreRecord("SupportTickets", ticket.id);
    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to delete ticket" },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
