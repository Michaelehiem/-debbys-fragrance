"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatNaira } from "@/lib/utils";
import { Lock, ShieldCheck, CheckCircle2, ArrowRight, CreditCard, Building2, Truck, Tag, Check, X } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<"details" | "success">("details");
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState(false);

  const PROMO_CODES: Record<string, number> = {
    DEBBY10: 10,
    WELCOME15: 15,
    VIP20: 20,
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoError(false);
    } else {
      setPromoError(true);
      setAppliedPromo(null);
      setTimeout(() => setPromoError(false), 3000);
    }
  };

  const discountPercent = appliedPromo ? PROMO_CODES[appliedPromo] : 0;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Abuja (FCT)",
    paymentMethod: "card",
  });

  const shippingFee = subtotal >= 100000 || subtotal === 0 ? 0 : 5000;
  const grandTotal = subtotal - discountAmount + shippingFee;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("Please fill in your shipping details.");
      return;
    }
    clearCart();
    setStep("success");
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 py-16 px-4 font-sans flex items-center justify-center">
        <div className="max-w-md w-full bg-zinc-900 border border-gold-500/40 p-8 rounded-2xl text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs text-gold-400 font-bold uppercase tracking-widest">
              Order Confirmed #DF-2026-884
            </span>
            <h1 className="font-serif text-2xl font-bold text-zinc-100">
              Thank You For Your Order!
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your fragrance order has been received. Our concierge team in Abuja is preparing your hand-sealed box for delivery.
            </p>
          </div>

          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-500">Recipient:</span>
              <span className="font-semibold text-zinc-200">{formData.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Delivery Address:</span>
              <span className="font-semibold text-zinc-200">{formData.address}, {formData.state}</span>
            </div>
            <div className="flex justify-between border-t border-zinc-800 pt-2 text-gold-400 font-bold">
              <span>Amount Paid:</span>
              <span>{formatNaira(grandTotal)}</span>
            </div>
          </div>

          <Link
            href="/shop"
            className="block w-full bg-gradient-to-r from-gold-600 to-gold-400 text-zinc-950 font-bold py-3 rounded-xl uppercase text-xs tracking-wider"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-100">
            Secure Checkout
          </h1>
          <div className="flex items-center space-x-1.5 text-xs text-gold-400">
            <Lock className="w-4 h-4" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h2 className="font-serif text-lg font-bold text-gold-400 flex items-center space-x-2">
                <Truck className="w-5 h-5" />
                <span>1. Shipping Address (Nigeria)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Debby Ehiem"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 800 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="yourname@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-400 mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="House number, street, landmark"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">City / Area *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kubwa, Maitama, Ikeja"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-gold-500"
                  >
                    <option>Abuja (FCT)</option>
                    <option>Lagos</option>
                    <option>Rivers (Port Harcourt)</option>
                    <option>Kano</option>
                    <option>Oyo (Ibadan)</option>
                    <option>Enugu</option>
                    <option>Delta</option>
                    <option>Other State in Nigeria</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h2 className="font-serif text-lg font-bold text-gold-400 flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>2. Payment Option</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <label className="border border-gold-500 bg-gold-500/10 rounded-xl p-4 cursor-pointer flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    defaultChecked
                    className="accent-gold-500"
                  />
                  <div>
                    <span className="font-bold text-zinc-100 block">Paystack / Flutterwave</span>
                    <span className="text-[10px] text-zinc-400">Debit Card, Bank Transfer, USSD</span>
                  </div>
                </label>

                <label className="border border-zinc-800 bg-zinc-950 rounded-xl p-4 cursor-pointer flex items-center space-x-3 opacity-60">
                  <input type="radio" name="payment" disabled />
                  <div>
                    <span className="font-bold text-zinc-100 block">Pay on Delivery</span>
                    <span className="text-[10px] text-zinc-400">Available in Abuja only</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 h-fit">
            <h2 className="font-serif text-lg font-bold text-zinc-100 border-b border-zinc-800 pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-semibold text-zinc-100">{formatNaira(subtotal)}</span>
              </div>

              {/* Promo Code */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <label className="text-xs text-zinc-400 font-medium flex items-center space-x-1.5">
                  <Tag className="w-3 h-3" />
                  <span>Promo Code</span>
                </label>
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-emerald-950/60 border border-emerald-700 rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-bold text-emerald-300">{appliedPromo} (-{discountPercent}%)</span>
                    </div>
                    <button
                      onClick={() => { setAppliedPromo(null); setPromoCode(""); }}
                      className="text-emerald-400 hover:text-rose-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="e.g. DEBBY10"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className={`flex-1 bg-zinc-950 border rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none transition-colors ${
                        promoError ? "border-rose-500" : "border-zinc-800 focus:border-gold-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-bold px-4 py-2 rounded-lg transition-all"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {promoError && (
                  <p className="text-[10px] text-rose-400">Invalid code. Try DEBBY10, WELCOME15, or VIP20.</p>
                )}
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({discountPercent}%)</span>
                  <span className="font-semibold">-{formatNaira(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>{shippingFee === 0 ? "FREE" : formatNaira(shippingFee)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-zinc-800 text-sm font-bold text-gold-400">
                <span>Total Due</span>
                <span>{formatNaira(grandTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 hover:brightness-110 text-zinc-950 font-bold py-4 rounded-xl text-xs uppercase tracking-widest shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Place Order · {formatNaira(grandTotal)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
