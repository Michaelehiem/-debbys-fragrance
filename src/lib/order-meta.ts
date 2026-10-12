import type { OrderStatus } from "@/types/store";
import { ORDER_STATUS_LABEL } from "@/lib/constants";

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export type StatusTone = "sand" | "indigo" | "clay" | "success" | "muted";

export function orderStatusTone(status: OrderStatus): StatusTone {
  switch (status) {
    case "PENDING":
      return "sand";
    case "CONFIRMED":
      return "indigo";
    case "OUT_FOR_DELIVERY":
      return "clay";
    case "DELIVERED":
      return "success";
    case "CANCELLED":
      return "muted";
  }
}

export function paymentStatusTone(status: string): StatusTone {
  switch (status) {
    case "PAID":
      return "success";
    case "PENDING":
      return "sand";
    case "FAILED":
      return "clay";
    case "REFUNDED":
      return "muted";
    default:
      return "muted";
  }
}

export function orderStatusLabel(status: OrderStatus) {
  return ORDER_STATUS_LABEL[status];
}

export function paymentMethodLabel(method: string) {
  switch (method) {
    case "card":
      return "Card payment";
    case "bank_transfer":
      return "Bank transfer";
    case "cash_on_delivery":
      return "Cash on delivery";
    case "whatsapp":
      return "WhatsApp order";
    default:
      return method;
  }
}

/** Short human-friendly order number, e.g. DBF-1K2J9A. */
export function generateOrderNumber(): string {
  return `DBF-${Date.now().toString(36).toUpperCase()}${Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase()}`;
}

/**
 * High-entropy order id. The tracking URL (`/order/<id>`) is treated as a capability link,
 * so the id must be unguessable. 24 random bytes = 192 bits, rendered as 32 hex chars.
 */
export function generateOrderId(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
