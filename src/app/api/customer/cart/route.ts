import { NextResponse } from "next/server";
import { readCustomerId } from "@/lib/api-guard";
import { getCustomerById, updateCustomer } from "@/lib/store";
import type { SavedCartItem } from "@/types/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const id = readCustomerId(request);
  if (!id) return NextResponse.json({ cart: [] });
  try {
    const customer = await getCustomerById(id);
    return NextResponse.json({ cart: customer?.cart ?? [] });
  } catch {
    return NextResponse.json({ cart: [] });
  }
}

export async function PUT(request: Request) {
  const id = readCustomerId(request);
  if (!id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: { cart?: SavedCartItem[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const cart = (body.cart ?? []).filter((i) => i && i.productId && i.size && i.quantity > 0);
  try {
    await updateCustomer(id, { cart });
    return NextResponse.json({ cart });
  } catch {
    return NextResponse.json({ error: "Failed to save cart" }, { status: 503 });
  }
}
