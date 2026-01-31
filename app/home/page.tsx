"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNav from "../components/BottomNav";

type DayPlan = {
  dateKey: string;
  activityId: string;
};

type ChatState = {
  dayKey: string;
  used: number;
  messages: any[];
};

const LS_PROFILE_KEY = "momycare_profile";
const LS_ACTIVITIES_KEY = "momycare_activities_v1";
const LS_PLUS_KEY = "momycare_plus_demo";
const LS_CHAT_STATE_KEY = "momycare_chat_state_v1";

function todayKey() {
  const d = new Date();
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

const ACTIVITY_TITLES: Record<string, string> = {
  a0: "Turnul moale",
  a1: "Sunete de animale",
  a2: "Oglinda emoțiilor",
  b0: "Traseu prin casă",
  b1: "Poveste în 3 propoziții",
  b2: "Termometrul emoțiilor",
  c0: "Provocarea de coordonare",
  c1: "Cuvântul zilei",
  c2: "Jurnal de recunoștință",
  d0: "Stretch & reset",
  d1: "Dezbate calm",
  d2: "Numește emoția",
};

export default function HomePage() {
  const router = useRouter();

  const [motherName, setMotherName] = useState<string>("mama");
  const [childName, setChildName] = useState("Copil");
  const [childAge, setChildAge] = useState("");
  const [todayActivity, setTodayActivity] = useState<string | null>(null);

  const [isPlus, setIsPlus] = useState(false);
  const [chatRemaining, setChatRemaining] = useState<number>(5);

  const tKey = useMemo(() => todayKey(), []);

  useEffect(() => {
    // profil gate
    const profileRaw = localStorage.getItem(LS_PROFILE_KEY);
    if (!profileRaw) {
      router.replace("/onboarding");
      return;
    }

    const profile = safeParse<any>(profileRaw);
    if (!profile) {
      router.replace("/onboarding");
      return;
    }

    setMotherName(profile.motherName || "mama");
    setChildName(profile.childName || "Copil");
    setChildAge(`${profile.childAgeYears} ani ${profile.childAgeMonths} luni`);

    // plus status
    const plus = localStorage.getItem(LS_PLUS_KEY) === "true";
    setIsPlus(plus);

    // activitatea de azi
    const plan = safeParse<DayPlan[]>(localStorage.getItem(LS_ACTIVITIES_KEY));
    if (plan) {
      const today = plan.find((p) => p.dateKey === tKey);
      if (today && ACTIVITY_TITLES[today.activityId]) {
        setTodayActivity(ACTIVITY_TITLES[today.activityId]);
      }
    }

    // chat remaining (free)
    if (!plus) {
      const chat = safeParse<ChatState>(localStorage.getItem(LS_CHAT_STATE_KEY));
      if (chat && chat.dayKey === tKey) {
        const used = Number(chat.used ?? 0);
        setChatRemaining(Math.max(0, 5 - used));
      } else {
        setChatRemaining(5);
      }
    } else {
      setChatRemaining(999); // nelimitat
    }
  }, [router, tKey]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50 pb-24">
      <div className="mx-auto max-w-md px-4 pt-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Bun venit, {motherName}
        </h1>

        {/* Status plan */}
        <div className="mt-3 rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Plan</div>
              <div className="mt-1 text-lg font-semibold text-slate-800">
                {isPlus ? "Plus (demo)" : "Free (demo)"}
              </div>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
              {isPlus ? "nelimitat" : `chat: ${chatRemaining}/5`}
            </span>
          </div>

          {!isPlus && (
            <div className="mt-3">
              <Link
                href="/subscribe"
                className="inline-block w-full rounded-xl bg-rose-200 px-4 py-3 text-center text-sm font-semibold text-slate-900 hover:bg-rose-300"
              >
                Activează Plus (demo)
              </Link>
            </div>
          )}
        </div>

        {/* Card copil */}
        <div className="mt-4 rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-sm">
          <div className="text-sm text-slate-600">Pentru copil</div>
          <div className="mt-1 text-lg font-semibold text-slate-800">{childName}</div>
          <div className="text-sm text-slate-500">{childAge}</div>

          <p className="mt-3 text-sm text-slate-700">
            {todayActivity ?? "Activitatea zilei se pregătește…"}
          </p>

          <div className="mt-4 flex gap-2">
            <Link
              href="/activities"
              className="flex-1 rounded-xl bg-rose-200 px-4 py-3 text-center text-sm font-semibold text-slate-900 hover:bg-rose-300"
            >
              Vezi activitățile
            </Link>
            <Link
              href="/profile"
              className="rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Profil
            </Link>
          </div>
        </div>

        {/* Card mamă */}
        <div className="mt-4 rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-sm">
          <div className="text-sm text-slate-600">Pentru tine</div>
          <p className="mt-2 text-sm text-slate-700">
            Respiră. E suficient ce faci azi.
          </p>

          <div className="mt-3 flex gap-2">
            <Link
              href="/sounds"
              className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Sunete
            </Link>
            <Link
              href="/chat"
              className="flex-1 rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Chat
              {!isPlus && (
                <span className="ml-2 rounded-full bg-white px-2 py-1 text-xs text-slate-600 border border-slate-200">
                  {chatRemaining}/5
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          MomyCare · “Care for your child. Care for you.”
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
