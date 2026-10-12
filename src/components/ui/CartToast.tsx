"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { Check, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CartToast: React.FC = () => {
  const { toasts, removeToast, isCartOpen, setIsCartOpen, totalItems } = useCart();

  return (
    <>
      {/* Toast notifications */}
      <div className="fixed bottom-24 right-6 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto bg-ink text-paper border border-gold-600/40 px-4 py-3 shadow-editorial flex items-center gap-3 max-w-xs"
            >
              <div className="w-7 h-7 rounded-full bg-gold-600 flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5 text-ink" />
              </div>
              <span className="text-xs font-medium flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-paper/50 hover:text-paper flex-shrink-0 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating "View Bag" button — appears when cart has items and drawer is closed */}
      {!isCartOpen && totalItems > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 left-6 z-50 bg-ink text-paper hover:bg-gold-700 text-[11px] font-semibold px-5 py-3.5 uppercase tracking-[0.18em] shadow-editorial flex items-center gap-2 transition-colors"
        >
          <ShoppingBag className="w-4 h-4 text-gold-400" />
          View Bag ({totalItems})
        </motion.button>
      )}
    </>
  );
};