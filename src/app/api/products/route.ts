import { NextResponse } from "next/server";
import { getProducts, updateProducts } from "@/lib/store";
import { isAdminRequest } from "@/lib/api-guard";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Failed to load products" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { product?: Partial<Product> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const p = body.product;
  if (!p || !p.name || !Array.isArray(p.sizes) || p.sizes.length === 0) {
    return NextResponse.json(
      { error: "Product name and at least one size/price are required" },
      { status: 400 }
    );
  }

  try {
    const product: Product = {
      id: p.id || `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      name: p.name,
      brand: p.brand ?? "Debby's Fragrance",
      tagline: p.tagline ?? "A luxurious fragrance",
      description: p.description ?? "",
      category: p.category ?? "women",
      fragranceFamily: p.fragranceFamily ?? "floral",
      topNotes: p.topNotes ?? [],
      heartNotes: p.heartNotes ?? [],
      baseNotes: p.baseNotes ?? [],
      sizes: p.sizes,
      images: p.images ?? [],
      rating: p.rating ?? 0,
      reviewCount: p.reviewCount ?? 0,
      stock: p.stock ?? 0,
      isBestSeller: p.isBestSeller ?? false,
      isNewArrival: p.isNewArrival ?? false,
      isFeatured: p.isFeatured ?? false,
    };
    await updateProducts((list) => [...list, product]);
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 503 });
  }
}
