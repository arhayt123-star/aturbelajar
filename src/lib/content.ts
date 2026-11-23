// Konten yang harus selaras dengan Proposal & PPT AturBelajar.
// Lengkapi bagian bertanda KOSONG dari dokumen proposal; jangan mengarang isinya.

// Mockup menampilkan 3 pertanyaan. Tambahkan 3 lainnya dari proposal (target total: 6).
export const REFLECTION_QUESTIONS: string[] = [
  "Tugas apa saja yang berhasil kamu selesaikan minggu ini?",
  "Hal apa yang paling membantumu dalam belajar?",
  "Hambatan apa yang kamu alami?",
];

// KOSONG: isi indikator evaluasi dari proposal. Halaman /addie menampilkan catatan jika kosong.
export const EVALUATION_INDICATORS: string[] = [];

export const FEATURES = [
  { key: "tugas", title: "Daftar Tugas", desc: "Catat tugas, tentukan prioritas, dan pecah menjadi langkah kecil." },
  { key: "jadwal", title: "Jadwal Mingguan", desc: "Susun waktu belajar dan istirahat dari Senin sampai Minggu." },
  { key: "pengingat", title: "Pengingat", desc: "Atur pengingat jadwal dan tenggat tugas." },
  { key: "fokus", title: "Fokus Belajar", desc: "Timer opsional untuk memulai dari satu langkah kecil." },
  { key: "progres", title: "Progres & Refleksi", desc: "Pantau progres dari data tugasmu dan tulis refleksi mingguan." },
];

export const FLOW = [
  "Beranda", "Tambah Tugas", "Tentukan Prioritas", "Masukkan ke Jadwal Mingguan", "Atur Pengingat",
  "Fokus Belajar", "Perbarui Progres", "Refleksi Mingguan", "Sesuaikan Rencana Berikutnya",
];
