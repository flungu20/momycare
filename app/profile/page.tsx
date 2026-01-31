"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "../components/BottomNav";

const LS_PROFILE_KEY = "momycare_profile";

function computeStage(childYears: number) {
  if (childYears <= 3) return "0-3";
  if (childYears <= 7) return "3-7";
  if (childYears <= 12) return "7-12";
  return "12-20";
}

export default function ProfilePage() {
  const router = useRouter();

  const [motherName, setMotherName] = useState("");
  const [childName, setChildName] = useState("");
  const [childAgeYears, setChildAgeYears] = useState(1);
  const [childAgeMonths, setChildAgeMonths] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(LS_PROFILE_KEY);
    if (!raw) {
      router.replace("/onboarding");
      return;
    }

    try {
      const p = JSON.parse(raw);
      setMotherName(p.motherName || "");
      setChildName(p.childName || "");
      setChildAgeYears(p.childAgeYears ?? 1);
      setChildAgeMonths(p.childAgeMonths ?? 0);
    } catch {
      router.replace("/onboarding");
    }
  }, [router]);

  function saveProfile() {
    const profile = {
      motherName: motherName.trim(),
      childName: childName.trim(),
      childAgeYears,
      childAgeMonths,
      stage: computeStage(childAgeYears),
      updatedAt: new Date().toISOString(),
      version: 2,
    };

    localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(profile));

    // regenerăm activitățile pentru noua vârstă
    localStorage.removeItem("momycare_activities_v1");

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function resetDemo() {
    if (!confirm("Sigur vrei să resetezi tot demo-ul?")) return;

    localStorage.clear();
    router.replace("/onboarding");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50 pb-24">
      <div className="mx-auto max-w-md px-4 pt-6">
        <h1 className="text-2xl font-semibold text-slate-800">Profil</h1>
        <p className="mt-1 text-sm text-slate-600">
          Poți modifica datele oricând.
        </p>

        <div className="mt-4 space-y-4 rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-sm">
          <div>
            <label className="text-sm font-medium text-slate-700">Nume mamă</label>
            <input
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Nume copil</label>
            <input
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-rose-200"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Vârsta copilului
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <select
                value={childAgeYears}
                onChange={(e) => setChildAgeYears(Number(e.target.value))}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
              >
                {Array.from({ length: 21 }, (_, i) => i).map((y) => (
                  <option key={y} value={y}>
                    {y} ani
                  </option>
                ))}
              </select>

              <select
                value={childAgeMonths}
                onChange={(e) => setChildAgeMonths(Number(e.target.value))}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
              >
                {Array.from({ length: 12 }, (_, i) => i).map((m) => (
                  <option key={m} value={m}>
                    {m} luni
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-2 text-xs text-slate-500">
              Etapă estimată:{" "}
              <span className="font-semibold text-slate-700">
                {computeStage(childAgeYears)}
              </span>
            </div>
          </div>

          <button
            onClick={saveProfile}
            className="w-full rounded-xl bg-rose-200 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-rose-300"
          >
            Salvează modificările
          </button>

          {saved && (
            <div className="text-center text-sm text-green-600">
              Profil salvat ✓
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-red-100 bg-white/80 p-4 shadow-sm">
          <div className="text-sm font-medium text-red-600">
            Zonă demo
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Resetează aplicația ca la prima deschidere.
          </p>

          <button
            onClick={resetDemo}
            className="mt-3 w-full rounded-xl bg-red-100 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-200"
          >
            Reset demo / onboarding
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
