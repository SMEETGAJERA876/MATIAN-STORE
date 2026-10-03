import { connectToDatabase } from "@/lib/db";
import { SupportTicketModel } from "@/models/SupportTicket";
import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore } from "@/lib/inMemoryStore";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const db = await connectToDatabase();
    if (db) {
      const updated = await SupportTicketModel.findOneAndUpdate({ id }, { $set: body }, { new: true });
      if (updated) return jsonResponse({ success: true, ticket: updated });
      return jsonResponse({ error: "Ticket not found" }, 404);
    }

    const index = inMemoryStore.supportTickets.findIndex((t) => t.id === id);
    if (index === -1) return jsonResponse({ error: "Ticket not found" }, 404);
    inMemoryStore.supportTickets[index] = { ...inMemoryStore.supportTickets[index], ...body };
    return jsonResponse({ success: true, ticket: inMemoryStore.supportTickets[index] });
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

    const db = await connectToDatabase();
    if (db) {
      await SupportTicketModel.deleteOne({ id });
      return jsonResponse({ success: true });
    }

    inMemoryStore.supportTickets = inMemoryStore.supportTickets.filter((t) => t.id !== id);
    return jsonResponse({ success: true });
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to delete ticket" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
