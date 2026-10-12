import { siteConfig } from "@/config/site";
import type { OrderStatus, PaymentMethod, PaymentStatus, StoreSettings } from "@/types/store";

export const WHATSAPP_NUMBER = siteConfig.socials.whatsapp.replace(/[^\d]/g, "");

export const STORE = {
  name: siteConfig.businessName,
  tagline: siteConfig.tagline,
  supportEmail: siteConfig.contact.email,
  phone: siteConfig.contact.phone,
  whatsappNumber: WHATSAPP_NUMBER,
  address: siteConfig.location.fullAddress,
  freeShippingThreshold: 350000,
  shippingFee: 5000,
  currency: "NGN",
} as const;

export const FREE_SHIPPING_THRESHOLD = STORE.freeShippingThreshold;
export const SHIPPING_FEE = STORE.shippingFee;

export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = Object.fromEntries(
  ORDER_STATUSES.map((s) => [s.value, s.label])
) as Record<OrderStatus, string>;

export const PAYMENT_METHODS: { value: PaymentMethod; label: string; hint: string }[] = [
  { value: "whatsapp", label: "Order via WhatsApp", hint: "We reply with payment details" },
];

export const PAYMENT_STATUSES: PaymentStatus[] = ["PENDING", "PAID", "FAILED", "REFUNDED"];

export const ADMIN_PASSWORD_ENV = "ADMIN_PASSWORD";
export const ADMIN_SESSION_SECRET_ENV = "ADMIN_SESSION_SECRET";

/** Client-side flag set only when the secret code is entered in the search bar. */
export const ADMIN_ACCESS_FLAG = "debby_admin_open";

/** Fallback identity used until the admin updates the store's contact details from Settings. */
export const DEFAULT_SETTINGS: StoreSettings = {
  name: STORE.name,
  tagline: STORE.tagline,
  supportEmail: STORE.supportEmail,
  phone: STORE.phone,
  whatsappNumber: STORE.whatsappNumber,
  address: siteConfig.location.fullAddress,
  currency: "NGN",
  facebook: siteConfig.socials.facebook,
  instagram: siteConfig.socials.instagram,
  tiktok: siteConfig.socials.tiktok,
};
