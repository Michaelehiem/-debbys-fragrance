import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { CUSTOMER_SESSION_COOKIE, verifyCustomerSessionToken } from "@/lib/customer-auth";
import type { Order } from "@/types/store";

export async function isAdminRequest(request: Request): Promise<boolean> {
  const value = readCookie(request, SESSION_COOKIE);
  return verifySessionToken(value);
}

function readCookie(request: Request, name: string): string | undefined {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return undefined;
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export function readCustomerId(request: Request): string | undefined {
  const session = verifyCustomerSessionToken(readCookie(request, CUSTOMER_SESSION_COOKIE));
  return session?.sub;
}

/**
 * An order carries the customer's name, phone, email and delivery address, so it must
 * only ever be shown to the admin or to the signed-in customer who placed it. Without
 * this guard anyone with an order id could read another person's details.
 */
export async function canAccessOrder(request: Request, order: Order): Promise<boolean> {
  if (await isAdminRequest(request)) return true;
  const customerId = readCustomerId(request);
  if (!customerId) return false;
  return Boolean(order.customerId) && order.customerId === customerId;
}
