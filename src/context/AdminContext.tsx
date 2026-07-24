"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AdminProductOverride } from "@/types";

interface AdminContextType {
  overrides: Record<string, AdminProductOverride>;
  updateProductImage: (productId: string, imageBase64: string) => void;
  updateProductDetails: (productId: string, name?: string, price?: number, stock?: number) => void;
  resetProductOverride: (productId: string) => void;
  resetAllOverrides: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [overrides, setOverrides] = useState<Record<string, AdminProductOverride>>({});

  useEffect(() => {
    const saved = localStorage.getItem("debby_admin_overrides");
    if (saved) {
      try {
        setOverrides(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved admin overrides", e);
      }
    }
  }, []);

  const saveOverrides = (newOverrides: Record<string, AdminProductOverride>) => {
    setOverrides(newOverrides);
    localStorage.setItem("debby_admin_overrides", JSON.stringify(newOverrides));
  };

  const updateProductImage = (productId: string, imageBase64: string) => {
    const current = overrides[productId] || { id: productId };
    const updated = {
      ...overrides,
      [productId]: {
        ...current,
        customImage: imageBase64,
      },
    };
    saveOverrides(updated);
  };

  const updateProductDetails = (productId: string, name?: string, price?: number, stock?: number) => {
    const current = overrides[productId] || { id: productId };
    const updated = {
      ...overrides,
      [productId]: {
        ...current,
        ...(name !== undefined && { customName: name }),
        ...(price !== undefined && { customPrice: price }),
        ...(stock !== undefined && { customStock: stock }),
      },
    };
    saveOverrides(updated);
  };

  const resetProductOverride = (productId: string) => {
    const copy = { ...overrides };
    delete copy[productId];
    saveOverrides(copy);
  };

  const resetAllOverrides = () => {
    saveOverrides({});
  };

  return (
    <AdminContext.Provider
      value={{
        overrides,
        updateProductImage,
        updateProductDetails,
        resetProductOverride,
        resetAllOverrides,
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
