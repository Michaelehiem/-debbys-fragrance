"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, Check, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const faqs = [
    {
      q: "Where is Debby's Fragrance physical store located?",
      a: `Our boutique is located at ${siteConfig.location.shopAddress}. You are welcome to visit for scent sampling!`,
    },
    {
      q: "How long does shipping take across Nigeria?",
      a: "Orders are processed the same day and delivered within 1–3 business days nationwide. Remote areas may take slightly longer.",
    },
    {
      q: "Are your perfumes 100% authentic?",
      a: "Yes! Every fragrance bottle sold by Debby's Fragrance is 100% genuine and comes with our hologram authenticity seal.",
    },
    {
      q: "Can I upload custom pictures of perfumes to the website?",
      a: "Yes! As the store owner, you can access the Admin section from the navigation bar to upload your own custom perfume photos and update prices in Naira.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines: string[] = [];
    lines.push(`${siteConfig.businessName} - Contact Inquiry`);
    lines.push("");
    lines.push(`Name: ${formData.name}`);
    lines.push(`Email: ${formData.email}`);
    if (formData.subject) lines.push(`Subject: ${formData.subject}`);
    lines.push(`Message: ${formData.message}`);

    const whatsappNumber = siteConfig.socials.whatsapp.replace("https://wa.me/", "").replace(/[^0-9]/g, "");
    const message = lines.join("%0A");
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");

    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  const info = [
    { icon: MapPin, label: "Store address", value: siteConfig.location.shopAddress },
    { icon: Phone, label: "Phone / WhatsApp", value: siteConfig.contact.whatsapp },
    { icon: Mail, label: "Email concierge", value: siteConfig.contact.email },
    { icon: Clock, label: "Operating hours", value: "Monday – Saturday, 9AM – 7PM (WAT)" },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink pb-24 font-sans">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 pt-12 sm:pt-16 space-y-14">
        {/* Header */}
        <div className="text-center space-y-4 border-b border-ink/10 pb-10">
          <span className="eyebrow justify-center">We would love to hear from you</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-ink leading-tight">
            Contact &amp; boutique location
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <div className="bg-white border border-ink/10 p-7 sm:p-9 space-y-7 h-fit">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-2xl font-bold text-ink">Send a message</h2>
              <span className="section-num">01</span>
            </div>

            {submitted ? (
              <div className="border border-[#7a9a80] bg-[#e9f0e9] p-4 text-xs font-medium text-[#2d4a3e] flex items-center gap-2">
                <Check className="w-4 h-4" />
                Thank you! Your inquiry has been sent to our concierge team.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-sm">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-ink-soft/70 mb-2">Your full name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-gold-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-ink-soft/70 mb-2">Email address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-gold-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-ink-soft/70 mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Scent recommendation request"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-gold-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.18em] text-ink-soft/70 mb-2">Your message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist you with your fragrance search?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full border border-ink/15 bg-white px-4 py-3 text-ink placeholder:text-ink-soft/40 focus:outline-none focus:border-gold-600 transition-colors leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2d4a3e] hover:bg-[#244034] text-white py-4 uppercase tracking-[0.22em] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Send via WhatsApp
                </button>
              </form>
            )}
          </div>

          {/* Details & Location */}
          <div className="space-y-6">
            <div className="bg-white border border-ink/10 p-7 sm:p-9">
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="font-serif text-2xl font-bold text-ink">Boutique information</h2>
                <span className="section-num">02</span>
              </div>

              <div className="divide-y divide-ink/10 text-sm">
                {info.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="py-4 flex items-start gap-4">
                    <Icon className="w-5 h-5 text-gold-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-ink-soft/60 block mb-1">{label}</span>
                      <span className="text-ink-soft break-words">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Embedded Map Representation */}
            <div className="bg-ink text-paper p-7 sm:p-9">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-400">
                Interactive store location
              </span>
              <div className="mt-5 aspect-video w-full bg-noir-800 border border-paper/15 flex flex-col items-center justify-center gap-3 p-4 text-center">
                <MapPin className="w-9 h-9 text-gold-400" />
                <span className="font-serif text-xl font-bold text-paper">Debby&apos;s Fragrance Boutique</span>
                <span className="text-[11px] uppercase tracking-[0.2em] text-paper/50">{siteConfig.location.city}, {siteConfig.location.country}</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${siteConfig.location.shopAddress}, ${siteConfig.location.country}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 border-b border-gold-400 text-gold-400 text-[11px] uppercase tracking-[0.18em] hover:border-transparent transition-colors"
                >
                  Open in maps
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="space-y-8 pt-16 border-t border-ink/10">
          <div className="text-center space-y-4">
            <span className="section-num mx-auto" />
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink">
              Frequently asked questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto border border-ink/10 bg-white">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-ink/10 last:border-b-0">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-6 py-5 text-left font-serif font-bold text-base text-ink flex justify-between items-center gap-4 hover:text-gold-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${
                      openFaqIndex === index ? "rotate-180 text-gold-700" : "text-ink-soft/40"
                    }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-6 text-sm text-ink-soft leading-relaxed border-t border-ink/10 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}