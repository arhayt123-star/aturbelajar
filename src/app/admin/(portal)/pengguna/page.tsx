import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";
import { fmtDate, cn } from "@/lib/utils";
import { CreateTeacherPanel, DeleteUserButton, ResetPasswordButton } from "@/components/AdminParts";
import { btnGhost, cardCls, inputCls } from "@/components/styles";

export const metadata = { title: "Pengguna - AturBelajar" };

const PAGE = 20;
const ROLE_LABEL = { STUDENT: "Siswa", TEACHER: "Guru BK", ADMIN: "Admin" } as const;

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ q?: string; peran?: string; hal?: string }> }) {
  await requireAdmin();
  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 60);
  const peran = sp.peran === "siswa" ? "STUDENT" : sp.peran === "guru" ? "TEACHER" : sp.peran === "admin" ? "ADMIN" : undefined;
  const page = Math.max(1, Math.trunc(Number(sp.hal)) || 1);
  const where: Prisma.UserWhereInput = {
    ...(peran ? { role: peran } : {}),
    ...(q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }, { username: { contains: q, mode: "insensitive" } }] } : {}),
  };
  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE, take: PAGE,
      select: { id: true, name: true, email: true, username: true, role: true, createdAt: true, studentProfile: { select: { schoolLevel: true, grade: true } } },
    }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PAGE));
  const href = (p: number, role = sp.peran) => {
    const u = new URLSearchParams();
    if (q) u.set("q", q);
    if (role) u.set("peran", role);
    if (p > 1) u.set("hal", String(p));
    const s = u.toString();
    return `/admin/pengguna${s ? `?${s}` : ""}`;
  };
  const tab = (label: string, v?: string) => (
    <Link href={href(1, v)} className={cn("flex min-h-10 items-center rounded-lg px-3.5 text-sm font-semibold", (sp.peran ?? "") === (v ?? "") ? "bg-forest text-white" : "text-forest")}>{label}</Link>
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-2xl font-extrabold text-navy">Pengguna</h1><p className="text-sm text-ink/70">{total} akun. Hanya data akun yang ditampilkan, bukan isi catatan belajar siswa.</p></div>
        <CreateTeacherPanel />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-xl bg-white p-1 shadow-soft">{tab("Semua")}{tab("Siswa", "siswa")}{tab("Guru BK", "guru")}{tab("Admin", "admin")}</div>
        <form action="/admin/pengguna" className="flex min-w-0 flex-1 gap-2 sm:max-w-sm">
          {sp.peran && <input type="hidden" name="peran" value={sp.peran} />}
          <input name="q" defaultValue={q} placeholder="Cari nama, email, atau username" aria-label="Cari pengguna" className={inputCls} />
          <button className={btnGhost + " !px-3"} aria-label="Cari"><Search className="h-5 w-5" /></button>
        </form>
      </div>

      <section className={cardCls + " !p-0 overflow-hidden"}>
        {users.length === 0 ? <p className="p-6 text-center text-sm text-ink/70">Tidak ada pengguna yang cocok.</p> : (
          <ul className="divide-y divide-navy/10">
            {users.map((u) => (
              <li key={u.id} className="flex items-center gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 break-words font-semibold text-navy">
                    {u.name}
                    <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", u.role === "STUDENT" ? "bg-fresh/15 text-forest" : u.role === "TEACHER" ? "bg-sky-100 text-sky-800" : "bg-gold/30 text-navy")}>{ROLE_LABEL[u.role]}</span>
                  </p>
                  <p className="break-all text-xs text-ink/70">@{u.username} - {u.email}</p>
                  <p className="text-xs text-ink/50">
                    Daftar {fmtDate(u.createdAt)}
                    {u.studentProfile && ` - ${u.studentProfile.schoolLevel}${u.studentProfile.grade ? ` kelas ${u.studentProfile.grade}` : ""}`}
                  </p>
                </div>
                {u.role !== "ADMIN" && (
                  <div className="flex shrink-0"><ResetPasswordButton id={u.id} name={u.name} /><DeleteUserButton id={u.id} name={u.name} /></div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {pages > 1 && (
        <nav aria-label="Halaman" className="flex items-center justify-between text-sm">
          {page > 1 ? <Link href={href(page - 1)} className={btnGhost}>Sebelumnya</Link> : <span />}
          <span className="text-ink/70">Halaman {page} dari {pages}</span>
          {page < pages ? <Link href={href(page + 1)} className={btnGhost}>Berikutnya</Link> : <span />}
        </nav>
      )}
    </div>
  );
}
