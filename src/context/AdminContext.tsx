"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, AdminProductOverride } from "@/types";
import { INITIAL_PRODUCTS } from "@/data/products";

interface AdminContextType {
  /** Full, server-backed catalogue. Falls back to the seed list until the first fetch resolves. */
  allProducts: Product[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addProduct: (product: Product) => Promise<boolean>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
  /**
   * @deprecated Product edits now live on the server, so there are no separate overrides.
   * Kept as an always-empty map so existing components that read `overrides[id]` keep working.
   */
  overrides: Record<string, AdminProductOverride>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const EMPTY_OVERRIDES: Record<string, AdminProductOverride> = {};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allProducts, setAllProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load products");
      const data = (await res.json()) as { products?: Product[] };
      if (Array.isArray(data.products) && data.products.length > 0) {
        setAllProducts(data.products);
      }
      setError(null);
    } catch {
      setError("Could not load the live catalogue. Showing the default range.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addProduct = useCallback(
    async (product: Product) => {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      if (!res.ok) return false;
      await refresh();
      return true;
    },
    [refresh]
  );

  const updateProduct = useCallback(
    async (productId: string, updates: Partial<Product>) => {
      const res = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      if (!res.ok) return false;
      await refresh();
      return true;
    },
    [refresh]
  );

  const deleteProduct = useCallback(
    async (productId: string) => {
      const res = await fetch(`/api/products/${encodeURIComponent(productId)}`, {
        method: "DELETE",
      });
      if (!res.ok) return false;
      await refresh();
      return true;
    },
    [refresh]
  );

  return (
    <AdminContext.Provider
      value={{
        allProducts,
        loading,
        error,
        refresh,
        addProduct,
        updateProduct,
        deleteProduct,
        overrides: EMPTY_OVERRIDES,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within an AdminProvider");
  return context;
};
