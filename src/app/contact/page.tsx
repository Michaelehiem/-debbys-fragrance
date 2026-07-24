"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, ChevronDown, Check } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Where is Debby's Fragrance physical store located?",
      a: "Our flagship boutique is located at Shop K2, Trademore Estate Phase 2 Market, Kubwa, Abuja, Nigeria. You are welcome to visit for scent sampling!",
    },
    {
      q: "How long does shipping take across Nigeria?",
      a: "Deliveries within Abuja take 24 hours. Express courier deliveries to Lagos, Port Harcourt, Kano, and other states take 2-4 business days.",
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
    setSubmitted(true);
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
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="e.g. Scent Recommendation Request"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist you with your fragrance search?"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-zinc-950 font-bold py-3.5 rounded-xl uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
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
                    <span className="font-bold text-zinc-100 block">Abuja Store Address</span>
                    <span>Shop K2, Trademore Estate Phase 2 Market, Kubwa, Abuja, Nigeria</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-zinc-100 block">Phone / WhatsApp</span>
                    <span>+234 (0) 800 DEBBY SCENT</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-zinc-100 block">Email Concierge</span>
                    <span>concierge@debbysfragrance.com</span>
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
                <span className="text-[10px] text-zinc-400">Kubwa, Abuja, Nigeria</span>
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
