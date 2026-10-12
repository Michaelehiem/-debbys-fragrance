"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    clearCart,
  } = useCart();
  const { overrides } = useAdmin();

  const shippingFee = subtotal >= 350000 || subtotal === 0 ? 0 : 5000;
  const grandTotal = subtotal + shippingFee;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 300 }}
              className="w-screen max-w-md bg-paper text-ink flex flex-col shadow-editorial"
            >
              {/* Header */}
              <div className="px-7 py-6 border-b border-ink/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-gold-700" />
                  <h2 className="font-serif text-xl font-bold text-ink">
                    Your shopping bag
                  </h2>
                  <span className="text-[10px] text-ink-soft/60">{cart.length}</span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-9 h-9 flex items-center justify-center text-ink-soft hover:text-ink transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart List */}
              <div className="flex-1 overflow-y-auto px-7 py-2 divide-y divide-ink/10">
                {cart.length > 0 ? (
                  cart.map((item) => {
                    const override = overrides[item.product.id];
                    const displayImage = override?.customImage || item.product.images[0];
                    const displayName = override?.customName || item.product.name;

                    return (
                      <div key={`${item.product.id}-${item.selectedSize.size}`} className="py-6 flex gap-5">
                        <div className="w-20 h-20 bg-[#efe7d8] overflow-hidden flex-shrink-0 border border-ink/10">
                          <img
                            src={displayImage}
                            alt={displayName}
                            className="object-cover w-full h-full"
                          />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-3">
                              <h3 className="font-serif text-base font-bold text-ink leading-snug">
                                {displayName}
                              </h3>
                              <button
                                onClick={() => removeFromCart(item.product.id, item.selectedSize.size)}
                                className="text-ink-soft/50 hover:text-[#a03c3c] transition-colors flex-shrink-0"
                                aria-label={`Remove ${displayName}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-xs text-gold-700 mt-1 font-medium">
                              {item.selectedSize.size}
                            </p>
                          </div>

                          <div className="flex justify-between items-center mt-3">
                            <div className="flex items-center border border-ink/20 bg-white">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.selectedSize.size, item.quantity - 1)}
                                className="px-2.5 py-1.5 text-ink-soft hover:text-ink"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.selectedSize.size, item.quantity + 1)}
                                className="px-2.5 py-1.5 text-ink-soft hover:text-ink"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <span className="font-serif font-bold text-ink text-base">
                              {formatNaira(item.selectedSize.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-24 text-center space-y-5">
                    <div className="w-16 h-16 mx-auto flex items-center justify-center border border-ink/15 bg-white text-ink-soft/50">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-sm text-ink-soft">Your bag is currently empty.</p>
                    <Link
                      href="/shop"
                      onClick={() => setIsCartOpen(false)}
                      className="inline-block bg-ink hover:bg-gold-700 text-paper text-[11px] font-semibold uppercase tracking-[0.2em] px-8 py-3.5 transition-colors"
                    >
                      Explore fragrances
                    </Link>
                  </div>
                )}
              </div>

              {/* Footer Summary */}
              {cart.length > 0 && (
                <div className="px-7 pt-6 pb-7 border-t border-ink/10 bg-paper-deep/50">
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-ink-soft/70">Subtotal</span>
                      <span className="font-semibold text-ink">{formatNaira(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ink-soft/70">Nationwide delivery</span>
                      <span className={shippingFee === 0 ? "text-gold-700 font-semibold" : ""}>
                        {shippingFee === 0 ? "FREE" : formatNaira(shippingFee)}
                      </span>
                    </div>
                    {subtotal < 350000 && (
                      <p className="text-[11px] text-gold-700 pt-1 leading-relaxed">
                        Add <span className="font-semibold">{formatNaira(350000 - subtotal)}</span> more for free delivery.
                      </p>
                    )}
                    <div className="flex justify-between pt-4 border-t border-ink/15 font-serif font-bold text-xl text-ink">
                      <span>Total</span>
                      <span>{formatNaira(grandTotal)}</span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Link
                      href="/checkout"
                      onClick={() => setIsCartOpen(false)}
                      className="w-full bg-ink hover:bg-gold-700 text-paper py-4 text-center text-xs font-semibold uppercase tracking-[0.22em] flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Proceed to Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={clearCart}
                      className="w-full text-[11px] uppercase tracking-[0.18em] text-ink-soft/50 hover:text-[#a03c3c] py-1 transition-colors"
                    >
                      Clear bag
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};