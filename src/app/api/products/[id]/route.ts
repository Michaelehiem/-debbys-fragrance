import { NextResponse } from "next/server";
import { getProduct, updateProducts } from "@/lib/store";
import { isAdminRequest } from "@/lib/api-guard";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const product = await getProduct(params.id);
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Failed to load product" }, { status: 503 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { updates?: Partial<Product> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const updates = body.updates ?? {};

  try {
    let found = false;
    const next = await updateProducts((list) =>
      list.map((p) => {
        if (p.id !== params.id) return p;
        found = true;
        return { ...p, ...updates, id: p.id };
      })
    );
    if (!found) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const product = next.find((p) => p.id === params.id);
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 503 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await updateProducts((list) => list.filter((p) => p.id !== params.id));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 503 });
  }
}
