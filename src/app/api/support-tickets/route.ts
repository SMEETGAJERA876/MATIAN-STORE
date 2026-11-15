import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore, initialSupportTickets } from "@/lib/inMemoryStore";
import {
  listOrSeedStoreRecords,
  upsertStoreRecord,
} from "@/lib/firebaseStore";

type SheetTicket = { id: string | number; [key: string]: unknown };

export async function GET(req: Request) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    const tickets = await listOrSeedStoreRecords<SheetTicket>(
      "SupportTickets",
      [...inMemoryStore.supportTickets, ...initialSupportTickets]
    );
    return jsonResponse(tickets.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || ""))));
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to load support tickets" },
      503
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const isAdmin = (await getAuthFromReq(req))?.role === "ADMIN";
    const customerName = (body.customerName || "").trim();
    const customerEmail = (body.customerEmail || "").trim();
    const message = (body.message || "").trim();
    const subject = (body.subject || "General Inquiry").trim();

    if (!customerName || !customerEmail || !message) {
      return jsonResponse({ error: "Name, email, and message are required" }, 400);
    }

    const ticketData = {
      id: isAdmin && body.id ? body.id : `ticket_${Date.now()}`,
      ticketNumber: isAdmin && body.ticketNumber
        ? body.ticketNumber
        : `#TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject,
      customerName,
      customerEmail,
      customerPhone: (body.customerPhone || "").trim() || undefined,
      message,
      priority: isAdmin ? body.priority || "Medium" : "Medium",
      status: isAdmin ? body.status || "Open" : "Open",
      category: isAdmin ? body.category || "General" : "General",
      createdAt: new Date().toISOString(),
    };

    const created = await upsertStoreRecord("SupportTickets", ticketData);
    return jsonResponse({ success: true, ticket: created }, 201);
  } catch (err) {
    return jsonResponse(
      { error: err instanceof Error ? err.message : "Failed to submit message" },
      503
    );
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
