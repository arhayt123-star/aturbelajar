import Link from "next/link";
import { Brand } from "./Logo";

export function PublicFooter() {
  return (
    <footer className="mt-16 bg-navy text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <Brand light />
          <p className="mt-3 max-w-sm text-sm text-white/70">Atur Waktumu, Raih Tujuan Belajarmu! Media digital pendukung layanan BK.</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80" aria-label="Footer">
          <Link href="/tentang">Tentang</Link>
          <Link href="/etika">Etika & Privasi</Link>
          <Link href="/addie">Pengembangan ADDIE</Link>
          <Link href="/guru/masuk">Masuk Guru BK</Link>
          <Link href="/admin/masuk">Masuk Admin</Link>
        </nav>
      </div>
    </footer>
  );
}
