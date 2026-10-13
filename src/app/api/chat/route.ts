import { NextResponse } from "next/server";
import { STORE } from "@/lib/constants";

export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are "Debby", the friendly support assistant for ${STORE.name}, a luxury perfume boutique in Nigeria.

Store facts:
- Business: ${STORE.name} — ${STORE.tagline}
- Location: ${STORE.address}
- Phone / WhatsApp: ${STORE.phone}
- Email: ${STORE.supportEmail}
- Products: authentic designer-inspired perfumes and oud oils, sold in 5ml, 10ml, 25ml, 30ml, 50ml and 100ml sizes.
- Delivery: nationwide across Nigeria, delivered within 1–3 business days. FREE delivery on orders over ₦350,000. Delivery fees for other orders vary by location and are confirmed on WhatsApp after checkout.
- Payment: orders are completed via WhatsApp — the team replies with payment details.
- Fragrance families: floral, woody, oriental, fresh, citrus, gourmand.

Guidelines:
- Be warm, concise and helpful. Keep replies under ~80 words unless the customer asks for detail.
- Help with: choosing a scent, sizes, notes, delivery, placing an order, and order status.
- If asked about an order, direct them to open the tracking link from their order confirmation, or to message the WhatsApp number.
- Never invent product names or prices; tell them to browse the shop for the current catalogue.
- If you cannot help, offer the WhatsApp number.
- Do not discuss anything unrelated to the store.`;

export async function POST(request: Request) {
  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const messages = (body.messages ?? []).filter((m) => m && m.content && m.role);
  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      reply:
        `I'm not fully set up yet, but I can still help! Message us on WhatsApp at ${STORE.phone} and our team will assist you right away.`,
    });
  }

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { temperature: 0.6, maxOutputTokens: 400 },
        }),
      }
    );

    if (!res.ok) {
      return NextResponse.json({
        reply: `Sorry, I'm having trouble right now. Please message us on WhatsApp at ${STORE.phone}.`,
      });
    }

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const reply =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim() ||
      `I'm not sure how to answer that — message us on WhatsApp at ${STORE.phone} and we'll help!`;

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({
      reply: `Sorry, something went wrong. Please reach us on WhatsApp at ${STORE.phone}.`,
    });
  }
}
