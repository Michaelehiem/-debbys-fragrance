"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { CartItem, Product, ProductSize } from "@/types";
import type { SavedCartItem } from "@/types/store";
import { useCustomer } from "@/context/CustomerAuthContext";

interface Toast {
  id: number;
  message: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedSize: ProductSize, quantity?: number) => void;
  removeFromCart: (productId: string, sizeName: string) => void;
  updateQuantity: (productId: string, sizeName: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  totalItems: number;
  toasts: Toast[];
  removeToast: (id: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

let toastIdCounter = 0;

function toSaved(cart: CartItem[]): SavedCartItem[] {
  return cart.map((i) => ({
    productId: i.product.id,
    size: i.selectedSize.size,
    quantity: i.quantity,
  }));
}

function hydrate(saved: SavedCartItem[], products: Product[]): CartItem[] {
  const byId = new Map(products.map((p) => [p.id, p]));
  const items: CartItem[] = [];
  for (const s of saved) {
    const product = byId.get(s.productId);
    const selectedSize = product?.sizes.find((sz) => sz.size === s.size);
    if (product && selectedSize && s.quantity > 0) {
      items.push({ product, selectedSize, quantity: s.quantity });
    }
  }
  return items;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { customer } = useCustomer();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const hydratedRef = useRef(false);
  const productsRef = useRef<Product[] | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load the guest cart once from localStorage.
  useEffect(() => {
    const saved = localStorage.getItem("debby_cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
    hydratedRef.current = true;
  }, []);

  // Persist the local copy on every change.
  useEffect(() => {
    if (!hydratedRef.current) return;
    localStorage.setItem("debby_cart", JSON.stringify(cart));
  }, [cart]);

  // When a customer signs in, merge their saved cart with the local one, then persist.
  useEffect(() => {
    if (!customer) return;
    let active = true;
    (async () => {
      try {
        const [cartRes, prodRes] = await Promise.all([
          fetch("/api/customer/cart", { cache: "no-store" }),
          productsRef.current
            ? Promise.resolve(null)
            : fetch("/api/products", { cache: "no-store" }),
        ]);
        const saved = cartRes.ok ? ((await cartRes.json()) as { cart: SavedCartItem[] }).cart : [];
        if (prodRes && prodRes.ok) {
          const data = (await prodRes.json()) as { products: Product[] };
          productsRef.current = data.products;
        }
        if (!active) return;
        const products = productsRef.current ?? [];
        const serverItems = hydrate(saved, products);

        setCart((local) => {
          const merged = new Map<string, CartItem>();
          const key = (i: CartItem) => `${i.product.id}::${i.selectedSize.size}`;
          for (const i of serverItems) merged.set(key(i), i);
          for (const i of local) {
            const k = key(i);
            const existing = merged.get(k);
            merged.set(k, existing ? { ...existing, quantity: Math.max(existing.quantity, i.quantity) } : i);
          }
          return Array.from(merged.values());
        });
      } catch {
        /* ignore — keep the local cart */
      }
    })();
    return () => {
      active = false;
    };
  }, [customer]);

  // Debounced push of the cart to the customer's account.
  useEffect(() => {
    if (!customer || !hydratedRef.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void fetch("/api/customer/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: toSaved(cart) }),
      }).catch(() => undefined);
    }, 800);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [cart, customer]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToCart = (product: Product, selectedSize: ProductSize, quantity: number = 1) => {
    setCart((current) => {
      const existingIndex = current.findIndex(
        (item) => item.product.id === product.id && item.selectedSize.size === selectedSize.size
      );
      if (existingIndex > -1) {
        const updated = [...current];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [...current, { product, selectedSize, quantity }];
    });

    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message: `${product.name} added to bag` }]);
    setTimeout(() => removeToast(id), 2500);
  };

  const removeFromCart = (productId: string, sizeName: string) => {
    setCart((current) =>
      current.filter(
        (item) => !(item.product.id === productId && item.selectedSize.size === sizeName)
      )
    );
  };

  const updateQuantity = (productId: string, sizeName: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, sizeName);
      return;
    }
    setCart((current) =>
      current.map((item) =>
        item.product.id === productId && item.selectedSize.size === sizeName
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.selectedSize.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        totalItems,
        toasts,
        removeToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
