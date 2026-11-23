"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Brand } from "./Logo";
import { adminNav, teacherNav } from "./nav";
import { cn } from "@/lib/utils";

// Navigasi atas untuk area Guru BK dan Admin. Item pertama dianggap beranda (aktif hanya jika persis).
export function StaffNav({ name, logout, variant }: { name: string; logout: () => Promise<void>; variant: "teacher" | "admin" }) {
  const path = usePathname();
  // Ikon (komponen) tidak bisa dikirim dari Server Component, jadi daftar menu dipilih di sini.
  const items = variant === "admin" ? adminNav : teacherNav;
  const label = variant === "admin" ? "Menu Admin" : "Menu Guru BK";
  return (
    <header className="sticky top-0 z-30 bg-navy text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Brand light />
        <div className="flex items-center gap-3">
          <span className="hidden max-w-[12rem] truncate text-xs text-white/70 sm:block">{name}</span>
          <form action={logout}>
            <button className="flex min-h-10 items-center gap-2 rounded-lg border border-white/25 px-3 text-sm hover:bg-white/10"><LogOut className="h-4 w-4" aria-hidden /> Keluar</button>
          </form>
        </div>
      </div>
      <nav aria-label={label} className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2 md:px-6">
        {items.map((n, i) => {
          const Icon = n.icon;
          const active = i === 0 ? path === n.href : path.startsWith(n.href);
          return (
            <Link key={n.href} href={n.href} aria-current={active ? "page" : undefined} className={cn("flex min-h-11 shrink-0 items-center gap-2 rounded-lg px-3.5 text-sm font-medium", active ? "bg-gold text-navy" : "text-white/85 hover:bg-white/10")}>
              <Icon className="h-4 w-4" aria-hidden /> {n.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
