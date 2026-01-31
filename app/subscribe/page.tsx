"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "../components/BottomNav";

const LS_PLUS_KEY = "momycare_plus_demo";

export default function SubscribePage() {
  const router = useRouter();
  const [isPlus, setIsPlus] = useState(false);

  useEffect(() => {
    setIsPlus(localStorage.getItem(LS_PLUS_KEY) === "true");
  }, []);

  function activatePlus() {
    localStorage.setItem(LS_PLUS_KEY, "true");
    setIsPlus(true);
  }

  function deactivatePlus() {
    localStorage.setItem(LS_PLUS_KEY, "false");
    setIsPlus(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50 pb-24">
      <div className="mx-auto max-w-md px-4 pt-6">
        <h1 className="text-2xl font-semibold text-slate-800">Plus</h1>
        <p className="mt-1 text-sm text-slate-600">
          Demo: activare instant, fără plată.
        </p>

        <div className="mt-4 rounded-2xl border border-rose-100 bg-white/80 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600">Status</div>
              <div className="mt-1 text-lg font-semibold text-slate-800">
                {isPlus ? "Plus (demo) activ" : "Free (demo)"}
              </div>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
              {isPlus ? "nelimitat" : "limitări"}
            </span>
          </div>

          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <div>✅ Chat nelimitat (demo)</div>
            <div>✅ Activități pe 7 zile</div>
            <div>✅ „Generează altă activitate”</div>
          </div>

          {!isPlus ? (
            <button
              onClick={activatePlus}
              className="mt-5 w-full rounded-xl bg-rose-200 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-rose-300"
            >
              Activează Plus (demo)
            </button>
          ) : (
            <button
              onClick={deactivatePlus}
              className="mt-5 w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              Dezactivează Plus (demo)
            </button>
          )}

          <button
            onClick={() => router.push("/activities")}
            className="mt-3 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50"
          >
            Înapoi la activități
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
