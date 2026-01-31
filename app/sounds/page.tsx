"use client";

import { useRef } from "react";
import BottomNav from "../components/BottomNav";

export default function SoundsPage() {
  const ref = useRef<HTMLAudioElement | null>(null);

  function play() {
    if (!ref.current) {
      ref.current = new Audio("/sounds/rain.mp3");
      ref.current.loop = true;
    }
    ref.current.play();
  }

  function stop() {
    if (ref.current) {
      ref.current.pause();
      ref.current.currentTime = 0;
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 pb-28">
      <div className="max-w-md w-full text-center">
        <div className="mc-card p-4 mb-4">
          <div className="mb-3 font-medium">🌧️ Ploaie</div>
          <div className="flex justify-center gap-3">
            <button onClick={play} className="mc-btn">Pornește</button>
            <button onClick={stop} className="mc-btn">Oprește</button>
          </div>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
