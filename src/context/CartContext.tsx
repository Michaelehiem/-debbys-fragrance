"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CartItem, Product, ProductSize } from "@/types";

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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("debby_cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("debby_cart", JSON.stringify(newCart));
  };

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToCart = (product: Product, selectedSize: ProductSize, quantity: number = 1) => {
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.selectedSize.size === selectedSize.size
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      saveCart(updated);
    } else {
      saveCart([...cart, { product, selectedSize, quantity }]);
    }

    // Show toast instead of opening cart drawer
    const id = ++toastIdCounter;
    const displayName = product.name;
    setToasts((prev) => [...prev, { id, message: `${displayName} added to bag` }]);
    setTimeout(() => removeToast(id), 2500);
  };

  const removeFromCart = (productId: string, sizeName: string) => {
    const updated = cart.filter(
      (item) => !(item.product.id === productId && item.selectedSize.size === sizeName)
    );
    saveCart(updated);
  };

  const updateQuantity = (productId: string, sizeName: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, sizeName);
      return;
    }
    const updated = cart.map((item) => {
      if (item.product.id === productId && item.selectedSize.size === sizeName) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.selectedSize.price * item.quantity,
    0
  );

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
