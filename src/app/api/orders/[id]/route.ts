import { NextResponse } from "next/server";
import { getOrder, updateOrder } from "@/lib/store";
import { canAccessOrder, isAdminRequest } from "@/lib/api-guard";
import type { OrderStatus, PaymentStatus } from "@/types/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const order = await getOrder(params.id);
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    // Guest orders (no customer account) are reachable by their unguessable id alone, which
    // is the tracking capability. Account orders additionally require the owner's session.
    const allowed = !order.customerId || (await canAccessOrder(request, order));
    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Failed to load order" }, { status: 503 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { status?: OrderStatus; paymentStatus?: PaymentStatus };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  try {
    const patch: { status?: OrderStatus; paymentStatus?: PaymentStatus } = {};
    if (body.status) patch.status = body.status;
    if (body.paymentStatus) patch.paymentStatus = body.paymentStatus;
    const order = await updateOrder(params.id, patch);
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 503 });
  }
}
