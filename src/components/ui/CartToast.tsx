"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const CartToast: React.FC = () => {
  const { toasts, removeToast, isCartOpen, setIsCartOpen, totalItems } = useCart();

  return (
    <>
      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto bg-white border border-gold-500/40 rounded-xl px-4 py-3 shadow-2xl flex items-center space-x-3 max-w-xs dark:bg-zinc-900"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-950 border border-emerald-600 flex items-center justify-center flex-shrink-0">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <span className="text-xs text-zinc-800 font-medium flex-1 dark:text-zinc-200">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-zinc-400 hover:text-zinc-700 flex-shrink-0 dark:text-zinc-500 dark:hover:text-zinc-300"
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
          className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold text-xs px-5 py-3 rounded-xl shadow-xl shadow-gold-950/50 uppercase tracking-wider flex items-center space-x-2 transition-all"
        >
          <span>View Bag ({totalItems})</span>
        </motion.button>
      )}
    </>
  );
};
