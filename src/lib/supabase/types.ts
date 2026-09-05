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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
