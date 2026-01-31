"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "../components/BottomNav";

type Category = "motricitate" | "limbaj" | "emotii";
type AgeStage = "0-3" | "3-7" | "7-12" | "12-20";

type Activity = {
  id: string;
  title: string;
  description: string;
  category: Category;
  stage: AgeStage;
  durationMin: number;
};

type DayPlan = {
  dateKey: string; // YYYY-MM-DD
  activityId: string;
};

const LS_PROFILE_KEY = "momycare_profile";
const LS_ACTIVITIES_KEY = "momycare_activities_v1";
const LS_PLUS_KEY = "momycare_plus_demo"; // true/false

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toDateKey(d: Date) {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatNiceDate(dateKey: string) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("ro-RO", { weekday: "short", day: "2-digit", month: "short" });
}

function safeJsonParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

const ACTIVITIES: Activity[] = [
  // 0-3
  { id: "a0", title: "Turnul moale", description: "Stivuiți 3–5 cuburi moi. Lasă copilul să dărâme turnul și numiți culorile împreună.", category: "motricitate", stage: "0-3", durationMin: 8 },
  { id: "a1", title: "Sunete de animale", description: "Alegeți 3 animale și faceți sunetele lor. Încurajează copilul să repete sau să arate cu degetul.", category: "limbaj", stage: "0-3", durationMin: 6 },
  { id: "a2", title: "Oglinda emoțiilor", description: "În oglindă, faceți fețe: fericit, trist, surprins. Spune pe rând cum se numește emoția.", category: "emotii", stage: "0-3", durationMin: 5 },

  // 3-7
  { id: "b0", title: "Traseu prin casă", description: "Fă un mini-traseu: sari peste o pernă, mergi pe vârfuri, treci pe sub o masă. În ritm calm.", category: "motricitate", stage: "3-7", durationMin: 10 },
  { id: "b1", title: "Poveste în 3 propoziții", description: "Începi cu o propoziție, copilul continuă, apoi tu închei. Repetă cu alt subiect.", category: "limbaj", stage: "3-7", durationMin: 8 },
  { id: "b2", title: "Termometrul emoțiilor", description: "Desenează un termometru 1–5. Azi, cât de mare e emoția? Ce o micșorează?", category: "emotii", stage: "3-7", durationMin: 7 },

  // 7-12
  { id: "c0", title: "Provocarea de coordonare", description: "Aruncă o minge ușoară de 10 ori și numără. Apoi schimbă mâna. Fără presiune, doar joacă.", category: "motricitate", stage: "7-12", durationMin: 10 },
  { id: "c1", title: "Cuvântul zilei", description: "Alege un cuvânt nou. Spuneți 2 sinonime și inventați o propoziție amuzantă cu el.", category: "limbaj", stage: "7-12", durationMin: 7 },
  { id: "c2", title: "Jurnal de recunoștință", description: "Scrieți 3 lucruri bune de azi. Unul mic, unul mediu, unul mare. Fără judecată.", category: "emotii", stage: "7-12", durationMin: 8 },

  // 12-20
  { id: "d0", title: "Stretch & reset", description: "3 minute de întinderi ușoare + 2 minute respirație. Discutați ce simte corpul după.", category: "motricitate", stage: "12-20", durationMin: 7 },
  { id: "d1", title: "Dezbate calm", description: "Alegeți un subiect neutru (ex: ce film). Fiecare spune 2 argumente, apoi rezumați ce a zis celălalt.", category: "limbaj", stage: "12-20", durationMin: 12 },
  { id: "d2", title: "Numește emoția", description: "Alegeți o situație de azi. Numește emoția, intensitatea 1–10 și un pas mic care ajută.", category: "emotii", stage: "12-20", durationMin: 10 },
];

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function computeStage(childYears: number): AgeStage {
  if (childYears <= 3) return "0-3";
  if (childYears <= 7) return "3-7";
  if (childYears <= 12) return "7-12";
  return "12-20";
}

