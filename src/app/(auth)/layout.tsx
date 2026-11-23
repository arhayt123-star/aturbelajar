import Link from "next/link";
import { Brand } from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col items-center bg-gradient-to-b from-fresh/10 to-cream px-4 py-8">
      <Link href="/" aria-label="Kembali ke beranda"><Brand /></Link>
      <div className="mt-8 w-full max-w-md rounded-card bg-white p-6 shadow-soft md:p-8">{children}</div>
    </div>
  );
}
