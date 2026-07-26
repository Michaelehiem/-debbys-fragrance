"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { formatNaira } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Lock, Truck, Tag, Check, X, MessageCircle, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const { overrides } = useAdmin();
  const [step, setStep] = useState<"details" | "success">("details");
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState(false);

  const PROMO_CODES: Record<string, number> = siteConfig.promoCodes;

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

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Kebbi",
  });

  const shippingFee = subtotal >= 100000 || subtotal === 0 ? 0 : 5000;
  const grandTotal = subtotal - discountAmount + shippingFee;

  const buildWhatsAppMessage = () => {
    const lines: string[] = [];
    lines.push(`${siteConfig.businessName} - New Order`);
    lines.push("");

    cart.forEach((item, i) => {
      const override = overrides[item.product.id];
      const name = override?.customName || item.product.name;
      const price = override?.customPrice || item.selectedSize.price;
      lines.push(`${i + 1}. ${name} (${item.selectedSize.size}) x${item.quantity} - ${formatNaira(price * item.quantity)}`);
    });

    lines.push("");
    lines.push(`Subtotal: ${formatNaira(subtotal)}`);
    if (discountAmount > 0) {
      lines.push(`Promo (${appliedPromo} -${discountPercent}%): -${formatNaira(discountAmount)}`);
    }
    lines.push(`Delivery Fee: ${shippingFee === 0 ? "FREE (orders over " + formatNaira(100000) + ")" : formatNaira(shippingFee) + " (varies by location)"}`);
    lines.push(`Total: ${formatNaira(grandTotal)}`);
    lines.push("");
    lines.push("---");
    lines.push(`Name: ${formData.fullName}`);
    lines.push(`Phone: ${formData.phone}`);
    lines.push(`Email: ${formData.email}`);
    lines.push(`Address: ${formData.address}, ${formData.city}, ${formData.state}`);
    lines.push("");
    lines.push("Note: Delivery fees apply based on your location. The final delivery cost will be confirmed by the seller.");

    return lines.join("%0A");
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      alert("Please fill in all required shipping details.");
      return;
    }

    const whatsappNumber = siteConfig.socials.whatsapp.replace("https://wa.me/", "").replace(/[^0-9]/g, "");
    const message = buildWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    clearCart();
    setStep("success");
    window.open(whatsappUrl, "_blank");
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
              Order Submitted
            </span>
            <h1 className="font-serif text-2xl font-bold text-zinc-100">
              Thank You For Your Order!
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your order has been sent to {siteConfig.businessName} via WhatsApp. Our team will confirm your order and discuss delivery details.
            </p>
          </div>

          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-zinc-500">Recipient:</span>
              <span className="font-semibold text-zinc-200">{formData.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Delivery Address:</span>
              <span className="font-semibold text-zinc-200">{formData.address}, {formData.city}, {formData.state}</span>
            </div>
            <div className="flex justify-between border-t border-zinc-800 pt-2 text-gold-400 font-bold">
              <span>Order Total:</span>
              <span>{formatNaira(grandTotal)}</span>
            </div>
          </div>

          <div className="flex items-start space-x-2 bg-gold-500/10 border border-gold-500/30 rounded-xl p-3 text-xs text-gold-300">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Delivery fees vary by location and will be confirmed by the seller on WhatsApp.</span>
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
            Checkout
          </h1>
          <div className="flex items-center space-x-1.5 text-xs text-gold-400">
            <Lock className="w-4 h-4" />
            <span>Secure Order</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <h2 className="font-serif text-lg font-bold text-gold-400 flex items-center space-x-2">
                <Truck className="w-5 h-5" />
                <span>1. Delivery Information</span>
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
                    placeholder={`e.g. ${siteConfig.location.city}, Area name`}
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
                    <option>Abia</option>
                    <option>Adamawa</option>
                    <option>Akwa Ibom</option>
                    <option>Anambra</option>
                    <option>Bauchi</option>
                    <option>Bayelsa</option>
                    <option>Benue</option>
                    <option>Borno</option>
                    <option>Cross River</option>
                    <option>Delta</option>
                    <option>Ebonyi</option>
                    <option>Edo</option>
                    <option>Ekiti</option>
                    <option>Enugu</option>
                    <option>FCT (Abuja)</option>
                    <option>Gombe</option>
                    <option>Imo</option>
                    <option>Jigawa</option>
                    <option>Kaduna</option>
                    <option>Kano</option>
                    <option>Katsina</option>
                    <option>Kebbi</option>
                    <option>Kogi</option>
                    <option>Kwara</option>
                    <option>Lagos</option>
                    <option>Nasarawa</option>
                    <option>Niger</option>
                    <option>Ogun</option>
                    <option>Ondo</option>
                    <option>Osun</option>
                    <option>Oyo</option>
                    <option>Plateau</option>
                    <option>Rivers</option>
                    <option>Sokoto</option>
                    <option>Taraba</option>
                    <option>Yobe</option>
                    <option>Zamfara</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Delivery Notice */}
            <div className="bg-gold-500/10 border border-gold-500/30 rounded-2xl p-5 flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-gold-300">Delivery Fees Apply Based on Location</p>
                <p className="text-zinc-400">
                  The final delivery fee will be confirmed by our team via WhatsApp after you place your order.
                  Free delivery on orders over {formatNaira(100000)} within {siteConfig.location.city}.
                  Interstate shipping rates vary by destination.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6 h-fit">
            <h2 className="font-serif text-lg font-bold text-zinc-100 border-b border-zinc-800 pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs text-zinc-300">
              {/* Cart Items */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cart.map((item) => {
                  const override = overrides[item.product.id];
                  const name = override?.customName || item.product.name;
                  const price = override?.customPrice || item.selectedSize.price;
                  return (
                    <div key={`${item.product.id}-${item.selectedSize.size}`} className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-zinc-200 truncate font-medium">{name}</p>
                        <p className="text-[10px] text-zinc-500">{item.selectedSize.size} x{item.quantity}</p>
                      </div>
                      <span className="text-zinc-300 font-semibold ml-2">{formatNaira(price * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-zinc-800 pt-2">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.length} items)</span>
                  <span className="font-semibold text-zinc-100">{formatNaira(subtotal)}</span>
                </div>
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
                <span>Delivery Fee</span>
                <span className="text-gold-400 font-medium">{shippingFee === 0 ? "FREE" : formatNaira(shippingFee) + " *"}</span>
              </div>

              <div className="flex justify-between pt-3 border-t border-zinc-800 text-sm font-bold text-gold-400">
                <span>Total Due</span>
                <span>{formatNaira(grandTotal)}</span>
              </div>
            </div>

            <p className="text-[10px] text-zinc-500 leading-relaxed">
              * Final delivery fee varies by location and will be confirmed via WhatsApp.
            </p>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 via-green-500 to-green-400 hover:brightness-110 text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest shadow-xl flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Place Order via WhatsApp</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
