import { NextResponse } from "next/server";
import { getCustomers, getOrders } from "@/lib/store";
import { isAdminRequest } from "@/lib/api-guard";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const [customers, orders] = await Promise.all([getCustomers(), getOrders()]);
    const orderCounts = new Map<string, number>();
    const orderSpend = new Map<string, number>();
    for (const order of orders) {
      if (!order.customerId) continue;
      orderCounts.set(order.customerId, (orderCounts.get(order.customerId) ?? 0) + 1);
      orderSpend.set(order.customerId, (orderSpend.get(order.customerId) ?? 0) + order.total);
    }
    const list = customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      address: c.address,
      createdAt: c.createdAt,
      orderCount: orderCounts.get(c.id) ?? 0,
      totalSpend: orderSpend.get(c.id) ?? 0,
    }));
    return NextResponse.json({ customers: list });
  } catch {
    return NextResponse.json({ error: "Failed to load customers" }, { status: 503 });
  }
}