export default function ActivitiesPage() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [selectedDayKey, setSelectedDayKey] = useState<string>(() => toDateKey(new Date()));
  const [stage, setStage] = useState<AgeStage>("0-3");
  const [plan, setPlan] = useState<DayPlan[]>([]);
  const [isPlus, setIsPlus] = useState(false);

  const todayKey = useMemo(() => toDateKey(new Date()), []);

  useEffect(() => {
    const plusRaw = localStorage.getItem(LS_PLUS_KEY);
    setIsPlus(plusRaw === "true");

    const profile = safeJsonParse<any>(localStorage.getItem(LS_PROFILE_KEY));
    const years = Number(profile?.childAgeYears ?? 0);
    setStage(computeStage(Number.isFinite(years) ? years : 0));
  }, []);

  const weekKeys = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => toDateKey(addDays(today, i)));
  }, []);

  useEffect(() => {
    const stored = safeJsonParse<DayPlan[]>(localStorage.getItem(LS_ACTIVITIES_KEY));
    if (stored && weekKeys.every((k) => stored.some((p) => p.dateKey === k))) {
      setPlan(stored);
      return;
    }

    const stageActivities = ACTIVITIES.filter((a) => a.stage === stage);
    const fresh: DayPlan[] = weekKeys.map((k) => ({
      dateKey: k,
      activityId: pickRandom(stageActivities).id,
    }));

    setPlan(fresh);
    localStorage.setItem(LS_ACTIVITIES_KEY, JSON.stringify(fresh));
  }, [stage, weekKeys]);

  const activitiesForStage = useMemo(
    () => ACTIVITIES.filter((a) => a.stage === stage),
    [stage]
  );

  const categoryLabel: Record<Category | "all", string> = {
    all: "Toate",
    motricitate: "Motricitate",
    limbaj: "Limbaj",
    emotii: "Emoții",
  };

  const dayActivity = useMemo(() => {
    const found = plan.find((p) => p.dateKey === selectedDayKey);
    return activitiesForStage.find((a) => a.id === found?.activityId) ?? null;
  }, [plan, selectedDayKey, activitiesForStage]);

  const filteredWeek = useMemo(() => {
    return weekKeys
      .map((k) => {
        const p = plan.find((x) => x.dateKey === k);
        const a = activitiesForStage.find((x) => x.id === p?.activityId);
        return { dateKey: k, activity: a ?? null };
      })
      .filter(({ activity }) => {
        if (!activity) return true;
        if (selectedCategory === "all") return true;
        return activity.category === selectedCategory;
      });
  }, [weekKeys, plan, activitiesForStage, selectedCategory]);

  function canOpenDay(dateKey: string) {
    if (isPlus) return true;
    return dateKey === todayKey; // Free vede doar azi
  }

  function onSelectDay(dateKey: string) {
    if (!canOpenDay(dateKey)) {
      router.push("/subscribe");
      return;
    }
    setSelectedDayKey(dateKey);
  }

  function regenerateForDay(dateKey: string) {
    if (!isPlus) {
      router.push("/subscribe");
      return;
    }

    const pool = activitiesForStage.filter((a) =>
      selectedCategory === "all" ? true : a.category === selectedCategory
    );
    if (pool.length === 0) return;

    const next = pickRandom(pool);
    const updated = plan.map((p) => (p.dateKey === dateKey ? { ...p, activityId: next.id } : p));

    setPlan(updated);
    localStorage.setItem(LS_ACTIVITIES_KEY, JSON.stringify(updated));
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50 pb-24">
      <div className="mx-auto max-w-md px-4 pt-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-slate-800">Activități</h1>
          <p className="mt-1 text-sm text-slate-600">
            Etapa: <span className="font-medium text-slate-800">{stage}</span>{" "}
            · Plan:{" "}
            <span className="font-medium text-slate-800">{isPlus ? "Plus (demo)" : "Free (demo)"}</span>
          </p>
        </div>

        <div className="mb-4 rounded-2xl border border-rose-100 bg-white/80 p-3 shadow-sm">
          <div className="text-sm font-medium text-slate-700">Filtre</div>
          <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
            {(["all", "motricitate", "limbaj", "emotii"] as const).map((c) => {
              const active = selectedCategory === c;
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={[
                    "whitespace-nowrap rounded-full px-4 py-2 text-sm transition",
                    active ? "bg-rose-200 text-slate-900" : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                  ].join(" ")}
                >
                  {categoryLabel[c]}
                </button>
              );
            })}
          </div>

          {!isPlus && (
            <div className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-slate-700">
              Free (demo): vezi doar activitatea de <span className="font-semibold">azi</span>. Pentru 7 zile + generare, activează{" "}
              <span className="font-semibold">Plus (demo)</span>.
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white/80 p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-700">Următoarele 7 zile</div>
            <div className="text-xs text-slate-500">tap pe o zi</div>
          </div>

          <div className="mt-3 space-y-2">
            {filteredWeek.map(({ dateKey, activity }) => {
              const selected = dateKey === selectedDayKey;
              const isToday = dateKey === todayKey;
              const locked = !canOpenDay(dateKey);

              return (
                <button
                  key={dateKey}
                  onClick={() => onSelectDay(dateKey)}
                  className={[
                    "w-full rounded-xl border p-3 text-left transition relative overflow-hidden",
                    selected ? "border-rose-200 bg-rose-50" : "border-slate-200 bg-white hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div className={locked ? "blur-[2px]" : ""}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-semibold text-slate-800">
                        {formatNiceDate(dateKey)}
                        {isToday && (
                          <span className="ml-2 rounded-full bg-rose-200 px-2 py-1 text-xs font-semibold text-slate-900">
                            Azi
                          </span>
                        )}
                      </div>

                      {activity ? (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">
                          {categoryLabel[activity.category]}
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-700">—</span>
                      )}
                    </div>

                    <div className="mt-1 text-sm text-slate-700">
                      {activity ? activity.title : "Se încarcă…"}
                    </div>

                    {activity && <div className="mt-1 text-xs text-slate-500">~{activity.durationMin} min</div>}
                  </div>

                  {locked && (
                    <div className="absolute inset-0 flex items-center justify-end pr-3">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800 border border-slate-200">
                        🔒 Plus
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-sm">
          <div className="text-sm font-medium text-slate-700">Detalii</div>

          {dayActivity ? (
            <>
              <div className="mt-2 text-lg font-semibold text-slate-800">{dayActivity.title}</div>
              <div className="mt-2 text-sm leading-relaxed text-slate-700">{dayActivity.description}</div>

              <div className="mt-3 flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                  {categoryLabel[dayActivity.category]}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                  ~{dayActivity.durationMin} min
                </span>
              </div>

              <button
                onClick={() => regenerateForDay(selectedDayKey)}
                className="mt-4 w-full rounded-xl bg-rose-200 px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-rose-300"
              >
                Generează altă activitate {isPlus ? "(demo)" : "(Plus)"}
              </button>

              {!isPlus && (
                <p className="mt-2 text-xs text-slate-500">
                  Free (demo): generarea este disponibilă în Plus (demo).
                </p>
              )}
            </>
          ) : (
            <div className="mt-2 text-sm text-slate-600">Se încarcă activitatea…</div>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          MomyCare · “Care for your child. Care for you.”
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
