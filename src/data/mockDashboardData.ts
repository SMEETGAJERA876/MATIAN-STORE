// MOCK DATA — replace with real API/database queries before launch. These values do not reflect real store activity.

export interface MockOrder {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  itemsCount: number;
  totalAmount: number;
  status: "Completed" | "Processing" | "Pending" | "Shipped" | "Cancelled";
  date: string;
  paymentMethod: string;
}

export const MOCK_DASHBOARD_STATS = {
  totalSales: 245680,
  totalOrders: 1248,
  totalCustomers: 5432,
  averageOrderValue: 778,
  activeProducts: 6,
  conversionRate: "3.4%",
};

export const MOCK_SALES_ANALYTICS = {
  weekly: [
    { label: "Mon", revenue: 14500, orders: 18, unitsSold: 42 },
    { label: "Tue", revenue: 18900, orders: 24, unitsSold: 58 },
    { label: "Wed", revenue: 12400, orders: 15, unitsSold: 36 },
    { label: "Thu", revenue: 22100, orders: 29, unitsSold: 71 },
    { label: "Fri", revenue: 28500, orders: 38, unitsSold: 89 },
    { label: "Sat", revenue: 34200, orders: 46, unitsSold: 112 },
    { label: "Sun", revenue: 31000, orders: 41, unitsSold: 98 },
  ],
  monthly: [
    { label: "Jan", revenue: 320000, orders: 410, unitsSold: 1020 },
    { label: "Feb", revenue: 380000, orders: 490, unitsSold: 1250 },
    { label: "Mar", revenue: 420000, orders: 540, unitsSold: 1380 },
    { label: "Apr", revenue: 390000, orders: 510, unitsSold: 1290 },
    { label: "May", revenue: 480000, orders: 620, unitsSold: 1560 },
    { label: "Jun", revenue: 530000, orders: 690, unitsSold: 1740 },
    { label: "Jul", revenue: 610000, orders: 780, unitsSold: 1980 },
    { label: "Aug", revenue: 590000, orders: 750, unitsSold: 1890 },
    { label: "Sep", revenue: 640000, orders: 810, unitsSold: 2050 },
    { label: "Oct", revenue: 710000, orders: 900, unitsSold: 2310 },
    { label: "Nov", revenue: 790000, orders: 1010, unitsSold: 2580 },
    { label: "Dec", revenue: 890000, orders: 1150, unitsSold: 2920 },
  ],
  categoryBreakdown: [
    { category: "Laundry Care", percentage: 38, revenue: 93358 },
    { category: "Dishwashing", percentage: 26, revenue: 63876 },
    { category: "Surface Care", percentage: 21, revenue: 51592 },
    { category: "Toilet Care", percentage: 15, revenue: 36854 },
  ],
};

export const MOCK_RECENT_ORDERS: MockOrder[] = [
  {
    id: "ord_101",
    orderId: "INV-2026-8812",
    customerName: "Aarav Sharma",
    customerEmail: "aarav.sharma@example.com",
    itemsCount: 3,
    totalAmount: 1249,
    status: "Completed",
    date: "01 Aug 2026",
    paymentMethod: "UPI Instant Transfer",
  },
  {
    id: "ord_102",
    orderId: "INV-2026-7641",
    customerName: "Priya Patel",
    customerEmail: "priya.patel@example.com",
    itemsCount: 2,
    totalAmount: 648,
    status: "Processing",
    date: "01 Aug 2026",
    paymentMethod: "Credit Card",
  },
  {
    id: "ord_103",
    orderId: "INV-2026-5590",
    customerName: "Rohan Verma",
    customerEmail: "rohan.v@example.com",
    itemsCount: 1,
    totalAmount: 399,
    status: "Completed",
    date: "31 Jul 2026",
    paymentMethod: "Cash on Delivery",
  },
  {
    id: "ord_104",
    orderId: "INV-2026-4211",
    customerName: "Sneha Reddy",
    customerEmail: "sneha.reddy@example.com",
    itemsCount: 4,
    totalAmount: 1890,
    status: "Shipped",
    date: "30 Jul 2026",
    paymentMethod: "UPI Instant Transfer",
  },
];
