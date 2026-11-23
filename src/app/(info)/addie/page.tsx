import { cardCls } from "@/components/styles";
import { EVALUATION_INDICATORS } from "@/lib/content";

export const metadata = { title: "Pengembangan ADDIE - AturBelajar" };

const STAGES = [
  ["Analysis", "Menganalisis kebutuhan siswa, masalah pengaturan waktu belajar, dan kebutuhan layanan BK."],
  ["Design", "Merancang fitur, alur penggunaan, tampilan, dan prinsip etika produk."],
  ["Development", "Mengembangkan prototipe AturBelajar sesuai rancangan."],
  ["Implementation", "Menggunakan prototipe bersama siswa dan Guru BK."],
  ["Evaluation", "Menilai kelayakan dan manfaat produk berdasarkan indikator evaluasi."],
];

export default function AddiePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-10 md:px-6">
      <h1 className="text-3xl font-extrabold text-navy">Pengembangan dengan Model ADDIE</h1>
      <p className="text-ink/80">Model ADDIE (Branch, 2009).</p>
      <ol className="space-y-3">
        {STAGES.map(([n, d], i) => (
          <li key={n} className={cardCls + " flex gap-4"}>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest font-bold text-white">{i + 1}</span>
            <div><h2 className="font-bold text-navy">{n}</h2><p className="mt-1 text-sm text-ink/85">{d}</p></div>
          </li>
        ))}
      </ol>
      <section className={cardCls}>
        <h2 className="text-lg font-bold text-navy">Indikator evaluasi</h2>
        {EVALUATION_INDICATORS.length ? (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-ink/85">{EVALUATION_INDICATORS.map((x) => <li key={x}>{x}</li>)}</ul>
        ) : (
          <p className="mt-2 rounded-xl bg-gold/20 p-3 text-sm text-navy">
            Indikator evaluasi belum dimasukkan. Isi dari Proposal AturBelajar pada <code>src/lib/content.ts</code>. Belum ada hasil pengujian yang ditampilkan.
          </p>
        )}
      </section>
    </div>
  );
}
