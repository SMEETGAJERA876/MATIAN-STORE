export type UserRole = "ADMIN" | "CUSTOMER" | "admin" | "customer";

export interface JWTPayload {
  sub: string;
  email: string;
  role: UserRole;
  exp: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  totalOrders: number;
  totalSpent: number;
  status: "Active" | "Blocked" | "Inactive";
}

export interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoaded: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (initialTab?: "login" | "register") => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<boolean> | boolean;
  quickUserLogin: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean> | boolean;
  logout: () => void;
}
