import type { Product } from "@/types";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type PaymentMethod = "card" | "bank_transfer" | "cash_on_delivery" | "whatsapp";

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  image: string;
  size: string;
};

export type CustomerInfo = {
  name: string;
  phone: string;
  email: string;
};

export type DeliveryInfo = {
  address: string;
  city: string;
  state: string;
  country: string;
  instructions?: string;
};

export type Order = {
  id: string;
  number: string;
  createdAt: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  customer: CustomerInfo;
  /** Customer account the order belongs to (set server-side from the signed-in session). */
  customerId?: string;
  delivery: DeliveryInfo;
};

export type OrderInput = Omit<
  Order,
  "id" | "number" | "createdAt" | "status" | "paymentStatus"
>;

export type SavedAddress = {
  address: string;
  city: string;
  state: string;
  country: string;
};

export type PublicCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** Default delivery address saved on the account (offered at checkout). */
  address?: SavedAddress;
};

export type Customer = PublicCustomer & {
  passwordHash: string;
  cart: SavedCartItem[];
  createdAt: string;
};

export type SavedCartItem = {
  productId: string;
  size: string;
  quantity: number;
};

export type CustomerRegisterInput = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

export type Subscriber = {
  id: string;
  email: string;
  createdAt: string;
};

export type StoreSettings = {
  name: string;
  tagline: string;
  supportEmail: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  currency: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  /** Stored override of the ADMIN_PASSWORD env var. Set from the admin Settings tab. */
  adminPassword?: string;
};

export type AdminNotification = {
  id: string;
  type: "order" | "complaint";
  title: string;
  body: string;
  target: "orders";
  createdAt: string;
  read: boolean;
};

export type DashboardStats = {
  totalRevenue: number;
  paidRevenue: number;
  orderCount: number;
  customerCount: number;
  productCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  pendingOrderCount: number;
  revenueByDay: { day: string; revenue: number; orders: number }[];
  ordersByStatus: { status: string; count: number }[];
  revenueByCategory: { category: string; revenue: number }[];
  topProducts: { id: string; name: string; image: string; units: number; revenue: number }[];
  recentOrders: Order[];
};

/** A product row as stored/returned by the server. Identical shape to the storefront `Product`. */
export type StoredProduct = Product;
