"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { formatNaira } from "@/lib/utils";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const { overrides } = useAdmin();

  const shippingFee = subtotal >= 350000 || subtotal === 0 ? 0 : 5000;
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-white text-zinc-900 py-12 px-5 sm:px-6 lg:px-8 font-sans dark:bg-zinc-950 dark:text-zinc-100">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-900 border-b border-zinc-200 pb-4 dark:text-zinc-100 dark:border-zinc-800">
          Shopping Cart ({cart.length} items)
        </h1>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const override = overrides[item.product.id];
                const displayImage = override?.customImage || item.product.images[0];
                const displayName = override?.customName || item.product.name;

                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize.size}`}
                    className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 flex items-center space-x-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-800"
                  >
                    <div className="w-24 h-24 bg-zinc-100 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800">
                      <img
                        src={displayImage}
                        alt={displayName}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] text-gold-400 font-semibold uppercase tracking-wider block">
                            {item.product.brand}
                          </span>
                          <h3 className="font-serif font-bold text-zinc-900 truncate dark:text-zinc-100">
                            {displayName}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedSize.size)}
                          className="text-zinc-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs text-zinc-400">
                        Size: <span className="text-gold-400 font-bold">{item.selectedSize.size}</span>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center space-x-3 border border-zinc-300 rounded-lg bg-white px-3 py-1 dark:border-zinc-800 dark:bg-zinc-950">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.selectedSize.size, item.quantity - 1)
                            }
                            className="text-zinc-400 hover:text-zinc-100"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.selectedSize.size, item.quantity + 1)
                            }
                            className="text-zinc-400 hover:text-zinc-100"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-serif font-bold text-gold-400 text-base">
                          {formatNaira(item.selectedSize.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-between items-center pt-4">
                <Link
                  href="/shop"
                  className="text-xs text-gold-400 hover:text-gold-300 font-semibold"
                >
                  ← Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="text-xs text-zinc-500 hover:text-rose-400"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-6 h-fit shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
              <h2 className="font-serif text-lg font-bold text-zinc-900 border-b border-zinc-200 pb-3 dark:text-zinc-100 dark:border-zinc-800">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping (Nigeria)</span>
                  <span>{shippingFee === 0 ? "FREE" : formatNaira(shippingFee)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-zinc-200 text-sm font-bold text-gold-600 dark:border-zinc-800 dark:text-gold-400">
                  <span>Total</span>
                  <span>{formatNaira(grandTotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:brightness-110 text-zinc-950 font-bold py-3.5 px-4 rounded-xl text-center text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center bg-zinc-50/60 rounded-2xl border border-zinc-200 space-y-4 dark:bg-zinc-900/40 dark:border-zinc-800">
            <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto" />
            <p className="text-zinc-500 text-sm dark:text-zinc-400">Your shopping cart is empty.</p>
            <Link
              href="/shop"
              className="inline-block bg-gold-600 hover:bg-gold-500 text-zinc-950 font-bold text-xs px-6 py-3 rounded-xl uppercase tracking-wider"
            >
              Explore Collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
