"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { formatNaira } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Lock, Truck, MessageCircle, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const { overrides } = useAdmin();
  const [step, setStep] = useState<"details" | "success">("details");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Kebbi",
  });

  const shippingFee = subtotal >= 350000 || subtotal === 0 ? 0 : 5000;
  const grandTotal = subtotal + shippingFee;

  const buildWhatsAppMessage = () => {
    const lines: string[] = [];
    lines.push(`🏪 *${siteConfig.businessName.toUpperCase()}* - NEW ORDER`);
    lines.push("");

    cart.forEach((item, i) => {
      const override = overrides[item.product.id];
      const name = override?.customName || item.product.name;
      const price = override?.customPrice || item.selectedSize.price;
      lines.push(`${i + 1}. ${name} (${item.selectedSize.size}) x${item.quantity} - ${formatNaira(price * item.quantity)}`);
    });

    lines.push("");
    lines.push(`Subtotal: ${formatNaira(subtotal)}`);
    lines.push(`Delivery Fee: ${shippingFee === 0 ? "FREE (orders over " + formatNaira(350000) + ")" : formatNaira(shippingFee) + " (varies by location)"}`);
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
      <div className="min-h-screen bg-white text-zinc-900 py-16 px-4 font-sans flex items-center justify-center dark:bg-zinc-950 dark:text-zinc-100">
        <div className="max-w-md w-full bg-white border border-gold-500/40 p-8 rounded-2xl text-center space-y-6 shadow-2xl dark:bg-zinc-900">
          <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs text-gold-500 font-bold uppercase tracking-widest dark:text-gold-400">
              Order Submitted
            </span>
            <h1 className="font-serif text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Thank You For Your Order!
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Your order has been sent to <strong className="text-gold-600 dark:text-gold-400">{siteConfig.businessName}</strong> via WhatsApp. Our team will confirm your order and discuss delivery details.
            </p>
          </div>

          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 text-left text-xs space-y-2 dark:bg-zinc-950 dark:border-zinc-800">
            <div className="flex justify-between">
              <span className="text-zinc-400 dark:text-zinc-500">Recipient:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">{formData.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400 dark:text-zinc-500">Delivery Address:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">{formData.address}, {formData.city}, {formData.state}</span>
            </div>
            <div className="flex justify-between border-t border-zinc-200 pt-2 text-gold-600 font-bold dark:border-zinc-800 dark:text-gold-400">
              <span>Order Total:</span>
              <span>{formatNaira(grandTotal)}</span>
            </div>
          </div>

          <div className="flex items-start space-x-2 bg-gold-500/10 border border-gold-500/30 rounded-xl p-3 text-xs text-gold-600 dark:text-gold-300">
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
    <div className="min-h-screen bg-white text-zinc-900 py-12 px-4 sm:px-6 lg:px-8 font-sans dark:bg-zinc-950 dark:text-zinc-100">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div className="flex items-baseline space-x-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Checkout
            </h1>
            <span className="hidden sm:inline text-xs text-gold-600 font-bold uppercase tracking-widest dark:text-gold-400">
              · {siteConfig.businessName}
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-gold-400">
            <Lock className="w-4 h-4" />
            <span>Secure Order</span>
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
              <h2 className="font-serif text-lg font-bold text-gold-600 flex items-center space-x-2 dark:text-gold-400">
                <Truck className="w-5 h-5" />
                <span>1. Delivery Information</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-zinc-500 mb-1 dark:text-zinc-400">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Debby Ehiem"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-zinc-900 focus:outline-none focus:border-gold-500 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 mb-1 dark:text-zinc-400">Phone Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 800 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-zinc-900 focus:outline-none focus:border-gold-500 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-500 mb-1 dark:text-zinc-400">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="yourname@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-zinc-900 focus:outline-none focus:border-gold-500 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-zinc-500 mb-1 dark:text-zinc-400">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="House number, street, landmark"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-zinc-900 focus:outline-none focus:border-gold-500 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 mb-1 dark:text-zinc-400">City / Area *</label>
                  <input
                    type="text"
                    required
                    placeholder={`e.g. ${siteConfig.location.city}, Area name`}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-zinc-900 focus:outline-none focus:border-gold-500 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-zinc-500 mb-1 dark:text-zinc-400">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 text-zinc-900 focus:outline-none focus:border-gold-500 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-100"
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
              <AlertTriangle className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5 dark:text-gold-400" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-gold-600 dark:text-gold-300">Delivery Fees Apply Based on Location</p>
                <p className="text-zinc-500 dark:text-zinc-400">
                  The final delivery fee will be confirmed by our team via WhatsApp after you place your order.
                  Free delivery on orders over {formatNaira(350000)} within {siteConfig.location.city}.
                  Interstate shipping rates vary by destination.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-6 h-fit shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
            <h2 className="font-serif text-lg font-bold text-zinc-900 border-b border-zinc-200 pb-3 dark:text-zinc-100 dark:border-zinc-800">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
              {/* Cart Items */}
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {cart.map((item) => {
                  const override = overrides[item.product.id];
                  const name = override?.customName || item.product.name;
                  const price = override?.customPrice || item.selectedSize.price;
                  return (
                    <div key={`${item.product.id}-${item.selectedSize.size}`} className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-zinc-800 truncate font-medium dark:text-zinc-200">{name}</p>
                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500">{item.selectedSize.size} x{item.quantity}</p>
                      </div>
                      <span className="text-zinc-700 font-semibold ml-2 dark:text-zinc-300">{formatNaira(price * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-zinc-200 pt-2 dark:border-zinc-800">
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">Subtotal ({cart.length} items)</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatNaira(subtotal)}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Delivery Fee</span>
                <span className="text-gold-600 font-medium dark:text-gold-400">{shippingFee === 0 ? "FREE" : formatNaira(shippingFee) + " *"}</span>
              </div>

              <div className="flex justify-between pt-3 border-t border-zinc-200 text-sm font-bold text-gold-600 dark:border-zinc-800 dark:text-gold-400">
                <span>Total Due</span>
                <span>{formatNaira(grandTotal)}</span>
              </div>
            </div>

            <p className="text-[10px] text-zinc-400 leading-relaxed dark:text-zinc-500">
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
