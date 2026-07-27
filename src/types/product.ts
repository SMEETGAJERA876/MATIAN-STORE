export type ProductCategory =
  | "All"
  | "Laundry Care"
  | "Dish Care"
  | "Floor Care"
  | "Toilet & Bath"
  | "Multi-Surface";

export type ProductSpec = {
  volume: string;
  scent: string;
  shelfLife: string;
  origin: string;
  formulation: string;
  usageInstructions: string;
};

export type Review = {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
};

export type Product = {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
  oldPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  image: string;
  galleryImages: string[];
  description: string;
  features: string[];
  specifications: ProductSpec;
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  tags: string[];
  reviews: Review[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};
