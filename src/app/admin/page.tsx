"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  Bell,
  ArrowUpRight,
} from "lucide-react";
import { AdminGate } from "@/components/ui/AdminGate";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminOrders } from "@/components/admin/AdminOrders";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { AdminCustomers } from "@/components/admin/AdminCustomers";
import { AdminSettings } from "@/components/admin/AdminSettings";
import type { AdminNotification } from "@/types/store";

type Tab = "dashboard" | "orders" | "products" | "customers" | "settings";

const TABS: {
  id: Tab;
  label: string;
  heading: string;
  desc: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    heading: "Overview",
    desc: "Revenue, orders and catalogue health at a glance.",
    icon: LayoutDashboard,
  },
  {
    id: "orders",
    label: "Orders",
    heading: "Orders",
    desc: "Review, confirm and track every customer order.",
    icon: ShoppingBag,
  },
  {
    id: "products",
    label: "Products",
    heading: "Catalogue",
    desc: "Add, edit and organise your fragrances, pricing and stock.",
    icon: Package,
  },
  {
    id: "customers",
    label: "Customers",
    heading: "Customers",
    desc: "Everyone who has shopped with you, in one place.",
    icon: Users,
  },
  {
    id: "settings",
    label: "Settings",
    heading: "Store settings",
    desc: "Store details, contact information and social links.",
    icon: Settings,
  },
];

export default function AdminPage() {
  return (
    <AdminGate>
      <AdminShell />
    </AdminGate>
  );
}

function AdminShell() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const active = TABS.find((t) => t.id === tab) ?? TABS[0];
  const ActiveIcon = active.icon;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-[88rem] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="lg:flex lg:gap-8">
          {/* ── Sidebar ─────────────────────────────────────────── */}
          <aside className="lg:w-64 lg:flex-shrink-0">
            <div className="space-y-6 lg:sticky lg:top-6">
              {/* Brand + mobile notifications */}
              <div className="flex items-center justify-between gap-3 border border-ink/10 bg-white p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center bg-ink text-paper">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-serif text-sm font-bold tracking-[0.14em] text-ink">
                      DEBBY&apos;S
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gold-700">
                      Admin console
                    </p>
                  </div>
                </div>
                <div className="lg:hidden">
                  <NotificationsBell />
                </div>
              </div>

              {/* Navigation */}
              <nav
                aria-label="Admin sections"
                className="flex gap-1 overflow-x-auto border-b border-ink/10 pb-1 lg:flex-col lg:gap-1 lg:overflow-visible lg:border-b-0 lg:pb-0"
              >
                {TABS.map((t) => {
                  const Icon = t.icon;
                  const isActive = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center gap-3 whitespace-nowrap border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors lg:w-full lg:border-b-0 lg:border-l-2 ${
                        isActive
                          ? "border-gold-600 bg-white text-ink lg:border-gold-600"
                          : "border-transparent text-ink-soft/60 hover:bg-white/60 hover:text-ink lg:border-transparent"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Desktop footer actions */}
              <div className="hidden space-y-2 lg:block">
                <Link
                  href="/shop"
                  className="flex items-center justify-between border border-ink/15 bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-soft transition-colors hover:bg-paper hover:text-ink"
                >
                  View shop
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <div className="flex items-center justify-between border border-ink/15 bg-white px-4 py-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                    Alerts
                  </span>
                  <NotificationsBell />
                </div>
              </div>
            </div>
          </aside>

          {/* ── Main content ────────────────────────────────────── */}
          <main className="mt-6 min-w-0 flex-1 lg:mt-0">
            <header className="mb-6 border border-ink/10 bg-white p-6 sm:p-8">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-700">
                <ActiveIcon className="h-4 w-4" />
                {active.label}
              </div>
              <h1 className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
                {active.heading}
              </h1>
              <p className="mt-2 max-w-xl text-xs text-ink-soft">{active.desc}</p>
            </header>

            <section>
              {tab === "dashboard" && <AdminDashboard />}
              {tab === "orders" && <AdminOrders />}
              {tab === "products" && <AdminProducts />}
              {tab === "customers" && <AdminCustomers />}
              {tab === "settings" && <AdminSettings />}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<AdminNotification[]>([]);

  const load = async () => {
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { notifications: AdminNotification[] };
      setItems(data.notifications);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    void load();
    const id = setInterval(() => void load(), 60000);
    return () => clearInterval(id);
  }, []);

  const unread = items.filter((n) => !n.read).length;

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && unread > 0) {
      try {
        const res = await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        if (res.ok) {
          const data = (await res.json()) as { notifications: AdminNotification[] };
          setItems(data.notifications);
        }
      } catch {
        /* ignore */
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="relative border border-ink/15 bg-white p-2.5 text-ink-soft hover:bg-paper"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 border border-ink/10 bg-white shadow-editorial">
          <div className="border-b border-ink/10 px-4 py-3 text-xs font-bold uppercase tracking-wider text-ink-soft">
            Notifications
          </div>
          <div className="max-h-80 divide-y divide-ink/5 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-ink-soft/60">Nothing yet.</p>
            ) : (
              items.map((n) => (
                <div key={n.id} className="px-4 py-3">
                  <p className="text-sm font-medium text-ink">{n.title}</p>
                  <p className="mt-0.5 text-xs text-ink-soft/70">{n.body}</p>
                  <p className="mt-1 text-[10px] text-ink-soft/50">
                    {new Date(n.createdAt).toLocaleString("en-NG")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
