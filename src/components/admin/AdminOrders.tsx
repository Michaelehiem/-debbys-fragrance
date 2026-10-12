"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatNaira } from "@/lib/utils";
import { orderStatusLabel } from "@/lib/order-meta";
import type { Order, OrderStatus, PaymentStatus } from "@/types/store";
import { RefreshCw, ChevronDown, ShoppingBag, Phone, MapPin } from "lucide-react";

const STATUSES: OrderStatus[] = ["PENDING", "CONFIRMED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
const PAYMENT_STATUSES: PaymentStatus[] = ["PENDING", "PAID", "FAILED", "REFUNDED"];

const selectClass =
  "border border-ink/15 bg-white px-2 py-1.5 text-xs text-ink focus:border-gold-500 focus:outline-none";

function statusColor(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return "bg-gold-500/15 text-gold-800";
    case "CONFIRMED":
      return "bg-indigo-500/10 text-indigo-700";
    case "OUT_FOR_DELIVERY":
      return "bg-orange-500/10 text-orange-700";
    case "DELIVERED":
      return "bg-emerald-500/10 text-emerald-700";
    case "CANCELLED":
      return "bg-ink/10 text-ink-soft";
  }
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { orders: Order[] };
      setOrders(data.orders);
      setError(null);
    } catch {
      setError("Could not load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const patch = async (id: string, body: Partial<Pick<Order, "status" | "paymentStatus">>) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...body } : o)));
    const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) void load();
  };

  const filtered = useMemo(
    () => (filter === "all" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter]
  );

  const revenue = filtered.reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-ink">
          <ShoppingBag className="h-5 w-5 text-gold-600" />
          Orders ({filtered.length})
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap items-center border border-ink/15 bg-white p-1">
            {(["all", ...STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s as OrderStatus | "all")}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  filter === s ? "bg-gold-500/20 text-gold-700" : "text-ink-soft hover:text-ink"
                }`}
              >
                {s === "all" ? "All" : orderStatusLabel(s as OrderStatus)}
              </button>
            ))}
          </div>
          <button
            onClick={() => void load()}
            className="flex items-center gap-1.5 border border-ink/15 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-ink-soft hover:bg-paper"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      {error && <p className="border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">{error}</p>}

      <p className="text-sm text-ink-soft">
        Showing revenue <span className="font-semibold text-ink">{formatNaira(revenue)}</span> across{" "}
        {filtered.length} order{filtered.length === 1 ? "" : "s"}.
      </p>

      {filtered.length === 0 && !loading ? (
        <p className="border border-ink/10 bg-paper/50 py-16 text-center text-sm text-ink-soft">
          No orders here yet.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const open = expanded === order.id;
            return (
              <div key={order.id} className="border border-ink/10 bg-white">
                <button
                  onClick={() => setExpanded(open ? null : order.id)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left hover:bg-paper/40"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-ink">{order.number}</span>
                      <span
                        className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${statusColor(
                          order.status
                        )}`}
                      >
                        {orderStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-ink-soft/70">
                      {order.customer.name} · {new Date(order.createdAt).toLocaleString("en-NG")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-ink">{formatNaira(order.total)}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-ink-soft transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {open && (
                  <div className="grid grid-cols-1 gap-6 border-t border-ink/10 p-4 lg:grid-cols-2">
                    <div className="space-y-4">
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold text-ink">{order.customer.name}</p>
                        <a href={`tel:${order.customer.phone}`} className="flex items-center gap-2 text-ink-soft hover:text-gold-700">
                          <Phone className="h-3.5 w-3.5" /> {order.customer.phone}
                        </a>
                        {order.customer.email && (
                          <p className="text-ink-soft/70">{order.customer.email}</p>
                        )}
                        <p className="flex items-start gap-2 pt-1 text-ink-soft">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                          <span>
                            {order.delivery.address}, {order.delivery.city}
                            {order.delivery.state ? `, ${order.delivery.state}` : ""}
                            {order.delivery.country ? `, ${order.delivery.country}` : ""}
                          </span>
                        </p>
                        {order.delivery.instructions && (
                          <p className="pt-1 text-xs italic text-ink-soft/70">
                            “{order.delivery.instructions}”
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div>
                          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-soft/60">
                            Order status
                          </label>
                          <select
                            value={order.status}
                            onChange={(e) => void patch(order.id, { status: e.target.value as OrderStatus })}
                            className={selectClass}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {orderStatusLabel(s)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-ink-soft/60">
                            Payment
                          </label>
                          <select
                            value={order.paymentStatus}
                            onChange={(e) =>
                              void patch(order.id, { paymentStatus: e.target.value as PaymentStatus })
                            }
                            className={selectClass}
                          >
                            {PAYMENT_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft/60">
                        Items
                      </p>
                      <div className="divide-y divide-ink/10 border border-ink/10">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt={item.name} className="h-10 w-10 object-cover" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm text-ink">{item.name}</p>
                              <p className="text-[11px] text-ink-soft/60">
                                {item.size} × {item.qty}
                              </p>
                            </div>
                            <span className="text-sm text-ink">{formatNaira(item.price * item.qty)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-1 pt-2 text-sm">
                        <div className="flex justify-between text-ink-soft">
                          <span>Subtotal</span>
                          <span>{formatNaira(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-ink-soft">
                          <span>Delivery</span>
                          <span>{order.shipping === 0 ? "Free" : formatNaira(order.shipping)}</span>
                        </div>
                        <div className="flex justify-between border-t border-ink/10 pt-1 font-semibold text-ink">
                          <span>Total</span>
                          <span>{formatNaira(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
