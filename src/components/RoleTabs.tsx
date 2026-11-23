import Link from "next/link";
import { cn } from "@/lib/utils";

export function RoleTabs({ active }: { active: "STUDENT" | "TEACHER" | "ADMIN" }) {
  const cls = (on: boolean) => cn("flex min-h-11 flex-1 items-center justify-center rounded-lg text-sm font-semibold", on ? "bg-forest text-white" : "text-forest");
  return (
    <div className="mb-6 flex gap-1 rounded-xl bg-cream p-1">
      <Link href="/masuk" className={cls(active === "STUDENT")}>Siswa</Link>
      <Link href="/guru/masuk" className={cls(active === "TEACHER")}>Guru BK</Link>
      <Link href="/admin/masuk" className={cls(active === "ADMIN")}>Admin</Link>
    </div>
  );
}
