"use client";

import { useCallback, useEffect, useState } from "react";
import { formatNaira } from "@/lib/utils";
import { Users, Mail, Phone, MapPin } from "lucide-react";

type CustomerRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: { address: string; city: string; state: string; country: string };
  createdAt: string;
  orderCount: number;
  totalSpend: number;
};

type Subscriber = { id: string; email: string; createdAt: string };

export function AdminCustomers() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"customers" | "subscribers">("customers");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, sRes] = await Promise.all([
        fetch("/api/customers", { cache: "no-store" }),
        fetch("/api/newsletter", { cache: "no-store" }),
      ]);
      if (cRes.ok) {
        const data = (await cRes.json()) as { customers: CustomerRow[] };
        setCustomers(data.customers);
      }
      if (sRes.ok) {
        const data = (await sRes.json()) as { subscribers: Subscriber[] };
        setSubscribers(data.subscribers);
      }
      setError(null);
    } catch {
      setError("Could not load customers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-ink">
          <Users className="h-5 w-5 text-gold-600" />
          Customers &amp; subscribers
        </h2>
        <div className="flex items-center border border-ink/15 bg-white p-1">
          <button
            onClick={() => setTab("customers")}
            className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
              tab === "customers" ? "bg-gold-500/20 text-gold-700" : "text-ink-soft hover:text-ink"
            }`}
          >
            Accounts ({customers.length})
          </button>
          <button
            onClick={() => setTab("subscribers")}
            className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
              tab === "subscribers" ? "bg-gold-500/20 text-gold-700" : "text-ink-soft hover:text-ink"
            }`}
          >
            Newsletter ({subscribers.length})
          </button>
        </div>
      </div>

      {error && <p className="border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">{error}</p>}

      {tab === "customers" && (
        <>
          {customers.length === 0 && !loading ? (
            <p className="border border-ink/10 bg-paper/50 py-16 text-center text-sm text-ink-soft">
              No customer accounts yet.
            </p>
          ) : (
            <div className="overflow-hidden border border-ink/10 bg-white">
              <div className="divide-y divide-ink/10">
                {customers.map((c) => (
                  <div key={c.id} className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-[1.5fr_1fr_auto] sm:items-center">
                    <div>
                      <p className="font-semibold text-ink">{c.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft/70">
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3" /> {c.email}
                        </span>
                        {c.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3" /> {c.phone}
                          </span>
                        )}
                      </div>
                      {c.address?.address && (
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-soft/60">
                          <MapPin className="h-3 w-3" />
                          {c.address.address}, {c.address.city}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-ink-soft/60">
                      Joined {new Date(c.createdAt).toLocaleDateString("en-NG")}
                    </p>
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-semibold text-ink">{formatNaira(c.totalSpend)}</p>
                      <p className="text-[11px] text-ink-soft/60">
                        {c.orderCount} order{c.orderCount === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {tab === "subscribers" && (
        <>
          {subscribers.length === 0 && !loading ? (
            <p className="border border-ink/10 bg-paper/50 py-16 text-center text-sm text-ink-soft">
              No newsletter subscribers yet.
            </p>
          ) : (
            <div className="overflow-hidden border border-ink/10 bg-white">
              <div className="divide-y divide-ink/10">
                {subscribers.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-4 text-sm">
                    <span className="flex items-center gap-2 text-ink">
                      <Mail className="h-3.5 w-3.5 text-gold-600" /> {s.email}
                    </span>
                    <span className="text-xs text-ink-soft/60">
                      {new Date(s.createdAt).toLocaleDateString("en-NG")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
