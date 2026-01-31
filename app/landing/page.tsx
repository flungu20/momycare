"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50">
      <div className="mx-auto max-w-md px-4 pt-10 pb-10">
        <div className="text-center">
          <div className="text-sm font-medium text-slate-500">MomyCare</div>
          <h1 className="mt-3 text-4xl font-semibold text-slate-800 leading-tight">
            Care for your child.
            <br />
            Care for you.
          </h1>
          <p className="mt-4 text-sm text-slate-600 leading-relaxed">
            O aplicație calmă și cozy pentru părinți: activități pe vârstă pentru copil și
            sprijin emoțional pentru tine. Fără diagnostic medical.
          </p>
        </div>

        <div className="mt-8 space-y-3 rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-sm">
          <div className="rounded-xl bg-rose-50 p-3 text-sm text-slate-700">
            ✨ Recomandări simple, potrivite etapei (0–3, 3–7, 7–12, 12–20)
          </div>
          <div className="rounded-xl bg-rose-50 p-3 text-sm text-slate-700">
            🧩 Activități pe 7 zile (Plus demo) + activitatea de azi (Free demo)
          </div>
          <div className="rounded-xl bg-rose-50 p-3 text-sm text-slate-700">
            💬 Chat empatic (demo) cu limită zilnică pe Free
          </div>
          <div className="rounded-xl bg-rose-50 p-3 text-sm text-slate-700">
            🌧️ Sunete calmante (ploaie) care merg în fundal
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3">
          <Link
            href="/onboarding"
            className="w-full rounded-2xl bg-rose-200 px-4 py-4 text-center text-sm font-semibold text-slate-900 shadow-sm hover:bg-rose-300"
          >
            Începe acum
          </Link>

          <Link
            href="/home"
            className="w-full rounded-2xl bg-white px-4 py-4 text-center text-sm font-semibold text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50"
          >
            Continuă (dacă ai deja profil)
          </Link>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
          <Link href="/privacy" className="hover:text-slate-700">
            Privacy Policy
          </Link>
          <span className="text-slate-300">•</span>
          <Link href="/terms" className="hover:text-slate-700">
            Terms
          </Link>
        </div>

        <div className="mt-10 text-center text-xs text-slate-400">
          MomyCare · demo build
        </div>
      </div>
    </div>
  );
}
