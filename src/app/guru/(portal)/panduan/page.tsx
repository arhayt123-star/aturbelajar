import Link from "next/link";
import { requireTeacher } from "@/lib/authz";
import { cardCls } from "@/components/styles";

export const metadata = { title: "Panduan Guru BK - AturBelajar" };

const USAGE = [
  "Perkenalkan AturBelajar dan tujuannya: membantu siswa merencanakan waktu belajar, bukan menilai mereka.",
  "Minta siswa mendaftar sendiri dan membaca halaman Etika & Privasi.",
  "Dampingi siswa memulai dari satu tugas, menentukan prioritas, lalu memasukkannya ke jadwal mingguan.",
  "Kenalkan pengingat dan timer fokus sebagai fitur opsional.",
  "Ajak siswa membuka progres dan menulis refleksi mingguan.",
  "Bantu siswa menyesuaikan rencana minggu berikutnya.",
];
const GUIDE = [
  "Fokus pada proses dan rencana, bukan pada banyaknya tugas selesai.",
  "Jangan membandingkan siswa atau memberi label seperti malas atau rajin.",
  "Ingatkan bahwa perubahan jadwal bukan kegagalan.",
  "Siswa memilih sendiri apa yang ingin ditunjukkan. Jangan meminta akses ke akunnya.",
  "Masalah di luar pengelolaan waktu belajar ditangani lewat prosedur layanan BK yang biasa.",
];

export default async function GuidePage() {
  await requireTeacher();
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-navy">Panduan Guru BK</h1>
      <section className={cardCls}>
        <h2 className="text-lg font-bold text-navy">Panduan penggunaan</h2>
        <ol className="mt-3 space-y-2">{USAGE.map((u, i) => <li key={u} className="flex gap-3 text-sm"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest text-xs font-bold text-white">{i + 1}</span>{u}</li>)}</ol>
      </section>
      <section className={cardCls}>
        <h2 className="text-lg font-bold text-navy">Panduan pendampingan siswa</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">{GUIDE.map((g) => <li key={g}>{g}</li>)}</ul>
      </section>
      <section className={cardCls}>
        <h2 className="text-lg font-bold text-navy">Evaluasi prototipe</h2>
        <p className="mt-2 text-sm">Informasi tahap pengembangan dan indikator evaluasi ada di halaman <Link href="/addie" className="font-semibold text-forest underline">ADDIE & Evaluasi</Link>.</p>
      </section>
    </div>
  );
}
