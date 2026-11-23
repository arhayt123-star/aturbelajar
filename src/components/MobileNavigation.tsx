"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { Brand } from "./Logo";
import { studentInfoNav, studentNav } from "./nav";
import { cn } from "@/lib/utils";

export function MobileNavigation({ name, logout }: { name: string; logout: () => Promise<void> }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href: string) => (href === "/siswa" ? path === "/siswa" : path.startsWith(href));
  const primary = [studentNav[0], studentNav[1], studentNav[2], studentNav[4]];

  return (
    <div className="md:hidden">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-white/95 px-4 shadow-sm backdrop-blur">
        <Brand />
        <button onClick={() => setOpen(true)} aria-label="Buka menu" className="flex h-11 w-11 items-center justify-center rounded-lg">
          <Menu className="h-6 w-6 text-navy" />
        </button>
      </header>

      <nav
        aria-label="Navigasi bawah"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-navy/10 bg-white pb-[env(safe-area-inset-bottom)]"
      >
        {primary.map((n) => {
          const Icon = n.icon;
          const active = isActive(n.href);
          return (
            <Link key={n.href} href={n.href} className={cn("flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium", active ? "text-forest" : "text-ink/60")}>
              <Icon className="h-5 w-5" aria-hidden />
              {n.label.replace("Daftar ", "").replace(" Mingguan", "").replace(" Belajar", "")}
            </Link>
          );
        })}
        <button onClick={() => setOpen(true)} className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-ink/60">
          <Menu className="h-5 w-5" aria-hidden /> Lainnya
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50">
          <button aria-label="Tutup menu" className="absolute inset-0 bg-navy/50" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 right-0 flex w-72 max-w-[85vw] flex-col overflow-y-auto bg-navy p-4">
            <div className="flex items-center justify-between pb-4">
              <Brand light />
              <button onClick={() => setOpen(false)} aria-label="Tutup" className="flex h-11 w-11 items-center justify-center text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="mb-3 truncate text-xs text-white/60">Masuk sebagai {name}</p>
            <nav className="flex flex-1 flex-col gap-1">
              {[...studentNav, ...studentInfoNav].map((n) => {
                const Icon = n.icon;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={cn("flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-sm font-medium", isActive(n.href) ? "bg-gold text-navy" : "text-white/85")}
                  >
                    <Icon className="h-5 w-5" aria-hidden /> {n.label}
                  </Link>
                );
              })}
            </nav>
            <form action={logout} className="pt-4">
              <button className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/25 text-sm font-medium text-white">
                <LogOut className="h-4 w-4" aria-hidden /> Keluar
              </button>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}
