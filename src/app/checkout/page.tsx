"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminContext";
import { useCustomer } from "@/context/CustomerAuthContext";
import { formatNaira } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Lock, Truck, MessageCircle, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import type { Order } from "@/types/store";

export default function CheckoutPage() {
  const { cart, subtotal, clearCart } = useCart();
  const { overrides } = useAdmin();
  const { customer } = useCustomer();
  const [step, setStep] = useState<"details" | "success">("details");
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Kebbi",
  });

  // Prefill from the signed-in customer's saved details.
  useEffect(() => {
    if (!customer) return;
    setFormData((prev) => ({
      ...prev,
      fullName: prev.fullName || customer.name || "",
      email: prev.email || customer.email || "",
      phone: prev.phone || customer.phone || "",
      address: prev.address || customer.address?.address || "",
      city: prev.city || customer.address?.city || "",
      state: prev.state !== "Kebbi" ? prev.state : customer.address?.state || "Kebbi",
    }));
  }, [customer]);

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

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      alert("Please fill in all required shipping details.");
      return;
    }

    const whatsappNumber = siteConfig.socials.whatsapp.replace("https://wa.me/", "").replace(/[^0-9]/g, "");
    const message = buildWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    // Open WhatsApp synchronously (inside the click handler) so the popup isn't blocked,
    // then persist the order so the customer gets a shareable tracking link.
    window.open(whatsappUrl, "_blank");

    const items = cart.map((item) => {
      const override = overrides[item.product.id];
      return {
        productId: item.product.id,
        name: override?.customName || item.product.name,
        price: override?.customPrice || item.selectedSize.price,
        qty: item.quantity,
        image: item.product.images[0] ?? "",
        size: item.selectedSize.size,
      };
    });

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          subtotal,
          shipping: shippingFee,
          total: grandTotal,
          customer: { name: formData.fullName, phone: formData.phone, email: formData.email },
          delivery: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: "Nigeria",
          },
          paymentMethod: "whatsapp",
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as { order: Order };
        setPlacedOrder(data.order);
      }
    } catch {
      // Order still went out via WhatsApp; tracking just won't be available yet.
    }

    clearCart();
    setStep("success");
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-paper text-ink py-16 px-4 font-sans flex items-center justify-center">
        <div className="max-w-md w-full bg-white border border-gold-600/40 p-8 sm:p-10 text-center space-y-7 shadow-editorial">
          <div className="w-16 h-16 rounded-full bg-[#e9f0e9] border border-[#7a9a80] text-[#2d4a3e] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-3">
            <span className="text-[11px] text-gold-700 font-semibold uppercase tracking-[0.24em]">
              Order submitted
            </span>
            <h1 className="font-serif text-3xl font-bold text-ink">
              Thank you for your order
            </h1>
            {placedOrder && (
              <p className="text-sm font-semibold text-ink">
                Order{" "}
                <span className="text-gold-700">{placedOrder.number}</span>
              </p>
            )}
            <p className="text-sm text-ink-soft leading-relaxed">
              Your order has been sent to <strong className="text-gold-700">{siteConfig.businessName}</strong> via WhatsApp. Our team will confirm your order and delivery details shortly.
            </p>
          </div>

          <div className="bg-paper-deep/40 border border-ink/10 p-5 text-left text-sm space-y-2.5">
            <div className="flex justify-between gap-4">
              <span className="text-ink-soft/60">Recipient</span>
              <span className="font-semibold text-ink">{formData.fullName}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-ink-soft/60">Address</span>
              <span className="font-semibold text-ink text-right">{formData.address}, {formData.city}, {formData.state}</span>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-2.5 font-serif font-bold text-lg text-gold-700">
              <span>Order total</span>
              <span>{formatNaira(grandTotal)}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-gold-500/10 border border-gold-600/30 p-4 text-xs text-gold-800 leading-relaxed text-left">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            Delivery fees vary by location and will be confirmed by the seller on WhatsApp.
          </div>

          {placedOrder && (
            <Link
              href={`/order/${placedOrder.id}`}
              className="block w-full border border-gold-600 bg-gold-500/10 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-gold-800 transition-colors hover:bg-gold-500/20"
            >
              Track this order
            </Link>
          )}

          <Link
            href="/shop"
            className="block w-full bg-ink hover:bg-gold-700 text-paper py-4 uppercase text-xs tracking-[0.22em] font-semibold transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink py-12 sm:py-16 font-sans">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 space-y-10">
        <div className="flex items-center justify-between border-b border-ink/10 pb-6">
          <div className="flex items-baseline gap-4">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-ink">
              Checkout
            </h1>
            <span className="hidden sm:inline text-[11px] text-gold-700 font-semibold uppercase tracking-[0.2em]">
              · {siteConfig.businessName}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-ink-soft/60">
            <Lock className="w-4 h-4" />
            Secure order
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Shipping Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-ink/10 p-6 sm:p-8">
              <h2 className="font-serif text-2xl font-bold text-ink flex items-center gap-3">
                <Truck className="w-5 h-5 text-gold-700" />
                1. Delivery information
              </h2>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-ink-soft/70 mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Debby Ehiem"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-gold-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-ink-soft/70 mb-2">Phone (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 800 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-gold-600 transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-ink-soft/70 mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="yourname@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-gold-600 transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-ink-soft/70 mb-2">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="House number, street, landmark"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-gold-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-ink-soft/70 mb-2">City / Area *</label>
                  <input
                    type="text"
                    required
                    placeholder={`e.g. ${siteConfig.location.city}, Area name`}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-gold-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-ink-soft/70 mb-2">State *</label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full border border-ink/15 bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold-600 transition-colors cursor-pointer"
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
            <div className="bg-gold-500/10 border border-gold-600/30 p-6 flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-gold-700 flex-shrink-0 mt-0.5" />
              <div className="text-sm space-y-1.5">
                <p className="font-semibold text-gold-800">Delivery fees apply based on location</p>
                <p className="text-ink-soft leading-relaxed">
                  The final delivery fee is confirmed via WhatsApp after you order. Free delivery on orders over {formatNaira(350000)} within {siteConfig.location.city}. Interstate rates vary.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="bg-white border border-ink/10 p-7 h-fit space-y-6">
            <h2 className="font-serif text-2xl font-bold text-ink border-b border-ink/10 pb-4">
              Order summary
            </h2>

            <div className="space-y-3 text-sm text-ink-soft">
              {/* Cart Items */}
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {cart.map((item) => {
                  const override = overrides[item.product.id];
                  const name = override?.customName || item.product.name;
                  const price = override?.customPrice || item.selectedSize.price;
                  return (
                    <div key={`${item.product.id}-${item.selectedSize.size}`} className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-ink font-medium line-clamp-1">{name}</p>
                        <p className="text-[11px] text-ink-soft/50">{item.selectedSize.size} × {item.quantity}</p>
                      </div>
                      <span className="text-ink font-semibold whitespace-nowrap">{formatNaira(price * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-ink/10 pt-3">
                <div className="flex justify-between">
                  <span className="text-ink-soft/70">Subtotal ({cart.length} items)</span>
                  <span className="font-semibold text-ink">{formatNaira(subtotal)}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-ink-soft/70">Delivery fee</span>
                <span className="text-gold-700 font-medium">{shippingFee === 0 ? "FREE" : formatNaira(shippingFee) + " *"}</span>
              </div>

              <div className="flex justify-between pt-4 border-t border-ink/10 font-serif font-bold text-2xl text-ink">
                <span>Total due</span>
                <span>{formatNaira(grandTotal)}</span>
              </div>
            </div>

            <p className="text-[10px] text-ink-soft/50 leading-relaxed">
              * Final delivery fee varies by location and is confirmed via WhatsApp.
            </p>

            <button
              type="submit"
              className="w-full bg-[#2d4a3e] hover:bg-[#244034] text-white py-4 text-xs uppercase tracking-[0.22em] font-semibold shadow-editorial-sm flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Place order via WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}