import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { RoleTabs } from "@/components/RoleTabs";

export const metadata = { title: "Masuk - AturBelajar" };

export default function LoginPage() {
  return (
    <>
      <RoleTabs active="STUDENT" />
      <h1 className="mb-5 text-2xl font-extrabold text-navy">Masuk sebagai Siswa</h1>
      <LoginForm role="STUDENT" />
      <p className="mt-5 text-center text-sm">Belum punya akun? <Link href="/daftar" className="font-semibold text-forest underline">Daftar</Link></p>
      <p className="mt-2 text-center text-xs text-ink/60">Lupa password? Hubungi Guru BK atau admin sekolah. Pemulihan otomatis belum tersedia.</p>
    </>
  );
}
