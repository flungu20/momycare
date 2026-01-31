import type { Metadata } from "next";
import "./globals.css";
import EnvBadge from "./components/EnvBadge";

export const metadata: Metadata = {
  title: "MomyCare",
  description: "Care for your child. Care for you.",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ro">
      <body>
        <EnvBadge />
        {children}
      </body>
    </html>
  );
}
