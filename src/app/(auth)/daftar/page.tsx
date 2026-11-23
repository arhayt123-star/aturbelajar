import Link from "next/link";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata = { title: "Daftar - AturBelajar" };

export default function RegisterPage() {
  return (
    <>
      <h1 className="mb-1 text-2xl font-extrabold text-navy">Daftar Akun Siswa</h1>
      <p className="mb-5 text-sm text-ink/70">Akun Guru BK dibuat oleh pengelola sekolah, bukan lewat pendaftaran.</p>
      <RegisterForm />
      <p className="mt-5 text-center text-sm">Sudah punya akun? <Link href="/masuk" className="font-semibold text-forest underline">Masuk</Link></p>
    </>
  );
}
