import { NextResponse } from "next/server";
import { addNotification, addOrder, getOrders } from "@/lib/store";
import { isAdminRequest, readCustomerId } from "@/lib/api-guard";
import { generateOrderId, generateOrderNumber, paymentMethodLabel } from "@/lib/order-meta";
import type { Order, OrderItem, PaymentMethod } from "@/types/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const orders = await getOrders();
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Failed to load orders" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let body: {
    items?: OrderItem[];
    subtotal?: number;
    shipping?: number;
    total?: number;
    customer?: { name?: string; phone?: string; email?: string };
    delivery?: { address?: string; city?: string; state?: string; country?: string; instructions?: string };
    paymentMethod?: PaymentMethod;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const items = (body.items ?? []).filter((i) => i && i.name && i.qty > 0);
  if (items.length === 0) {
    return NextResponse.json({ error: "Order has no items" }, { status: 400 });
  }
  const name = body.customer?.name?.trim();
  const phone = body.customer?.phone?.trim();
  const address = body.delivery?.address?.trim();
  const city = body.delivery?.city?.trim();
  if (!name || !phone || !address || !city) {
    return NextResponse.json({ error: "Missing delivery details" }, { status: 400 });
  }

  try {
    const customerId = readCustomerId(request);
    const order: Order = {
      id: generateOrderId(),
      number: generateOrderNumber(),
      createdAt: new Date().toISOString(),
      status: "PENDING",
      paymentStatus: "PENDING",
      paymentMethod: body.paymentMethod ?? "whatsapp",
      items,
      subtotal: Number(body.subtotal) || 0,
      shipping: Number(body.shipping) || 0,
      total: Number(body.total) || 0,
      customer: { name, phone, email: body.customer?.email?.trim() ?? "" },
      delivery: {
        address,
        city,
        state: body.delivery?.state?.trim() ?? "",
        country: body.delivery?.country?.trim() || "Nigeria",
        ...(body.delivery?.instructions ? { instructions: body.delivery.instructions } : {}),
      },
      ...(customerId ? { customerId } : {}),
    };

    await addOrder(order);
    await addNotification({
      type: "order",
      title: `New order ${order.number}`,
      body: `${order.customer.name} · ${paymentMethodLabel(order.paymentMethod)} · ₦${order.total.toLocaleString("en-NG")}`,
      target: "orders",
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to place order" }, { status: 503 });
  }
}
