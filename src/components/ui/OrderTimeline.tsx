"use client";

import { Check, Package, Truck, Home, XCircle } from "lucide-react";
import type { Order, OrderStatus } from "@/types/store";
import { ORDER_STATUS_FLOW, orderStatusLabel } from "@/lib/order-meta";

const ICONS: Record<OrderStatus, React.ComponentType<{ className?: string }>> = {
  PENDING: Package,
  CONFIRMED: Check,
  OUT_FOR_DELIVERY: Truck,
  DELIVERED: Home,
  CANCELLED: XCircle,
};

export function OrderTimeline({ order }: { order: Order }) {
  if (order.status === "CANCELLED") {
    return (
      <div className="flex items-start gap-3 border border-rose-300 bg-rose-50 p-5 text-sm text-rose-800">
        <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">This order has been cancelled.</p>
          <p className="text-rose-700/80 mt-1">
            If this was a mistake, please message us on WhatsApp and we&apos;ll sort it out.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(order.status);

  return (
    <ol className="relative">
      {ORDER_STATUS_FLOW.map((status, index) => {
        const Icon = ICONS[status];
        const done = index < currentIndex;
        const current = index === currentIndex;
        const reached = index <= currentIndex;
        return (
          <li key={status} className="relative flex gap-5 pb-8 last:pb-0">
            {index < ORDER_STATUS_FLOW.length - 1 && (
              <span
                className={`absolute left-[19px] top-10 h-full w-px ${
                  done ? "bg-gold-600" : "bg-ink/15"
                }`}
                aria-hidden
              />
            )}
            <span
              className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
                reached
                  ? "border-gold-600 bg-gold-600 text-white"
                  : "border-ink/20 bg-white text-ink-soft/40"
              }`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <div className="pt-1.5">
              <p
                className={`text-sm font-semibold uppercase tracking-[0.14em] ${
                  reached ? "text-ink" : "text-ink-soft/50"
                }`}
              >
                {orderStatusLabel(status)}
              </p>
              {current && (
                <p className="mt-1 text-xs text-gold-700">
                  {status === "DELIVERED"
                    ? "Delivered — thank you for your order."
                    : "Your order is currently at this stage."}
                </p>
              )}
              {index === 0 && done && (
                <p className="mt-1 text-xs text-ink-soft/70">We received your order.</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
