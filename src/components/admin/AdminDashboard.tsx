"use client";

import { TrendingUp, ShoppingBag, Users, Package, AlertTriangle, Clock } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import { useStats } from "./use-stats";
import { orderStatusLabel } from "@/lib/order-meta";
import type { OrderStatus } from "@/types/store";

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
}) {
  return (
    <div className="border border-ink/10 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft/70">
          {label}
        </span>
        <Icon className="h-4 w-4 text-gold-600" />
      </div>
      <p className="mt-3 font-serif text-2xl font-bold text-ink">{value}</p>
      {hint && <p className="mt-1 text-[11px] text-ink-soft/60">{hint}</p>}
    </div>
  );
}

export function AdminDashboard() {
  const { stats, loading, error } = useStats();

  if (loading && !stats) {
    return <p className="py-16 text-center text-sm text-ink-soft">Loading dashboard…</p>;
  }
  if (error && !stats) {
    return <p className="py-16 text-center text-sm text-rose-500">{error}</p>;
  }
  if (!stats) return null;

  const maxRevenue = Math.max(1, ...stats.revenueByDay.map((d) => d.revenue));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total revenue"
          value={formatNaira(stats.totalRevenue)}
          icon={TrendingUp}
          hint={`${formatNaira(stats.paidRevenue)} confirmed paid`}
        />
        <StatCard
          label="Orders"
          value={String(stats.orderCount)}
          icon={ShoppingBag}
          hint={`${stats.pendingOrderCount} awaiting confirmation`}
        />
        <StatCard label="Customers" value={String(stats.customerCount)} icon={Users} />
        <StatCard
          label="Products"
          value={String(stats.productCount)}
          icon={Package}
          hint={`${stats.lowStockCount} low · ${stats.outOfStockCount} out of stock`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue chart */}
        <div className="lg:col-span-2 border border-ink/10 bg-white p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold">Revenue · last 14 days</h2>
            <span className="text-[11px] uppercase tracking-[0.16em] text-ink-soft/60">
              {formatNaira(stats.revenueByDay.reduce((s, d) => s + d.revenue, 0))}
            </span>
          </div>
          <div className="flex h-44 items-end gap-1.5">
            {stats.revenueByDay.map((d) => (
              <div key={d.day} className="group flex flex-1 flex-col items-center justify-end gap-1.5">
                <span className="pointer-events-none absolute -mt-6 hidden text-[10px] text-ink-soft group-hover:block">
                  {formatNaira(d.revenue)}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-gold-600 to-gold-400 transition-all"
                  style={{ height: `${Math.max(4, (d.revenue / maxRevenue) * 100)}%` }}
                  title={`${d.day}: ${formatNaira(d.revenue)} · ${d.orders} orders`}
                />
                <span className="text-[8px] text-ink-soft/50">{d.day.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="border border-ink/10 bg-white p-6">
          <h2 className="mb-5 font-serif text-lg font-bold">Orders by status</h2>
          <div className="space-y-3">
            {stats.ordersByStatus.map((s) => (
              <div key={s.status} className="flex items-center justify-between text-sm">
                <span className="text-ink-soft">{s.status}</span>
                <span className="font-semibold text-ink">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top products */}
        <div className="border border-ink/10 bg-white p-6">
          <h2 className="mb-5 font-serif text-lg font-bold">Top sellers</h2>
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-ink-soft/60">No sales yet.</p>
          ) : (
            <div className="space-y-4">
              {stats.topProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.name} className="h-11 w-11 object-cover" />
                  ) : (
                    <div className="h-11 w-11 bg-paper-deep" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{p.name}</p>
                    <p className="text-[11px] text-ink-soft/60">{p.units} sold</p>
                  </div>
                  <span className="text-sm font-semibold text-gold-700">
                    {formatNaira(p.revenue)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent orders */}
        <div className="border border-ink/10 bg-white p-6">
          <h2 className="mb-5 flex items-center gap-2 font-serif text-lg font-bold">
            <Clock className="h-4 w-4 text-gold-600" /> Recent orders
          </h2>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-ink-soft/60">No orders yet.</p>
          ) : (
            <div className="divide-y divide-ink/10">
              {stats.recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium text-ink">{o.number}</p>
                    <p className="text-[11px] text-ink-soft/60">{o.customer.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-ink">{formatNaira(o.total)}</p>
                    <p className="text-[11px] text-gold-700">
                      {orderStatusLabel(o.status as OrderStatus)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {stats.lowStockCount > 0 && (
        <div className="flex items-start gap-3 border border-gold-600/30 bg-gold-500/10 p-5 text-sm text-gold-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p>
            {stats.lowStockCount} product{stats.lowStockCount > 1 ? "s" : ""} running low and{" "}
            {stats.outOfStockCount} out of stock. Update stock levels in the Products tab.
          </p>
        </div>
      )}
    </div>
  );
}
