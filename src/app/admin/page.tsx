"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, LayoutDashboard, ShoppingBag, Package, Users, Settings, Bell, ArrowUpRight } from "lucide-react";
import { AdminGate } from "@/components/ui/AdminGate";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminOrders } from "@/components/admin/AdminOrders";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { AdminCustomers } from "@/components/admin/AdminCustomers";
import { AdminSettings } from "@/components/admin/AdminSettings";
import type { AdminNotification } from "@/types/store";

type Tab = "dashboard" | "orders" | "products" | "customers" | "settings";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "products", label: "Products", icon: Package },
  { id: "customers", label: "Customers", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
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

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-6xl space-y-8 px-5 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col items-start justify-between gap-4 border border-ink/10 bg-white p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-700">
              <ShieldCheck className="h-4 w-4" />
              <span>Debby&apos;s Fragrance · Admin</span>
            </div>
            <h1 className="font-serif text-2xl font-bold sm:text-3xl">Management dashboard</h1>
            <p className="max-w-xl text-xs text-ink-soft">
              Track orders, manage the catalogue, review customers, and keep store details current.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <NotificationsBell />
            <Link
              href="/shop"
              className="flex items-center gap-1.5 border border-ink/15 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ink-soft hover:bg-paper"
            >
              View shop <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </header>

        <nav className="flex flex-wrap gap-1 border-b border-ink/10">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                  active
                    ? "border-gold-600 text-ink"
                    : "border-transparent text-ink-soft/60 hover:text-ink"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </nav>

        <section>
          {tab === "dashboard" && <AdminDashboard />}
          {tab === "orders" && <AdminOrders />}
          {tab === "products" && <AdminProducts />}
          {tab === "customers" && <AdminCustomers />}
          {tab === "settings" && <AdminSettings />}
        </section>
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
