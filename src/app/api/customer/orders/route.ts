import { NextResponse } from "next/server";
import { readCustomerId } from "@/lib/api-guard";
import { getOrders } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const id = readCustomerId(request);
  if (!id) return NextResponse.json({ orders: [] });
  try {
    const orders = await getOrders();
    const mine = orders.filter((o) => o.customerId === id);
    return NextResponse.json({ orders: mine });
  } catch {
    return NextResponse.json({ error: "Failed to load orders" }, { status: 503 });
  }
}
