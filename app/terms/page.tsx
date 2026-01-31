"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50">
      <div className="mx-auto max-w-md px-4 pt-8 pb-10">
        <div className="mb-6">
          <Link href="/landing" className="text-sm text-slate-600 hover:text-slate-800">
            ← Înapoi
          </Link>
        </div>

        <h1 className="text-2xl font-semibold text-slate-800">Terms (Draft)</h1>
        <p className="mt-2 text-sm text-slate-600">
          Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}
        </p>

        <div className="mt-6 space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-sm">
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-800">1) Utilizare</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              MomyCare oferă suport general și idei de activități. Nu înlocuiește sfatul medical.
              Dacă ai îngrijorări serioase, contactează un specialist.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-800">2) Limitări demo</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Unele funcții sunt simulate (Plus demo, răspunsuri AI demo). Comportamentul se poate schimba la lansarea finală.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-800">3) Responsabilitate</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Folosești aplicația pe propria răspundere. MomyCare nu oferă diagnostic și nu garantează rezultate specifice.
            </p>
          </section>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          MomyCare · demo build
        </div>
      </div>
    </div>
  );
}
