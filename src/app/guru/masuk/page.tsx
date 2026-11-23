import Link from "next/link";
import { Brand } from "@/components/Logo";
import { LoginForm } from "@/components/LoginForm";
import { RoleTabs } from "@/components/RoleTabs";

export const metadata = { title: "Masuk Guru BK - AturBelajar" };

export default function TeacherLoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center bg-gradient-to-b from-fresh/10 to-cream px-4 py-8">
      <Link href="/" aria-label="Kembali ke beranda"><Brand /></Link>
      <div className="mt-8 w-full max-w-md rounded-card bg-white p-6 shadow-soft md:p-8">
        <RoleTabs active="TEACHER" />
        <h1 className="mb-5 text-2xl font-extrabold text-navy">Masuk sebagai Guru BK</h1>
        <LoginForm role="TEACHER" />
      </div>
    </div>
  );
}
