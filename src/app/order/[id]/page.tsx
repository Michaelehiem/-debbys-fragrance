"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Loader2, PackageSearch } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { OrderTimeline } from "@/components/ui/OrderTimeline";
import { orderStatusLabel, paymentMethodLabel, paymentStatusTone } from "@/lib/order-meta";
import type { Order } from "@/types/store";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function OrderTrackingPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [order, setOrder] = useState<Order | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "missing" | "error">("loading");

  useEffect(() => {
    if (!id) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(id)}`, { cache: "no-store" });
        if (!active) return;
        if (res.status === 404) {
          setState("missing");
          return;
        }
        if (!res.ok) {
          setState("error");
          return;
        }
        const data = (await res.json()) as { order: Order };
        setOrder(data.order);
        setState("ready");
      } catch {
        if (active) setState("error");
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  const whatsappNumber = siteConfig.socials.whatsapp.replace(/[^\d]/g, "");

  if (state === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-paper text-ink">
        <Loader2 className="h-6 w-6 animate-spin text-gold-700" />
      </div>
    );
  }

  if (state === "missing" || state === "error" || !order) {
    return (
      <div className="min-h-[60vh] bg-paper px-5 py-20 text-ink">
        <div className="mx-auto max-w-md space-y-5 text-center">
          <PackageSearch className="mx-auto h-12 w-12 text-gold-700" />
          <h1 className="font-serif text-3xl font-bold">Order not found</h1>
          <p className="text-sm text-ink-soft">
            We couldn&apos;t find that order. Double-check the tracking link, or message us on
            WhatsApp and we&apos;ll help.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-ink px-8 py-3 text-xs uppercase tracking-[0.22em] text-paper hover:bg-gold-700"
          >
            Back to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper px-5 py-12 text-ink sm:px-8 sm:py-16">
      <div className="mx-auto max-w-3xl space-y-10">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink/10 pb-6">
          <div className="space-y-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-ink-soft/70 hover:text-gold-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Continue shopping
            </Link>
            <h1 className="font-serif text-3xl font-bold sm:text-4xl">Track your order</h1>
            <p className="text-sm text-ink-soft">
              Order <span className="font-semibold text-ink">{order.number}</span> ·{" "}
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block border border-gold-600/50 bg-gold-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-800">
              {orderStatusLabel(order.status)}
            </span>
            <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-ink-soft/60">
              Payment · {order.paymentStatus}
            </p>
          </div>
        </div>

        <section className="border border-ink/10 bg-white p-6 sm:p-8">
          <h2 className="mb-6 font-serif text-xl font-bold">Progress</h2>
          <OrderTimeline order={order} />
        </section>

        <section className="border border-ink/10 bg-white p-6 sm:p-8">
          <h2 className="mb-5 font-serif text-xl font-bold">Items</h2>
          <div className="divide-y divide-ink/10">
            {order.items.map((item, i) => (
              <div key={`${item.productId}-${item.size}-${i}`} className="flex items-center gap-4 py-3">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-14 w-14 flex-shrink-0 object-cover"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item.name}</p>
                  <p className="text-[11px] text-ink-soft/60">
                    {item.size} × {item.qty}
                  </p>
                </div>
                <span className="whitespace-nowrap font-semibold">
                  {formatNaira(item.price * item.qty)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2 border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>Subtotal</span>
              <span className="text-ink">{formatNaira(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Delivery</span>
              <span className="text-ink">
                {order.shipping === 0 ? "FREE" : formatNaira(order.shipping)}
              </span>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-3 font-serif text-xl font-bold">
              <span>Total</span>
              <span className="text-gold-700">{formatNaira(order.total)}</span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="border border-ink/10 bg-white p-6">
            <h3 className="mb-3 text-[11px] uppercase tracking-[0.18em] text-ink-soft/60">
              Delivering to
            </h3>
            <p className="font-medium">{order.customer.name}</p>
            <p className="text-sm text-ink-soft">{order.customer.phone}</p>
            <p className="mt-2 text-sm text-ink-soft">
              {[order.delivery.address, order.delivery.city, order.delivery.state]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
          <div className="border border-ink/10 bg-white p-6">
            <h3 className="mb-3 text-[11px] uppercase tracking-[0.18em] text-ink-soft/60">
              Payment
            </h3>
            <p className="font-medium">{paymentMethodLabel(order.paymentMethod)}</p>
            <p className="text-sm text-ink-soft">Status · {order.paymentStatus}</p>
            <span className="sr-only">{paymentStatusTone(order.paymentStatus)}</span>
          </div>
        </section>

        <a
          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            `Hello ${siteConfig.businessName}, I'd like to ask about my order ${order.number}.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#2d4a3e] py-4 text-xs font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#244034]"
        >
          <MessageCircle className="h-4 w-4" /> Ask about this order on WhatsApp
        </a>
      </div>
    </div>
  );
}
