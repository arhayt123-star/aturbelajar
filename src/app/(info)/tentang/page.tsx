import { cardCls } from "@/components/styles";

export const metadata = { title: "Tentang AturBelajar" };

const PHASES = [
  { n: "Perencanaan (Forethought)", d: "Menetapkan tujuan dan menyusun rencana. Di AturBelajar: daftar tugas, prioritas, dan jadwal mingguan." },
  { n: "Pelaksanaan (Performance)", d: "Menjalankan rencana dan memantau diri. Di AturBelajar: pengingat, timer fokus, dan progres." },
  { n: "Refleksi Diri (Self-reflection)", d: "Mengevaluasi proses dan menyesuaikan strategi. Di AturBelajar: refleksi mingguan." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10 md:px-6">
      <h1 className="text-3xl font-extrabold text-navy">Tentang AturBelajar</h1>
      <section className={cardCls}>
        <h2 className="text-lg font-bold text-navy">Tujuan dan sasaran</h2>
        <p className="mt-2 text-ink/85">AturBelajar adalah media digital pendukung layanan Bimbingan dan Konseling (BK) yang membantu siswa SMP/SMA mengembangkan keterampilan mengatur waktu belajar secara mandiri.</p>
      </section>
      <section className={cardCls}>
        <h2 className="text-lg font-bold text-navy">Landasan teori: tiga fase regulasi diri</h2>
        <p className="mt-2 text-ink/85">Rancangan fitur mengacu pada teori regulasi diri dalam belajar dari Zimmerman (2002).</p>
        <ul className="mt-4 space-y-3">
          {PHASES.map((p) => (
            <li key={p.n} className="rounded-xl bg-cream p-4"><p className="font-semibold text-forest">{p.n}</p><p className="mt-1 text-sm">{p.d}</p></li>
          ))}
        </ul>
      </section>
      <section className={cardCls}>
        <h2 className="text-lg font-bold text-navy">Model pengembangan</h2>
        <p className="mt-2 text-ink/85">Produk dikembangkan dengan model ADDIE dari Branch (2009): Analysis, Design, Development, Implementation, Evaluation. Lihat halaman Pengembangan ADDIE.</p>
      </section>
      <section className={cardCls}>
        <h2 className="text-lg font-bold text-navy">Manfaat yang diharapkan</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-ink/85">
          <li>Siswa: membantu merencanakan, menjalankan, dan merefleksikan kegiatan belajar.</li>
          <li>Guru BK: media pendukung layanan pendampingan manajemen waktu belajar.</li>
          <li>Sekolah: dukungan terhadap budaya belajar mandiri.</li>
        </ul>
        <p className="mt-3 text-sm text-ink/70">Ini adalah manfaat yang diharapkan, bukan hasil penelitian. Evaluasi efektivitas belum dilakukan.</p>
      </section>
      <section className={cardCls}>
        <h2 className="text-lg font-bold text-navy">Batasan produk</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-ink/85">
          <li>Fokus hanya pada pengelolaan waktu belajar, bukan kesehatan mental, emosi, atau karier.</li>
          <li>Bukan pengganti layanan konseling oleh Guru BK.</li>
          <li>Tidak ada peringkat antarsiswa dan tidak ada label seperti malas atau rajin.</li>
          <li>Pengingat browser hanya muncul saat AturBelajar terbuka di browser.</li>
        </ul>
      </section>
      <section className={cardCls}>
        <h2 className="text-lg font-bold text-navy">Referensi</h2>
        <ul className="mt-2 space-y-2 text-sm text-ink/85">
          <li>Zimmerman, B. J. (2002). Becoming a self-regulated learner: An overview. <i>Theory Into Practice, 41</i>(2), 64-70.</li>
          <li>Branch, R. M. (2009). <i>Instructional design: The ADDIE approach</i>. Springer.</li>
        </ul>
        <p className="mt-3 rounded-xl bg-gold/20 p-3 text-sm text-navy">Catatan pengembang: cocokkan kedua entri ini dan lengkapi seluruh daftar pustaka dengan Proposal AturBelajar sebelum dipublikasikan.</p>
      </section>
    </div>
  );
}
