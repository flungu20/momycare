"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "../components/BottomNav";

type Msg = {
  role: "user" | "assistant";
  text: string;
  ts: number;
};

const LS_PLUS_KEY = "momycare_plus_demo";
const LS_CHAT_STATE_KEY = "momycare_chat_state_v1";

function dayKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

const DEMO_REPLY =
  "Te aud. Hai să o luăm încet. 💛\n\nSpune-mi într-o propoziție: ce ți-ar face azi ziua cu 5% mai ușoară?";

type ChatState = {
  dayKey: string;
  used: number;
  messages: Msg[];
};

export default function ChatPage() {
  const router = useRouter();
  const listRef = useRef<HTMLDivElement | null>(null);

  const [isPlus, setIsPlus] = useState(false);
  const [input, setInput] = useState("");
  const [used, setUsed] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Sunt aici cu tine. 💛\nScrie-mi ce simți — fără grabă, fără judecată.",
      ts: Date.now(),
    },
  ]);

  const today = useMemo(() => dayKey(new Date()), []);

  // load + reset daily
  useEffect(() => {
    setIsPlus(localStorage.getItem(LS_PLUS_KEY) === "true");

    const stored = safeParse<ChatState>(localStorage.getItem(LS_CHAT_STATE_KEY));
    if (!stored) return;

    if (stored.dayKey === today) {
      setUsed(stored.used ?? 0);
      if (Array.isArray(stored.messages) && stored.messages.length > 0) {
        setMessages(stored.messages);
      }
    } else {
      // zi nouă -> reset
      const fresh: ChatState = { dayKey: today, used: 0, messages };
      localStorage.setItem(LS_CHAT_STATE_KEY, JSON.stringify(fresh));
      setUsed(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today]);

  // persist
  useEffect(() => {
    const state: ChatState = {
      dayKey: today,
      used,
      messages,
    };
    localStorage.setItem(LS_CHAT_STATE_KEY, JSON.stringify(state));
  }, [today, used, messages]);

  // scroll to bottom
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const remaining = Math.max(0, 5 - used);

  function send() {
    const text = input.trim();
    if (!text) return;

    // limit for free
    if (!isPlus && used >= 5) {
      router.push("/subscribe");
      return;
    }

    const userMsg: Msg = { role: "user", text, ts: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    if (!isPlus) setUsed((u) => u + 1);

    // demo assistant reply
    setTimeout(() => {
      const assistantMsg: Msg = { role: "assistant", text: DEMO_REPLY, ts: Date.now() };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 350);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") send();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50 pb-24">
      <div className="mx-auto flex max-w-md flex-col px-4 pt-6">
        <div className="mb-3">
          <h1 className="text-2xl font-semibold text-slate-800">Chat</h1>
          <p className="mt-1 text-sm text-slate-600">
            {isPlus ? (
              <span>
                Plus (demo): <span className="font-medium text-slate-800">nelimitat</span>
              </span>
            ) : (
              <span>
                Free (demo): <span className="font-medium text-slate-800">{remaining}</span> mesaje
                rămase azi
              </span>
            )}
          </p>
        </div>

        {!isPlus && used >= 5 && (
          <div className="mb-3 rounded-2xl border border-rose-100 bg-rose-50 p-3 text-sm text-slate-700">
            Ai ajuns la limita de azi. Pentru nelimitat, activează <span className="font-semibold">Plus (demo)</span>.
            <button
              onClick={() => router.push("/subscribe")}
              className="mt-2 w-full rounded-xl bg-rose-200 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-rose-300"
            >
              Activează Plus (demo)
            </button>
          </div>
        )}

        <div
          ref={listRef}
          className="flex-1 overflow-auto rounded-2xl border border-rose-100 bg-white/80 p-3 shadow-sm"
          style={{ height: "58vh" }}
        >
          <div className="space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={[
                  "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-rose-200 text-slate-900"
                    : "mr-auto bg-slate-100 text-slate-800",
                ].join(" ")}
              >
                {m.text.split("\n").map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-rose-100 bg-white/80 p-3 shadow-sm">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Scrie aici…"
              disabled={!isPlus && used >= 5}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-200 disabled:bg-slate-50"
            />
            <button
              onClick={send}
              disabled={!input.trim() || (!isPlus && used >= 5)}
              className="rounded-xl bg-rose-200 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-rose-300 disabled:bg-slate-100 disabled:text-slate-400"
            >
              Trimite
            </button>
          </div>

          {!isPlus && (
            <div className="mt-2 text-xs text-slate-500">
              Limita se resetează automat mâine.
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
