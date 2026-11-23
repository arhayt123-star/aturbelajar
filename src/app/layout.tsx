import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AturBelajar - Atur Waktumu, Raih Tujuan Belajarmu!",
  description:
    "Media digital pendukung layanan BK untuk membantu siswa SMP/SMA mengatur waktu belajar secara mandiri.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-dvh bg-cream text-ink antialiased">{children}</body>
    </html>
  );
}
