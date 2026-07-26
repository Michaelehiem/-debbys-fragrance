"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, Check } from "lucide-react";
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
      a: "Deliveries within Kebbi take 24 hours. Express courier deliveries to Lagos, Port Harcourt, Kano, and other states take 2-4 business days.",
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

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 font-sans space-y-16">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold-400">
            We Would Love To Hear From You
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-100">
            Contact & Boutique Location
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-xl font-bold text-zinc-100">Send Us a Message</h2>

            {submitted ? (
              <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 p-4 rounded-xl text-xs font-semibold flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Thank you! Your inquiry has been sent to our concierge team.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Scent Recommendation Request"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist you with your fragrance search?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 via-green-500 to-green-400 hover:from-green-500 hover:to-green-300 text-white font-bold py-3.5 rounded-xl uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </button>
              </form>
            )}
          </div>

          {/* Details & Location */}
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 text-xs">
              <h2 className="font-serif text-xl font-bold text-zinc-100">Boutique Information</h2>

              <div className="space-y-3 text-zinc-300">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-bold text-zinc-100 block">Store Address</span>
                    <span>{siteConfig.location.shopAddress}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-zinc-100 block">Phone / WhatsApp</span>
                    <span>{siteConfig.contact.whatsapp}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-zinc-100 block">Email Concierge</span>
                    <span>{siteConfig.contact.email}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-zinc-100 block">Operating Hours</span>
                    <span>Monday - Saturday: 9:00 AM - 7:00 PM (WAT)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Map Representation */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-400">
                Interactive Store Location
              </span>
              <div className="aspect-video w-full rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center space-y-2 p-4 text-xs">
                <MapPin className="w-8 h-8 text-gold-400 animate-bounce" />
                <span className="font-bold text-zinc-200">Debby's Fragrance Boutique</span>
                <span className="text-[10px] text-zinc-400">{siteConfig.location.city}, {siteConfig.location.country}</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="space-y-6 pt-12 border-t border-zinc-800">
          <div className="text-center space-y-2">
            <span className="text-xs text-gold-400 font-bold uppercase tracking-widest">
              Got Questions?
            </span>
            <h2 className="font-serif text-2xl font-bold text-zinc-100">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full p-4 text-left font-serif font-bold text-sm text-zinc-100 flex justify-between items-center hover:text-gold-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openFaqIndex === index ? "rotate-180 text-gold-400" : "text-zinc-500"
                    }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className="px-4 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/60 pt-3">
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
