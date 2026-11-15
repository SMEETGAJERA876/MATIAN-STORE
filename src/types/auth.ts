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
  authProvider?: string;
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
  googleLinkPending: boolean;
  openAuthModal: (initialTab?: "login" | "register") => void;
  closeAuthModal: () => void;
  login: (email: string, password: string, expectedRole: "ADMIN" | "CUSTOMER" | "AUTO") => Promise<boolean> | boolean;
  loginWithGoogle: () => Promise<boolean>;
  completeGoogleLink: (email: string, password: string) => Promise<boolean>;
  cancelGoogleLink: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean> | boolean;
  resetPassword: (email: string) => Promise<boolean>;
  logout: (redirectTo?: string) => Promise<void> | void;
}
