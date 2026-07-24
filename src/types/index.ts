export type GenderCategory = "men" | "women" | "unisex";

export type FragranceFamily = "floral" | "woody" | "oriental" | "fresh" | "citrus" | "gourmand";

export interface ProductSize {
  size: "30ml" | "50ml" | "100ml" | "200ml";
  price: number; // in Naira (₦)
  originalPrice?: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  tagline: string;
  description: string;
  category: GenderCategory;
  fragranceFamily: FragranceFamily;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  sizes: ProductSize[];
  images: string[];
  rating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  stock: number;
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  selectedSize: ProductSize;
  quantity: number;
}

export interface FilterState {
  category: GenderCategory | "all";
  fragranceFamily: FragranceFamily | "all";
  minPrice: number;
  maxPrice: number;
  searchQuery: string;
  sortBy: "featured" | "price-asc" | "price-desc" | "rating" | "newest";
}

export interface AdminProductOverride {
  id: string;
  customImage?: string; // Base64 or URL uploaded by Admin
  customName?: string;
  customPrice?: number;
  customStock?: number;
}
