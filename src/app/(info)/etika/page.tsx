import { cardCls } from "@/components/styles";

export const metadata = { title: "Etika dan Privasi - AturBelajar" };

const ITEMS = [
  ["Minimisasi data", "AturBelajar hanya menyimpan data yang dibutuhkan: nama, email, username, jenjang sekolah, serta tugas, jadwal, pengingat, sesi fokus, dan refleksi yang kamu buat sendiri."],
  ["Persetujuan penggunaan", "Saat mendaftar, siswa diminta menyetujui penggunaan data untuk fitur aplikasi."],
  ["Transparansi penyimpanan", "Data disimpan di basis data aplikasi dan dipertahankan selama akunmu aktif, sampai kamu menghapusnya."],
  ["Keamanan data", "Password disimpan dalam bentuk hash (bukan teks biasa), sesi login dilindungi, dan validasi dilakukan di server."],
  ["Kontrol pengguna", "Kamu dapat mengubah atau menghapus tugas, jadwal, pengingat, dan refleksi kapan saja, serta menghapus seluruh akun dan datamu dari halaman Akun & Data."],
  ["Pembatasan hak akses", "Setiap siswa hanya melihat datanya sendiri. Guru BK tidak otomatis melihat tugas, jadwal, atau refleksi siswa. Berbagi perkembangan, jika dikembangkan, memerlukan persetujuan siswa dan tujuan yang jelas."],
  ["Aksesibilitas", "Desain responsif untuk HP hingga PC, tombol berukuran nyaman, kontras warna yang jelas, dan animasi menghormati pengaturan pengurangan gerak."],
  ["Batasan produk", "AturBelajar bukan alat diagnosis dan tidak menggantikan layanan BK. Fokusnya hanya pengelolaan waktu belajar."],
];

export default function EthicsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-10 md:px-6">
      <h1 className="text-3xl font-extrabold text-navy">Etika dan Privasi</h1>
      {ITEMS.map(([t, d], i) => (
        <section key={t} className={cardCls}>
          <h2 className="text-lg font-bold text-navy"><span className="mr-2 text-fresh">{i + 1}.</span>{t}</h2>
          <p className="mt-2 text-ink/85">{d}</p>
        </section>
      ))}
    </div>
  );
}
