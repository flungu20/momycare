"use client";

import { useEffect, useState } from "react";

export default function EnvBadge() {
  const [mode, setMode] = useState<"demo" | "real" | null>(null);

  useEffect(() => {
    // Nu putem citi direct process.env pe client în mod sigur,
    // așa că folosim un semn local: dacă există cheia DEMO_MODE în localStorage (setată de noi),
    // sau fallback pe un endpoint (mai jos). Ca să fie simplu: citim de la /api/mode.
    fetch("/api/mode")
      .then((r) => r.json())
      .then((d) => setMode(d?.demo === true ? "demo" : "real"))
      .catch(() => setMode(null));
  }, []);

  if (process.env.NODE_ENV !== "development") return null;
  if (!mode) return null;

  return (
    <div className="fixed top-3 left-1/2 z-[999] -translate-x-1/2">
      <div
        className={[
          "rounded-full px-3 py-1 text-xs font-semibold border shadow-sm",
          mode === "demo"
            ? "bg-rose-50 text-slate-800 border-rose-200"
            : "bg-emerald-50 text-slate-800 border-emerald-200",
        ].join(" ")}
      >
        {mode === "demo" ? "🤖 AI Demo" : "🧠 AI Real"}
      </div>
    </div>
  );
}
