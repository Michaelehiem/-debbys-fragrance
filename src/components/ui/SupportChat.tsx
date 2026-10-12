"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content: `Hi, I'm Debby — your fragrance assistant. Ask me about scents, sizes, delivery or your order.`,
};

const WHATSAPP = siteConfig.socials.whatsapp.replace(/[^\d]/g, "");

export function SupportChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-10) }),
      });
      const data = (await res.json()) as { reply?: string };
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "Sorry, please try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Sorry, please reach us on WhatsApp at ${siteConfig.contact.phone}.` },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open support chat"}
        className="fixed bottom-6 left-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper shadow-editorial transition-colors hover:bg-gold-700"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed bottom-24 left-6 z-50 flex h-[30rem] w-[min(22rem,calc(100vw-3rem))] flex-col border border-ink/10 bg-paper shadow-editorial">
          <div className="flex items-center gap-2 border-b border-ink/10 bg-ink px-4 py-3 text-paper">
            <Sparkles className="h-4 w-4 text-gold-400" />
            <div>
              <p className="text-sm font-semibold">Ask Debby</p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-paper/60">
                AI fragrance assistant
              </p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-gold-500/20 text-ink"
                    : "bg-white text-ink-soft border border-ink/10"
                }`}
              >
                {m.content}
              </div>
            ))}
            {sending && (
              <div className="flex gap-1 px-1 py-2">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft/40" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft/40 [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-soft/40 [animation-delay:300ms]" />
              </div>
            )}
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-ink/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a scent…"
              className="flex-1 border border-ink/15 bg-white px-3 py-2 text-sm focus:border-gold-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send message"
              className="flex h-9 w-9 items-center justify-center bg-ink text-paper transition-colors hover:bg-gold-700 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border-t border-ink/10 bg-white py-2 text-center text-[10px] uppercase tracking-[0.16em] text-ink-soft hover:text-gold-700"
          >
            Chat with a person on WhatsApp
          </a>
        </div>
      )}
    </>
  );
}
