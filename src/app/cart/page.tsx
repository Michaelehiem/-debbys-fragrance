"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { formatNaira } from "@/lib/utils";
import { Trash2, ArrowRight, ShoppingBag, ArrowUpRight } from "lucide-react";
import { QtyStepper } from "@/components/ui/QtyStepper";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const { overrides } = useAdmin();

  const shippingFee = subtotal >= 350000 || subtotal === 0 ? 0 : 5000;
  const grandTotal = subtotal + shippingFee;

  return (
    <div className="min-h-screen bg-paper text-ink py-12 sm:py-16 font-sans">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-10">
        <div className="border-b border-ink/10 pb-6">
          <span className="section-num">Your Selection</span>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl font-bold text-ink">
            Shopping cart <span className="text-gold-700">({cart.length})</span>
          </h1>
        </div>

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                const override = overrides[item.product.id];
                const displayImage = override?.customImage || item.product.images[0];
                const displayName = override?.customName || item.product.name;

                return (
                  <div
                    key={`${item.product.id}-${item.selectedSize.size}`}
                    className="bg-white border border-ink/10 p-5 sm:p-6 flex items-center gap-5"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 overflow-hidden bg-[#efe7d8] border border-ink/10">
                      <img src={displayImage} alt={displayName} className="object-cover w-full h-full" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-gold-700 block">
                            {item.product.brand}
                          </span>
                          <Link
                            href={`/product/${item.product.id}`}
                            className="font-serif text-lg font-bold text-ink hover:text-gold-700 transition-colors line-clamp-1"
                          >
                            {displayName}
                          </Link>
                          <span className="text-xs text-ink-soft/60">{item.selectedSize.size}</span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedSize.size)}
                          className="text-ink-soft/50 hover:text-[#a03c3c] transition-colors p-1 flex-shrink-0"
                          aria-label={`Remove ${displayName}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center pt-1">
                        <QtyStepper
                          value={item.quantity}
                          onChange={(q) => updateQuantity(item.product.id, item.selectedSize.size, q)}
                        />

                        <span className="font-serif font-bold text-xl text-ink">
                          {formatNaira(item.selectedSize.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-between items-center pt-6">
                <Link href="/shop" className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-ink-soft hover:text-gold-700 transition-colors">
                  ← Continue shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="text-xs uppercase tracking-[0.18em] text-ink-soft/50 hover:text-[#a03c3c] transition-colors"
                >
                  Clear cart
                </button>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="bg-white border border-ink/10 p-7 h-fit space-y-6">
              <h2 className="font-serif text-2xl font-bold text-ink border-b border-ink/10 pb-4">
                Order summary
              </h2>

              <div className="space-y-3 text-sm text-ink-soft">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-ink">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated shipping</span>
                  <span className={shippingFee === 0 ? "font-semibold text-gold-700" : ""}>
                    {shippingFee === 0 ? "FREE" : formatNaira(shippingFee)}
                  </span>
                </div>
                {subtotal < 350000 && (
                  <p className="text-[11px] text-gold-700 leading-relaxed pt-1">
                    Add <span className="font-semibold">{formatNaira(350000 - subtotal)}</span> more to qualify for free delivery.
                  </p>
                )}
                <div className="flex justify-between pt-4 border-t border-ink/10 font-serif font-bold text-2xl text-ink">
                  <span>Total</span>
                  <span>{formatNaira(grandTotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-ink hover:bg-gold-700 text-paper py-4 text-center text-xs font-semibold uppercase tracking-[0.22em] flex items-center justify-center gap-2 transition-colors group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="text-[10px] uppercase tracking-[0.16em] text-ink-soft/40 text-center">
                Secure order via WhatsApp
              </p>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            message="No fragrances selected yet. Explore the collection and find your signature scent."
            action={
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-ink hover:bg-gold-700 text-paper text-xs font-semibold uppercase tracking-[0.2em] px-8 py-4 transition-colors"
              >
                Explore the collection
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}