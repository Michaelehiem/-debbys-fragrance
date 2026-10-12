import { NextResponse } from "next/server";
import { getCustomers, getOrders, getProducts } from "@/lib/store";
import { isAdminRequest } from "@/lib/api-guard";
import { ORDER_STATUSES } from "@/lib/constants";
import type { DashboardStats } from "@/types/store";

export const dynamic = "force-dynamic";

const LOW_STOCK_THRESHOLD = 5;

export async function GET(request: Request) {
  if (!(await isAdminRequest(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [orders, customers, products] = await Promise.all([
      getOrders(),
      getCustomers(),
      getProducts(),
    ]);

    const revenueByDay: { day: string; revenue: number; orders: number }[] = [];
    const days = 14;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayOrders = orders.filter((o) => o.createdAt.slice(0, 10) === key);
      revenueByDay.push({
        day: key,
        revenue: dayOrders
          .filter((o) => o.status !== "CANCELLED")
          .reduce((sum, o) => sum + o.total, 0),
        orders: dayOrders.length,
      });
    }

    const ordersByStatus = ORDER_STATUSES.map((s) => ({
      status: s.label,
      count: orders.filter((o) => o.status === s.value).length,
    }));

    const productById = new Map(products.map((p) => [p.id, p]));
    const categoryRevenue = new Map<string, number>();
    const productUnits = new Map<string, { id: string; name: string; image: string; units: number; revenue: number }>();

    for (const order of orders) {
      if (order.status === "CANCELLED") continue;
      for (const item of order.items) {
        const product = productById.get(item.productId);
        const category = product?.category ?? "other";
        categoryRevenue.set(category, (categoryRevenue.get(category) ?? 0) + item.price * item.qty);
        const existing = productUnits.get(item.productId) ?? {
          id: item.productId,
          name: item.name,
          image: item.image,
          units: 0,
          revenue: 0,
        };
        existing.units += item.qty;
        existing.revenue += item.price * item.qty;
        productUnits.set(item.productId, existing);
      }
    }

    const stats: DashboardStats = {
      totalRevenue: orders
        .filter((o) => o.status !== "CANCELLED")
        .reduce((sum, o) => sum + o.total, 0),
      paidRevenue: orders
        .filter((o) => o.paymentStatus === "PAID")
        .reduce((sum, o) => sum + o.total, 0),
      orderCount: orders.length,
      customerCount: customers.length,
      productCount: products.length,
      lowStockCount: products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD).length,
      outOfStockCount: products.filter((p) => p.stock <= 0).length,
      pendingOrderCount: orders.filter((o) => o.status === "PENDING").length,
      revenueByDay,
      ordersByStatus,
      revenueByCategory: Array.from(categoryRevenue.entries()).map(([category, revenue]) => ({
        category,
        revenue,
      })),
      topProducts: Array.from(productUnits.values())
        .sort((a, b) => b.units - a.units)
        .slice(0, 5),
      recentOrders: orders.slice(0, 5),
    };

    return NextResponse.json({ stats });
  } catch {
    return NextResponse.json({ error: "Failed to build dashboard" }, { status: 503 });
  }
}
