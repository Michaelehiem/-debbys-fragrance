"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { User, Lock, Mail, Phone, MapPin, LogOut, Package, ChevronRight } from "lucide-react";
import { useCustomer } from "@/context/CustomerAuthContext";
import { formatNaira } from "@/lib/utils";
import { orderStatusLabel } from "@/lib/order-meta";
import type { Order, SavedAddress } from "@/types/store";

export default function AccountPage() {
  const { customer, loading, login, register, logout, updateProfile } = useCustomer();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
      {customer ? <ProfileView onLogout={logout} /> : <AuthView onLogin={login} onRegister={register} />}
    </div>
  );
}

function AuthView({
  onLogin,
  onRegister,
}: {
  onLogin: ReturnType<typeof useCustomer>["login"];
  onRegister: ReturnType<typeof useCustomer>["register"];
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const inputClass =
    "w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink focus:border-gold-500 focus:outline-none";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result =
        mode === "login"
          ? await onLogin(email, password)
          : await onRegister({ name, email, phone, password });
      if (!result.ok) setError(result.error ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-md space-y-8"
    >
      <div className="space-y-2 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/30 bg-gold-500/10">
          <User className="h-7 w-7 text-gold-700" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-ink">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-ink-soft">
          {mode === "login"
            ? "Sign in to save your bag and track your orders."
            : "Save your details, keep your bag across devices, and follow your orders."}
        </p>
      </div>

      <div className="flex border border-ink/15 bg-white p-1">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setError("");
            }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              mode === m ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
            }`}
          >
            {m === "login" ? "Sign in" : "Register"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="mb-1 block text-xs text-ink-soft">Full name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
          </div>
        )}
        <div className="relative">
          <Mail className="absolute left-4 top-3.5 h-4 w-4 text-ink-soft/50" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className={`${inputClass} pl-11`}
          />
        </div>
        {mode === "register" && (
          <div className="relative">
            <Phone className="absolute left-4 top-3.5 h-4 w-4 text-ink-soft/50" />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone / WhatsApp"
              className={`${inputClass} pl-11`}
            />
          </div>
        )}
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 h-4 w-4 text-ink-soft/50" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={6}
            className={`${inputClass} pl-11`}
          />
        </div>

        {error && <p className="text-xs font-semibold text-rose-500">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-ink py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-paper transition-colors hover:bg-gold-700 disabled:opacity-60"
        >
          {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
    </motion.div>
  );
}

function ProfileView({ onLogout }: { onLogout: () => Promise<void> }) {
  const { customer, updateProfile } = useCustomer();
  const [name, setName] = useState(customer?.name ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [address, setAddress] = useState<SavedAddress>(
    customer?.address ?? { address: "", city: "", state: "", country: "Nigeria" }
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const inputClass =
    "w-full border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink focus:border-gold-500 focus:outline-none";

  const loadOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/customer/orders", { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { orders: Order[] };
      setOrders(data.orders);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  if (!customer) return null;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res = await updateProfile({ name, phone, address });
    setBusy(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">Hello, {customer.name.split(" ")[0]}</h1>
          <p className="text-sm text-ink-soft">{customer.email}</p>
        </div>
        <button
          onClick={() => void onLogout()}
          className="flex items-center gap-1.5 border border-ink/15 bg-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ink-soft hover:border-rose-300 hover:text-rose-600"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <form onSubmit={save} className="space-y-4 border border-ink/10 bg-white p-6">
          <h2 className="font-serif text-lg font-bold text-ink">Your details</h2>
          {saved && (
            <p className="border border-emerald-500/40 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
              Profile saved.
            </p>
          )}
          <div>
            <label className="mb-1 block text-xs text-ink-soft">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink-soft">Phone / WhatsApp</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          </div>
          <div className="space-y-3 border-t border-ink/10 pt-4">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-soft">
              <MapPin className="h-3.5 w-3.5" /> Default delivery address
            </p>
            <input
              value={address.address}
              onChange={(e) => setAddress({ ...address, address: e.target.value })}
              placeholder="Street address"
              className={inputClass}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                placeholder="City"
                className={inputClass}
              />
              <input
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                placeholder="State"
                className={inputClass}
              />
            </div>
            <input
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
              placeholder="Country"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="bg-ink px-6 py-3 text-xs font-bold uppercase tracking-widest text-paper hover:bg-gold-700 disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save details"}
          </button>
        </form>

        <div className="space-y-4 border border-ink/10 bg-white p-6">
          <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-ink">
            <Package className="h-4 w-4 text-gold-600" /> Your orders
          </h2>
          {orders.length === 0 ? (
            <p className="text-sm text-ink-soft/60">
              No orders yet.{" "}
              <Link href="/shop" className="text-gold-700 underline">
                Start shopping
              </Link>
              .
            </p>
          ) : (
            <div className="divide-y divide-ink/10">
              {orders.map((o) => (
                <Link
                  key={o.id}
                  href={`/order/${o.id}`}
                  className="flex items-center justify-between gap-3 py-3 hover:bg-paper/50"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">{o.number}</p>
                    <p className="text-[11px] text-ink-soft/60">
                      {new Date(o.createdAt).toLocaleDateString("en-NG")} ·{" "}
                      {orderStatusLabel(o.status)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink">{formatNaira(o.total)}</span>
                    <ChevronRight className="h-4 w-4 text-ink-soft" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
