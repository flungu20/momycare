"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const LS_PROFILE_KEY = "momycare_profile";

function computeStage(childYears: number) {
  if (childYears <= 3) return "0-3";
  if (childYears <= 7) return "3-7";
  if (childYears <= 12) return "7-12";
  return "12-20";
}

export default function OnboardingPage() {
  const router = useRouter();

  const [motherName, setMotherName] = useState("");
  const [childName, setChildName] = useState("");
  const [childAgeYears, setChildAgeYears] = useState(1);
  const [childAgeMonths, setChildAgeMonths] = useState(0);

  // dacă există profil -> direct home
  useEffect(() => {
    const raw = localStorage.getItem(LS_PROFILE_KEY);
    if (!raw) return;

    try {
      const p = JSON.parse(raw);
      if (p?.childName && (p?.childAgeYears !== undefined) && (p?.childAgeMonths !== undefined)) {
        router.replace("/home");
      }
    } catch {}
  }, [router]);

  const yearsOptions = useMemo(() => Array.from({ length: 21 }, (_, i) => i), []);
  const monthsOptions = useMemo(() => Array.from({ length: 12 }, (_, i) => i), []);

  const canContinue =
    motherName.trim().length >= 2 &&
    childName.trim().length >= 2 &&
    Number.isFinite(childAgeYears) &&
    Number.isFinite(childAgeMonths);

  function saveAndStart() {
    if (!canContinue) return;

    const stage = computeStage(childAgeYears);

    const profile = {
      motherName: motherName.trim(),
      childName: childName.trim(),
      childAgeYears,
      childAgeMonths,
      stage,
      updatedAt: new Date().toISOString(),
      version: 2,
    };

    localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(profile));

    // reset activități, ca să fie generate corect pe noul profil
    localStorage.removeItem("momycare_activities_v1");

    router.push("/home");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50">
      <div className="mx-auto max-w-md px-4 pt-10 pb-10">
        <div className="text-center">
          <div className="text-sm font-medium text-slate-500">MomyCare</div>
          <h1 className="mt-2 text-3xl font-semibold text-slate-800">Bine ai venit</h1>
          <p className="mt-2 text-sm text-slate-600">
            Setăm un profil simplu, ca să îți recomandăm activități potrivite.
          </p>
        </div>

        <div className="mt-8 space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-sm">
          <div>
            <label className="text-sm font-medium text-slate-700">Nume mamă</label>
            <input
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              placeholder="Ex: Ana"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Nume copil</label>
            <input
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Ex: Luca"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Vârsta copilului</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <select
                value={childAgeYears}
                onChange={(e) => setChildAgeYears(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-200"
              >
                {yearsOptions.map((y) => (
                  <option key={y} value={y}>
                    {y} ani
                  </option>
                ))}
              </select>

              <select
                value={childAgeMonths}
                onChange={(e) => setChildAgeMonths(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-200"
              >
                {monthsOptions.map((m) => (
                  <option key={m} value={m}>
                    {m} luni
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-2 text-xs text-slate-500">
              Etapa estimată:{" "}
              <span className="font-semibold text-slate-700">
                {computeStage(childAgeYears)}
              </span>
            </div>
          </div>

          <button
            onClick={saveAndStart}
            disabled={!canContinue}
            className={`w-full rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition ${
              canContinue
                ? "bg-rose-200 text-slate-900 hover:bg-rose-300"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            Start MomyCare
          </button>

          <p className="text-center text-xs text-slate-500">
            Fără diagnostic medical. Doar sprijin calm și idei simple.
          </p>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          “Care for your child. Care for you.”
        </div>
      </div>
    </div>
  );
}
