import { connectToDatabase } from "@/lib/db";
import { SupportTicketModel, ISupportTicket } from "@/models/SupportTicket";
import { inMemoryStore } from "@/lib/inMemoryStore";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

// Support tickets (including storefront Contact Us messages) must survive
// across serverless invocations, otherwise the admin panel never sees them.
// Storage priority: MongoDB (if MONGODB_URI is set) -> Supabase
// `support_tickets` table (see supabase-support-tickets-setup.sql) ->
// in-memory store (local development only; lost on every cold start).

export type SupportTicketData = Pick<
  ISupportTicket,
  | "id"
  | "ticketNumber"
  | "subject"
  | "customerName"
  | "customerEmail"
  | "customerPhone"
  | "message"
  | "priority"
  | "status"
  | "category"
  | "createdAt"
>;

type TicketRow = Database["public"]["Tables"]["support_tickets"]["Row"];
type TicketUpdate = Database["public"]["Tables"]["support_tickets"]["Update"];

const isSupabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);

const fromRow = (row: TicketRow): SupportTicketData => ({
  id: row.id,
  ticketNumber: row.ticket_number,
  subject: row.subject,
  customerName: row.customer_name,
  customerEmail: row.customer_email,
  customerPhone: row.customer_phone ?? undefined,
  message: row.message,
  priority: row.priority,
  status: row.status,
  category: row.category,
  createdAt: row.created_at,
});

const toRowUpdate = (updates: Partial<SupportTicketData>): TicketUpdate => {
  const row: TicketUpdate = {};
  if (updates.subject !== undefined) row.subject = updates.subject;
  if (updates.priority !== undefined) row.priority = updates.priority;
  if (updates.status !== undefined) row.status = updates.status;
  if (updates.category !== undefined) row.category = updates.category;
  return row;
};

const supabaseError = (message: string) =>
  new Error(
    `Support tickets storage error: ${message}. Run supabase-support-tickets-setup.sql in your Supabase SQL editor.`
  );

export async function listSupportTickets(): Promise<SupportTicketData[]> {
  const db = await connectToDatabase();
  if (db) {
    return SupportTicketModel.find().sort({ createdAt: -1 });
  }

  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdmin()
      .from("support_tickets")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw supabaseError(error.message);
    return (data ?? []).map(fromRow);
  }

  return inMemoryStore.supportTickets as unknown as SupportTicketData[];
}

export async function createSupportTicket(ticket: SupportTicketData): Promise<SupportTicketData> {
  const db = await connectToDatabase();
  if (db) {
    return SupportTicketModel.create(ticket);
  }

  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdmin()
      .from("support_tickets")
      .insert({
        id: ticket.id,
        ticket_number: ticket.ticketNumber,
        subject: ticket.subject,
        customer_name: ticket.customerName,
        customer_email: ticket.customerEmail,
        customer_phone: ticket.customerPhone ?? null,
        message: ticket.message,
        priority: ticket.priority,
        status: ticket.status,
        category: ticket.category,
        created_at: ticket.createdAt,
      })
      .select()
      .single();
    if (error) throw supabaseError(error.message);
    return fromRow(data);
  }

  inMemoryStore.supportTickets.unshift(ticket as unknown as (typeof inMemoryStore.supportTickets)[0]);
  return ticket;
}

export async function updateSupportTicket(
  id: string,
  updates: Partial<SupportTicketData>
): Promise<SupportTicketData | null> {
  const db = await connectToDatabase();
  if (db) {
    return SupportTicketModel.findOneAndUpdate({ id }, { $set: updates }, { new: true });
  }

  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdmin()
      .from("support_tickets")
      .update(toRowUpdate(updates))
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw supabaseError(error.message);
    return data ? fromRow(data) : null;
  }

  const index = inMemoryStore.supportTickets.findIndex((t) => t.id === id);
  if (index === -1) return null;
  inMemoryStore.supportTickets[index] = { ...inMemoryStore.supportTickets[index], ...updates };
  return inMemoryStore.supportTickets[index] as unknown as SupportTicketData;
}

export async function deleteSupportTicket(id: string): Promise<void> {
  const db = await connectToDatabase();
  if (db) {
    await SupportTicketModel.deleteOne({ id });
    return;
  }

  if (isSupabaseConfigured()) {
    const { error } = await getSupabaseAdmin().from("support_tickets").delete().eq("id", id);
    if (error) throw supabaseError(error.message);
    return;
  }

  inMemoryStore.supportTickets = inMemoryStore.supportTickets.filter((t) => t.id !== id);
}
