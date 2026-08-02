"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { formatNaira } from "@/lib/utils";

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

  if (!isCartOpen) return null;

  const shippingFee = subtotal >= 350000 || subtotal === 0 ? 0 : 5000;
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity dark:bg-zinc-950/80"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-gold-500/30 text-zinc-900 flex flex-col shadow-2xl dark:bg-zinc-950 dark:text-zinc-100">
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 flex items-center justify-between dark:border-zinc-800">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              <h2 className="font-serif text-lg font-bold text-gold-300">
                Your Shopping Bag
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-zinc-200 dark:divide-zinc-800/80">
            {cart.length > 0 ? (
              cart.map((item, index) => {
                const override = overrides[item.product.id];
                const displayImage = override?.customImage || item.product.images[0];
                const displayName = override?.customName || item.product.name;

                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize.size}`}
                    className={`flex space-x-4 ${index > 0 ? "pt-6" : ""}`}
                  >
                    <div className="w-20 h-20 bg-zinc-900 rounded-lg overflow-hidden flex-shrink-0 relative border border-zinc-800">
                      <img
                        src={displayImage}
                        alt={displayName}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-medium text-zinc-900 truncate dark:text-zinc-100">
                            {displayName}
                          </h3>
                          <button
                            onClick={() =>
                              removeFromCart(item.product.id, item.selectedSize.size)
                            }
                            className="text-zinc-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gold-500 font-semibold mt-0.5">
                          Size: {item.selectedSize.size}
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">
                          {formatNaira(item.selectedSize.price)} each
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        {/* Quantity Adjuster */}
                        <div className="flex items-center space-x-2 border border-zinc-800 rounded bg-zinc-900 px-2 py-1">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedSize.size,
                                item.quantity - 1
                              )
                            }
                            className="text-zinc-400 hover:text-zinc-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.selectedSize.size,
                                item.quantity + 1
                              )
                            }
                            className="text-zinc-400 hover:text-zinc-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-gold-400">
                          {formatNaira(item.selectedSize.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm text-zinc-400">Your shopping bag is currently empty.</p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block bg-gold-600 hover:bg-gold-500 text-zinc-950 text-xs font-bold px-6 py-2.5 rounded uppercase tracking-wider transition-colors"
                >
                  Explore Fragrances
                </Link>
              </div>
            )}
          </div>

          {/* Footer Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-zinc-200 bg-zinc-50/50 space-y-4 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="space-y-2 text-xs text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Subtotal</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Estimated Shipping (Nigeria)</span>
                  <span>{shippingFee === 0 ? "FREE" : formatNaira(shippingFee)}</span>
                </div>
                {subtotal < 350000 && (
                  <p className="text-[10px] text-gold-500 pt-1 dark:text-gold-400">
                    Add {formatNaira(350000 - subtotal)} more to qualify for Free Shipping!
                  </p>
                )}
                <div className="flex justify-between pt-2 border-t border-zinc-800 text-sm font-bold text-gold-400">
                  <span>Total</span>
                  <span>{formatNaira(grandTotal)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:brightness-110 text-zinc-950 font-bold py-3 px-4 rounded text-center text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-lg shadow-gold-950/50"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={clearCart}
                  className="w-full text-[11px] text-zinc-500 hover:text-rose-400 py-1 transition-colors text-center"
                >
                  Clear Bag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
