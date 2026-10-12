"use client";

import { useCallback, useEffect, useState } from "react";
import { Settings as SettingsIcon, Check, Lock } from "lucide-react";
import type { StoreSettings } from "@/types/store";

const FIELDS: { key: keyof StoreSettings; label: string; placeholder?: string; type?: string }[] = [
  { key: "name", label: "Store name" },
  { key: "tagline", label: "Tagline" },
  { key: "supportEmail", label: "Support email", type: "email" },
  { key: "phone", label: "Phone" },
  { key: "whatsappNumber", label: "WhatsApp number (digits only)", placeholder: "234..." },
  { key: "address", label: "Address" },
  { key: "facebook", label: "Facebook URL" },
  { key: "instagram", label: "Instagram URL" },
  { key: "tiktok", label: "TikTok URL" },
];

export function AdminSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings", { cache: "no-store" });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { settings: StoreSettings };
      setSettings(data.settings);
      setError(null);
    } catch {
      setError("Could not load settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setMessage("");
    try {
      const payload: Partial<StoreSettings> = { ...settings };
      if (password.trim()) payload.adminPassword = password.trim();
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: payload }),
      });
      if (!res.ok) throw new Error("failed");
      const data = (await res.json()) as { settings: StoreSettings };
      setSettings(data.settings);
      setPassword("");
      setMessage("Settings saved.");
      setTimeout(() => setMessage(""), 4000);
    } catch {
      setError("Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !settings) {
    return <p className="py-16 text-center text-sm text-ink-soft">Loading settings…</p>;
  }
  if (!settings) {
    return <p className="py-16 text-center text-sm text-rose-500">{error}</p>;
  }

  const inputClass =
    "w-full border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink focus:border-gold-500 focus:outline-none";

  return (
    <form onSubmit={save} className="space-y-6">
      <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-ink">
        <SettingsIcon className="h-5 w-5 text-gold-600" />
        Store settings
      </h2>

      {message && (
        <div className="flex items-center gap-2 border border-emerald-500/40 bg-emerald-50 p-4 text-xs font-semibold text-emerald-700">
          <Check className="h-4 w-4" /> {message}
        </div>
      )}

      <div className="space-y-4 border border-ink/10 bg-white p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.key} className={f.key === "address" ? "sm:col-span-2" : ""}>
              <label className="mb-1 block text-xs text-ink-soft">{f.label}</label>
              <input
                type={f.type ?? "text"}
                value={(settings[f.key] as string) ?? ""}
                onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 border border-ink/10 bg-white p-6">
        <h3 className="flex items-center gap-2 font-serif text-sm font-bold text-gold-700">
          <Lock className="h-4 w-4" /> Admin password
        </h3>
        <p className="text-[11px] text-ink-soft/70">
          Leave blank to keep the current password. Changing it updates the password used to sign
          in here.
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New admin password"
          className={`${inputClass} sm:max-w-sm`}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-ink px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-paper transition-colors hover:bg-gold-700 disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
