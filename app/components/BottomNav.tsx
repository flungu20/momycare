"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { label: "Home", href: "/home", icon: "🏠" },
    { label: "Activități", href: "/activities", icon: "🗓️" },
    { label: "Chat", href: "/chat", icon: "💬" },
    { label: "Sunete", href: "/sounds", icon: "🌧️" },
    { label: "Plus", href: "/subscribe", icon: "✨" },
    { label: "Profil", href: "/profile", icon: "⚙️" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-md justify-around py-2">
        {items.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center text-xs ${
                active ? "text-rose-600" : "text-slate-500"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
