import Link from "next/link";
import { Brand } from "@/components/Logo";
import { LoginForm } from "@/components/LoginForm";
import { RoleTabs } from "@/components/RoleTabs";

export const metadata = { title: "Masuk Admin - AturBelajar" };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center bg-gradient-to-b from-fresh/10 to-cream px-4 py-8">
      <Link href="/" aria-label="Kembali ke beranda"><Brand /></Link>
      <div className="mt-8 w-full max-w-md rounded-card bg-white p-6 shadow-soft md:p-8">
        <RoleTabs active="ADMIN" />
        <h1 className="mb-1 text-2xl font-extrabold text-navy">Masuk sebagai Admin</h1>
        <p className="mb-5 text-sm text-ink/70">Khusus pengelola sekolah atau pengembang.</p>
        <LoginForm role="ADMIN" />
      </div>
    </div>
  );
}
