import Link from "next/link";
import { AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import { CounselorIllustration } from "@/components/Illustrations";
import { HeroVideo } from "@/components/HeroVideo";
import { getSessionUser } from "@/lib/session-user";
import { FadeIn } from "@/components/FadeIn";
import { btnGhost, btnGold, btnPrimary, cardCls } from "@/components/styles";
import { FEATURES, FLOW } from "@/lib/content";

const PROBLEMS = [
  "Kesulitan menyusun jadwal belajar", "Lupa tenggat pengumpulan tugas", "Menunda pekerjaan sekolah",
  "Kesulitan menentukan prioritas", "Terdistraksi notifikasi", "Belum terbiasa membagi tugas",
];
const BENEFITS = [
  "Menyusun jadwal belajar mingguan", "Menentukan prioritas tugas", "Mengingat tenggat pengumpulan",
  "Memantau progres belajar", "Melatih refleksi dan evaluasi",
];

export default async function HomePage() {
  const user = await getSessionUser();
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-fresh/10 to-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:px-6 md:py-16">
          <FadeIn>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-navy md:text-5xl">
              Atur Waktumu, <span className="text-forest">Raih Tujuan Belajarmu!</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink/80">
              Belajar lebih terarah dimulai dari langkah sederhana. Atur jadwal, tentukan prioritas, selesaikan tugas, dan evaluasi perjalanan belajarmu bersama AturBelajar.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {user ? (
                <Link href={user.home} className={btnGold}>Ke Dashboard</Link>
              ) : (
                <>
                  <Link href="/daftar" className={btnGold}>Mulai Sekarang</Link>
                  <Link href="/masuk" className={btnGhost}>Masuk</Link>
                </>
              )}
            </div>
          </FadeIn>
          <FadeIn delay={0.1}><HeroVideo className="mx-auto w-full max-w-xl" /></FadeIn>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 md:grid-cols-2 md:px-6">
        <div className={cardCls}>
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy"><AlertTriangle className="h-5 w-5 text-gold" aria-hidden /> Masalah yang Sering Terjadi</h2>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {PROBLEMS.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-fresh" aria-hidden />{p}</li>
            ))}
          </ul>
        </div>
        <div className={cardCls}>
          <h2 className="flex items-center gap-2 text-lg font-bold text-navy"><Sparkles className="h-5 w-5 text-gold" aria-hidden /> Manfaat AturBelajar</h2>
          <ul className="mt-4 grid gap-2.5">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-fresh" aria-hidden />{b}</li>
            ))}
          </ul>
        </div>
      </section>

      <section id="fitur" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-16 md:px-6">
        <h2 className="text-2xl font-extrabold text-navy md:text-3xl">Fitur untuk belajar lebih terarah</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FadeIn key={f.key} delay={i * 0.05}>
              <div className={cardCls + " h-full"}>
                <h3 className="font-bold text-forest">{f.title}</h3>
                <p className="mt-2 text-sm text-ink/80">{f.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-16 md:px-6">
        <h2 className="text-2xl font-extrabold text-navy md:text-3xl">Alur penggunaan</h2>
        <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FLOW.map((s, i) => (
            <li key={s} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-soft">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest text-sm font-bold text-white">{i + 1}</span>
              <span className="text-sm font-medium">{s}</span>
            </li>
          ))}
        </ol>
        <p className="mt-5 rounded-2xl bg-gold/20 px-4 py-3 text-sm text-navy">
          Perubahan jadwal bukan kegagalan. Rencana belajar dapat disesuaikan dengan kondisi nyata.
        </p>
      </section>

      <section className="mx-auto mt-16 grid max-w-6xl gap-5 px-4 md:grid-cols-2 md:px-6">
        <div className={cardCls}>
          <h2 className="text-lg font-bold text-navy">Untuk Siswa</h2>
          <p className="mt-2 text-sm text-ink/80">Kelola tugas, jadwal, pengingat, dan refleksi pribadimu. Datamu hanya bisa kamu lihat sendiri.</p>
          <Link href="/daftar" className={btnPrimary + " mt-4"}>Daftar sebagai Siswa</Link>
        </div>
        <div className={cardCls + " flex flex-col"}>
          <h2 className="text-lg font-bold text-navy">Untuk Guru BK</h2>
          <p className="mt-2 text-sm text-ink/80">Pelajari fitur, panduan pendampingan, dan prinsip privasi. Guru BK tidak otomatis melihat data pribadi siswa.</p>
          <CounselorIllustration className="my-3 h-28 w-full" />
          <Link href="/guru/masuk" className={btnGhost + " mt-auto"}>Masuk Guru BK</Link>
        </div>
      </section>
    </>
  );
}
