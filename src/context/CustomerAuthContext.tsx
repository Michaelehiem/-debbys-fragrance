"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { PublicCustomer, SavedAddress } from "@/types/store";

type RegisterInput = { name: string; phone: string; email: string; password: string };
type UpdateInput = { name?: string; phone?: string; address?: SavedAddress };

interface CustomerAuthContextType {
  customer: PublicCustomer | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (input: RegisterInput) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (patch: UpdateInput) => Promise<{ ok: boolean; error?: string }>;
  refresh: () => Promise<void>;
}

const CustomerAuthContext = createContext<CustomerAuthContextType | undefined>(undefined);

export const CustomerAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<PublicCustomer | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/customer/auth", { cache: "no-store" });
      const data = (await res.json()) as { customer: PublicCustomer | null };
      setCustomer(data.customer ?? null);
    } catch {
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const post = useCallback(async (body: Record<string, unknown>) => {
    const res = await fetch("/api/customer/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as {
      customer?: PublicCustomer | null;
      error?: string;
    };
    return { res, data };
  }, []);

  const login = useCallback<CustomerAuthContextType["login"]>(
    async (email, password) => {
      const { res, data } = await post({ action: "login", email, password });
      if (!res.ok) return { ok: false, error: data.error ?? "Login failed" };
      setCustomer(data.customer ?? null);
      return { ok: true };
    },
    [post]
  );

  const register = useCallback<CustomerAuthContextType["register"]>(
    async (input) => {
      const { res, data } = await post({ action: "register", ...input });
      if (!res.ok) return { ok: false, error: data.error ?? "Registration failed" };
      setCustomer(data.customer ?? null);
      return { ok: true };
    },
    [post]
  );

  const logout = useCallback(async () => {
    await post({ action: "logout" });
    setCustomer(null);
  }, [post]);

  const updateProfile = useCallback<CustomerAuthContextType["updateProfile"]>(
    async (patch) => {
      const { res, data } = await post({ action: "update", ...patch });
      if (!res.ok) return { ok: false, error: data.error ?? "Could not save profile" };
      setCustomer(data.customer ?? null);
      return { ok: true };
    },
    [post]
  );

  return (
    <CustomerAuthContext.Provider
      value={{ customer, loading, login, register, logout, updateProfile, refresh }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

export const useCustomer = () => {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error("useCustomer must be used within a CustomerAuthProvider");
  return ctx;
};
