import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { requireTeacher } from "@/lib/authz";
import { FEATURES } from "@/lib/content";
import { CounselorIllustration } from "@/components/Illustrations";
import { cardCls, btnGhost } from "@/components/styles";

export const metadata = { title: "Beranda Guru BK - AturBelajar" };

export default async function TeacherHome() {
  const user = await requireTeacher();
  return (
    <div className="space-y-5">
      <div className={cardCls + " grid items-center gap-4 md:grid-cols-[1fr_16rem]"}>
        <div>
          <h1 className="text-2xl font-extrabold text-navy md:text-3xl">Selamat datang, {user.name}</h1>
          <p className="mt-2 text-ink/80">AturBelajar adalah media digital pendukung layanan BK untuk membantu siswa SMP/SMA mengatur waktu belajar secara mandiri. Tujuannya mendukung pendampingan, bukan menggantikannya.</p>
        </div>
        <CounselorIllustration className="mx-auto w-full max-w-xs" />
      </div>

      <section className={cardCls}>
        <h2 className="text-lg font-bold text-navy">Lima fitur utama</h2>
        <ol className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <li key={f.key} className="rounded-xl bg-cream p-4"><p className="font-semibold text-forest">{i + 1}. {f.title}</p><p className="mt-1 text-sm">{f.desc}</p></li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-ink/60">Catatan pengembang: cocokkan kelima fitur ini dengan rumusan di proposal.</p>
      </section>

      <section className={cardCls + " flex gap-4"}>
        <LockKeyhole className="mt-1 h-6 w-6 shrink-0 text-forest" aria-hidden />
        <div>
          <h2 className="text-lg font-bold text-navy">Privasi siswa</h2>
          <p className="mt-1 text-sm text-ink/80">Akun Guru BK tidak menampilkan tugas, jadwal, atau refleksi siswa. Siswa menentukan sendiri apa yang ingin mereka ceritakan saat pendampingan.</p>
          <Link href="/etika" className={btnGhost + " mt-3"}>Baca etika dan privasi</Link>
        </div>
      </section>
    </div>
  );
}
