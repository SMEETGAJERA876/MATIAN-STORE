export interface SalesDataPoint {
  label: string; // e.g., "Mon", "Jan", "2025"
  revenue: number;
  orders: number;
  unitsSold: number;
}

export type SalesTimeframe = "weekly" | "monthly" | "yearly";

export interface SalesAnalytics {
  weekly: SalesDataPoint[];
  monthly: SalesDataPoint[];
  yearly: SalesDataPoint[];
  summary: {
    totalRevenue: number;
    totalOrders: number;
    activeCustomers: number;
    averageOrderValue: number;
    topCategory: string;
  };
}
