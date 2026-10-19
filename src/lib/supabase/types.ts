export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: "ADMIN" | "CUSTOMER";
          status: "Active" | "Blocked";
          total_orders: number;
          total_spent: number;
          created_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          email: string;
          role?: "ADMIN" | "CUSTOMER";
          status?: "Active" | "Blocked";
          total_orders?: number;
          total_spent?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: "ADMIN" | "CUSTOMER";
          status?: "Active" | "Blocked";
          total_orders?: number;
          total_spent?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      support_tickets: {
        Row: {
          id: string;
          ticket_number: string;
          subject: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          message: string;
          priority: "Urgent" | "High" | "Medium" | "Low";
          status: "Open" | "In Progress" | "Resolved" | "Closed";
          category: "Billing" | "Shipping" | "Product Issue" | "General";
          created_at: string;
        };
        Insert: {
          id: string;
          ticket_number: string;
          subject: string;
          customer_name: string;
          customer_email: string;
          customer_phone?: string | null;
          message: string;
          priority?: "Urgent" | "High" | "Medium" | "Low";
          status?: "Open" | "In Progress" | "Resolved" | "Closed";
          category?: "Billing" | "Shipping" | "Product Issue" | "General";
          created_at?: string;
        };
        Update: {
          subject?: string;
          priority?: "Urgent" | "High" | "Medium" | "Low";
          status?: "Open" | "In Progress" | "Resolved" | "Closed";
          category?: "Billing" | "Shipping" | "Product Issue" | "General";
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
