"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, AdminProductOverride } from "@/types";
import { INITIAL_PRODUCTS } from "@/data/products";

interface AdminContextType {
  overrides: Record<string, AdminProductOverride>;
  customProducts: Product[];
  deletedProductIds: string[];
  allProducts: Product[];
  updateProductImage: (productId: string, imageBase64: string) => void;
  updateProductDetails: (productId: string, name?: string, price?: number, stock?: number) => void;
  resetProductOverride: (productId: string) => void;
  resetAllOverrides: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  restoreProduct: (productId: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [overrides, setOverrides] = useState<Record<string, AdminProductOverride>>({});
  const [customProducts, setCustomProducts] = useState<Product[]>([]);
  const [deletedProductIds, setDeletedProductIds] = useState<string[]>([]);

  useEffect(() => {
    const savedOverrides = localStorage.getItem("debby_admin_overrides");
    const savedCustom = localStorage.getItem("debby_admin_custom_products");
    const savedDeleted = localStorage.getItem("debby_admin_deleted_products");
    if (savedOverrides) {
      try { setOverrides(JSON.parse(savedOverrides)); } catch (e) { console.error("Failed to parse overrides", e); }
    }
    if (savedCustom) {
      try { setCustomProducts(JSON.parse(savedCustom)); } catch (e) { console.error("Failed to parse custom products", e); }
    }
    if (savedDeleted) {
      try { setDeletedProductIds(JSON.parse(savedDeleted)); } catch (e) { console.error("Failed to parse deleted products", e); }
    }
  }, []);

  const saveOverrides = (o: Record<string, AdminProductOverride>) => {
    setOverrides(o);
    localStorage.setItem("debby_admin_overrides", JSON.stringify(o));
  };

  const saveCustomProducts = (p: Product[]) => {
    setCustomProducts(p);
    localStorage.setItem("debby_admin_custom_products", JSON.stringify(p));
  };

  const saveDeletedIds = (ids: string[]) => {
    setDeletedProductIds(ids);
    localStorage.setItem("debby_admin_deleted_products", JSON.stringify(ids));
  };

  // Combined product list: (INITIAL_PRODUCTS minus deleted + custom)
  const allProducts: Product[] = [
    ...INITIAL_PRODUCTS.filter((p) => !deletedProductIds.includes(p.id)),
    ...customProducts,
  ];

  // Override-based operations (existing)
  const updateProductImage = (productId: string, imageBase64: string) => {
    const current = overrides[productId] || { id: productId };
    saveOverrides({ ...overrides, [productId]: { ...current, customImage: imageBase64 } });
  };

  const updateProductDetails = (productId: string, name?: string, price?: number, stock?: number) => {
    const current = overrides[productId] || { id: productId };
    saveOverrides({
      ...overrides,
      [productId]: {
        ...current,
        ...(name !== undefined && { customName: name }),
        ...(price !== undefined && { customPrice: price }),
        ...(stock !== undefined && { customStock: stock }),
      },
    });
  };

  const resetProductOverride = (productId: string) => {
    const copy = { ...overrides };
    delete copy[productId];
    saveOverrides(copy);
  };

  const resetAllOverrides = () => {
    saveOverrides({});
    saveCustomProducts([]);
    saveDeletedIds([]);
  };

  // Full CRUD operations
  const addProduct = (product: Product) => {
    saveCustomProducts([...customProducts, product]);
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    // Check if it's a custom product
    const customIndex = customProducts.findIndex((p) => p.id === productId);
    if (customIndex > -1) {
      const updated = [...customProducts];
      updated[customIndex] = { ...updated[customIndex], ...updates };
      saveCustomProducts(updated);
    }
    // For initial products, we use overrides
    if (updates.name) updateProductDetails(productId, updates.name);
    if (updates.sizes) updateProductDetails(productId, undefined, updates.sizes[0].price);
  };

  const deleteProduct = (productId: string) => {
    // If it's a custom product, remove from custom list
    const customIndex = customProducts.findIndex((p) => p.id === productId);
    if (customIndex > -1) {
      const updated = customProducts.filter((p) => p.id !== productId);
      saveCustomProducts(updated);
    } else {
      // Mark initial product as deleted
      saveDeletedIds([...deletedProductIds, productId]);
    }
    // Also clean up any overrides
    resetProductOverride(productId);
  };

  const restoreProduct = (productId: string) => {
    saveDeletedIds(deletedProductIds.filter((id) => id !== productId));
  };

  return (
    <AdminContext.Provider
      value={{
        overrides,
        customProducts,
        deletedProductIds,
        allProducts,
        updateProductImage,
        updateProductDetails,
        resetProductOverride,
        resetAllOverrides,
        addProduct,
        updateProduct,
        deleteProduct,
        restoreProduct,
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
