# AturBelajar - Plan Your Time, Grow Your Learning

Website full-stack (Next.js App Router, TypeScript, Tailwind, Prisma, PostgreSQL, Auth.js v5).

## Status
`npm run typecheck` dan `npm run build` lolos. Alur siswa, Guru BK, dan Admin sudah diuji
end-to-end di browser (daftar, masuk, CRUD jadwal/tugas, pengingat, fokus, refleksi, ganti password,
kelola pengguna, permintaan bantuan, akses silang peran) terhadap PostgreSQL 16.
Belum ada tes otomatis di repositori.

## Perubahan terbaru (WAJIB migrasi database)
Skema berubah: peran `ADMIN` ditambahkan dan `help_requests` punya kolom `resolvedAt`.
Jalankan `npx prisma migrate dev --name tambah_admin` (tolak jika Prisma meminta reset database),
lalu isi `ADMIN_*` di `.env` dan jalankan `npm run db:seed` untuk membuat akun admin.

## Menjalankan
1. Salin proyek ini (atau gabungkan `src/`, `prisma/`, konfigurasi ke proyek Next.js yang sudah ada).
2. `cp .env.example .env`, isi `DATABASE_URL` (database yang sudah ada) dan `AUTH_SECRET` (`openssl rand -base64 32`).
3. **Jika database sudah berisi tabel/data:** cadangkan dulu. Jalankan `npx prisma db pull`
   dan bandingkan dengan `prisma/schema.prisma`. Jika Prisma meminta reset, TOLAK.
4. `npm install` lalu `npx prisma migrate dev --name init`.
5. Buat akun Guru BK dan/atau Admin: isi `TEACHER_*` dan/atau `ADMIN_*` di `.env` (password min. 10 karakter), lalu `npm run db:seed`.
6. `npm run dev` dan buka http://localhost:3000.

## Rute
Publik: `/`, `/tentang`, `/etika`, `/addie`, `/masuk`, `/daftar`, `/guru/masuk`
Siswa (`/siswa/...`): dashboard, `tugas`, `jadwal`, `pengingat`, `fokus`, `progres`, `refleksi`, `profil` (ganti password, hapus akun)
Guru BK (`/guru/...`): beranda, `panduan`, `bantuan`, `akun` (ganti password)
Admin (`/admin/...`, masuk di `/admin/masuk`): ringkasan, `pengguna` (cari, tambah Guru BK, reset password, hapus akun), `bantuan` (tandai selesai), `akun`

## Yang WAJIB dilengkapi dari Proposal/PPT (jangan dikarang)
- `src/lib/content.ts`: 3 pertanyaan refleksi tambahan (target 6) dan indikator evaluasi ADDIE.
- Daftar pustaka lengkap di `src/app/(public)/tentang/page.tsx` (baru memuat Zimmerman 2002 dan Branch 2009; cocokkan).
- Rumusan "lima fitur utama" di `FEATURES` (`content.ts`) bila berbeda dengan proposal.
- Kebijakan masa penyimpanan data di halaman Etika (saat ini: selama akun aktif).

## Batasan yang disengaja / belum ada
- Pengingat hanya berbunyi saat tab AturBelajar terbuka (tidak ada penjadwal server/push).
- Lupa password otomatis belum ada.
- Fitur berbagi perkembangan ke Guru BK belum dibuat; tabel `SharedProgressConsent` sudah disiapkan,
  sehingga Guru BK saat ini TIDAK punya query ke data siswa.
- Formulir permintaan bantuan hanya menyimpan ke database.
- Belum ada tes otomatis; uji manual: CRUD, login/logout, akses silang peran, tampilan 360x800 s.d. 1920x1080.

## Admin
Admin hanya melihat data akun (nama, email, username, jenjang) dan angka agregat. Isi tugas, jadwal,
pengingat, dan refleksi siswa TIDAK bisa dibuka, sesuai prinsip privasi proyek. Admin dapat membuat
akun Guru BK, mereset password siswa/Guru BK (password sementara tampil sekali), dan menghapus akun.
Akun admin hanya dibuat lewat seed.

## Keamanan
Peran siswa/Guru BK dipaksa di server; pendaftaran publik hanya membuat siswa. Password di-hash bcrypt.
Semua query data siswa difilter `userId` dari sesi. Middleware + `requireStudent/requireTeacher/requireAdmin` berlapis; peran dicek ulang ke database sehingga akun yang
dihapus tidak bisa memakai sesi lama. Percobaan masuk dibatasi (8 kali / 10 menit per akun, di memori proses; untuk banyak
instance server pakai penyimpanan bersama). Jika di-deploy bukan di localhost, set `AUTH_TRUST_HOST=true`.
