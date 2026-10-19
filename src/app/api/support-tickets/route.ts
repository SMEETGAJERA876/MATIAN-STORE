import { getAuthFromReq, jsonResponse } from "@/lib/auth";
import { listSupportTickets, createSupportTicket } from "@/lib/supportTicketsStore";

// Admin-only: these records hold customer PII (email, phone, message), unlike
// the public product/review endpoints.
export async function GET(req: Request) {
  const auth = await getAuthFromReq(req);
  if (!auth || auth.role !== "ADMIN") {
    return jsonResponse({ error: "Forbidden: Admin privileges required" }, 403);
  }

  try {
    return jsonResponse(await listSupportTickets());
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Failed to load support tickets:", error.message);
    return jsonResponse({ error: error.message || "Failed to load support tickets" }, 500);
  }
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

    const created = await createSupportTicket(ticketData);
    return jsonResponse({ success: true, ticket: created }, 201);
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Failed to save contact message:", error.message);
    return jsonResponse({ error: "Could not send your message right now. Please email us at carematrin@gmail.com." }, 500);
  }
}

export async function OPTIONS() {
  return jsonResponse({}, 200);
}
