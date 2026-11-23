"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Brand } from "./Logo";
import { studentInfoNav, studentNav } from "./nav";
import { cn } from "@/lib/utils";

export function Sidebar({ name, logout }: { name: string; logout: () => Promise<void> }) {
  const path = usePathname();
  const item = (n: { href: string; label: string; icon: React.ElementType }) => {
    const active = n.href === "/siswa" ? path === "/siswa" : path.startsWith(n.href);
    const Icon = n.icon;
    return (
      <Link
        key={n.href}
        href={n.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
          active ? "bg-gold text-navy" : "text-white/85 hover:bg-white/10",
        )}
      >
        <Icon className="h-5 w-5" aria-hidden /> {n.label}
      </Link>
    );
  };
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col overflow-y-auto bg-navy p-4 md:flex">
      <div className="px-2 pb-5 pt-2"><Brand light /></div>
      <p className="mb-3 truncate px-3.5 text-xs text-white/60">Masuk sebagai {name}</p>
      <nav className="flex flex-1 flex-col gap-1" aria-label="Menu utama">
        {studentNav.map(item)}
        <hr className="my-3 border-white/10" />
        {studentInfoNav.map(item)}
      </nav>
      <form action={logout} className="pt-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 px-3 py-2.5 text-sm font-medium text-white hover:bg-white/10">
          <LogOut className="h-4 w-4" aria-hidden /> Keluar
        </button>
      </form>
    </aside>
  );
}
