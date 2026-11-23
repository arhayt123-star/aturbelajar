"use client";

import Link from "next/link";
import { useState } from "react";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { Brand } from "./Logo";
import { publicNav } from "./nav";
import { btnGhost, btnGold } from "./styles";

export type NavUser = { name: string; home: string } | null;

export function Navbar({ user = null, logout }: { user?: NavUser; logout?: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  // Saat sudah masuk: tombol Daftar/Masuk diganti Dashboard + Keluar (sesi tidak terputus).
  const actions = (cls = "") =>
    user ? (
      <>
        <Link href={user.home} className={btnGold + cls}><LayoutDashboard className="h-4 w-4" aria-hidden /> Dashboard</Link>
        {logout && (
          <form action={logout} className="contents">
            <button className={btnGhost + cls}><LogOut className="h-4 w-4" aria-hidden /> Keluar</button>
          </form>
        )}
      </>
    ) : (
      <>
        <Link href="/daftar" className={btnGold + cls}>Daftar</Link>
        <Link href="/masuk" className={btnGhost + cls}>Masuk</Link>
      </>
    );
  return (
    <header className="sticky top-0 z-40 border-b border-navy/5 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href={user?.home ?? "/"} aria-label="AturBelajar - beranda"><Brand /></Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-navy md:flex" aria-label="Menu utama">
          {publicNav.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-fresh">{n.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">{actions(" !min-h-10 !py-2")}</div>
        <button className="flex h-11 w-11 items-center justify-center md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu" aria-expanded={open}>
          {open ? <X className="h-6 w-6 text-navy" /> : <Menu className="h-6 w-6 text-navy" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-navy/5 bg-cream px-4 pb-4 md:hidden">
          <nav className="flex flex-col" aria-label="Menu seluler">
            {publicNav.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center text-navy">{n.label}</Link>
            ))}
          </nav>
          <div className="mt-2 grid grid-cols-2 gap-3">{actions()}</div>
        </div>
      )}
    </header>
  );
}
