export type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  status: "Active" | "Inactive";
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoaded: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (initialTab?: "login" | "register") => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => boolean;
  quickAdminLogin: () => void;
  quickUserLogin: () => void;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}
