import { NextResponse } from "next/server";

export const runtime = "nodejs";

type OpenAIMsg = { role: "system" | "user" | "assistant"; content: string };

const SYSTEM_PROMPT =
  "You are MomyCare, a warm, calm AI companion for mothers. Be short, kind, and reassuring. Never give medical diagnosis.";

const DEMO_REPLY =
  "Te aud 🤍 E firesc să te simți obosită.\n\nPentru azi, fă un lucru mic: un pahar cu apă și 3 respirații lente.\nVrei să-mi spui ce te apasă cel mai mult: somnul, rutina, plânsul sau gândurile?";

function isDemoMode() {
  // default: true (ca să nu lovești OpenAI fără să vrei)
  const v = (process.env.DEMO_MODE ?? "true").toLowerCase();
  return v !== "false";
}

function normalizeBody(body: any): OpenAIMsg[] {
  // Acceptă:
  // A) { messages: [{role, content}] }  (stil OpenAI)
  // B) { message: "text", history: [{role, text}] } (stil intern)
  // C) orice altceva -> fallback
  if (Array.isArray(body?.messages)) {
    return body.messages
      .filter((m: any) => m?.role && (m?.content || m?.text))
      .map((m: any) => ({
        role: m.role,
        content: String(m.content ?? m.text),
      }));
  }

  const msg = String(body?.message ?? "").trim();
  const history = Array.isArray(body?.history) ? body.history : [];

  const histMsgs: OpenAIMsg[] = history
    .filter((m: any) => m?.role && m?.text)
    .map((m: any) => ({ role: m.role, content: String(m.text) }));

  if (msg) histMsgs.push({ role: "user", content: msg });

  return histMsgs;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const userMessages = normalizeBody(body);

    // DEMO MODE: nu încercăm OpenAI deloc
    if (isDemoMode()) {
      return NextResponse.json({ message: DEMO_REPLY }, { status: 200 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { message: "Cheia OpenAI lipsește. Verifică .env.local din rădăcina proiectului." },
        { status: 200 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...userMessages],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    // fallback dacă nu ai billing/credit
    if (data?.error?.code === "insufficient_quota") {
      return NextResponse.json({ message: DEMO_REPLY }, { status: 200 });
    }

    if (data?.error) {
      return NextResponse.json(
        {
          message: "Îți sunt alături 🤍 Acum am o mică problemă tehnică. Poți încerca din nou peste un minut?",
          error: data.error,
        },
        { status: 200 }
      );
    }

    const out = data?.choices?.[0]?.message?.content;
    if (!out) {
      return NextResponse.json(
        { message: "Nu am primit un răspuns complet. Mai încerci o dată?" },
        { status: 200 }
      );
    }

    return NextResponse.json({ message: out }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Eroare server. Mai încearcă o dată.", details: err?.message },
      { status: 200 }
    );
  }
}
