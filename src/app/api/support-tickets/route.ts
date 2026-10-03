import { connectToDatabase } from "@/lib/db";
import { SupportTicketModel } from "@/models/SupportTicket";
import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { inMemoryStore } from "@/lib/inMemoryStore";

// Admin-only: these records hold customer PII (email, phone, message), unlike
// the public product/review endpoints.
export async function GET(req: Request) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  const db = await connectToDatabase();
  if (db) {
    const tickets = await SupportTicketModel.find().sort({ createdAt: -1 });
    return jsonResponse(tickets);
  }

  return jsonResponse(inMemoryStore.supportTickets);
}

// Public: the storefront Contact Us form submits here without being logged in.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const customerName = (body.customerName || "").trim();
    const customerEmail = (body.customerEmail || "").trim();
    const message = (body.message || "").trim();
    const subject = (body.subject || "General Inquiry").trim();

    if (!customerName || !customerEmail || !message) {
      return jsonResponse({ error: "Name, email, and message are required" }, 400);
    }

    const ticketData = {
      id: `ticket_${Date.now()}`,
      ticketNumber: "#TICK-" + Math.floor(1000 + Math.random() * 9000),
      subject,
      customerName,
      customerEmail,
      customerPhone: (body.customerPhone || "").trim() || undefined,
      message,
      priority: "Medium" as const,
      status: "Open" as const,
      category: "General" as const,
      createdAt: new Date().toISOString(),
    };

    const db = await connectToDatabase();
    if (db) {
      const created = await SupportTicketModel.create(ticketData);
      return jsonResponse({ success: true, ticket: created }, 201);
    }

    inMemoryStore.supportTickets.unshift(ticketData as unknown as (typeof inMemoryStore.supportTickets)[0]);
    return jsonResponse({ success: true, ticket: ticketData }, 201);
  } catch (err: unknown) {
    const error = err as Error;
    return jsonResponse({ error: error.message || "Failed to submit message" }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
