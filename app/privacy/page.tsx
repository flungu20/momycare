"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50">
      <div className="mx-auto max-w-md px-4 pt-8 pb-10">
        <div className="mb-6">
          <Link href="/landing" className="text-sm text-slate-600 hover:text-slate-800">
            ← Înapoi
          </Link>
        </div>

        <h1 className="text-2xl font-semibold text-slate-800">Privacy Policy (Draft)</h1>
        <p className="mt-2 text-sm text-slate-600">
          Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}
        </p>

        <div className="mt-6 space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-sm">
          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-800">1) Ce este MomyCare</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              MomyCare este o aplicație de suport general pentru părinți, cu activități pe vârstă
              și suport emoțional. MomyCare nu oferă diagnostic medical.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-800">2) Ce date stocăm (în demo)</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              În versiunea demo, datele sunt stocate local în browserul tău (localStorage), de ex:
              nume profil (mamă/copil), vârsta copilului, status Plus (demo), mesaje chat și planul
              de activități.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-800">3) Ce NU facem</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Nu vindem date. Nu facem profilare publicitară. Nu colectăm date medicale pentru
              diagnostic.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-800">4) Ștergerea datelor</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              În demo, poți șterge datele din aplicație folosind butonul <span className="font-semibold">Reset demo</span>{" "}
              din Profil sau prin ștergerea datelor site-ului din browser.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-slate-800">5) Contact</h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Pentru întrebări legate de confidențialitate, adaugă aici un email de suport când pregătești lansarea.
            </p>
          </section>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          “Care for your child. Care for you.”
        </div>
      </div>
    </div>
  );
}
