import Link from "next/link";
import { Lock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";
import { fmtDate, isoJakarta, TZ } from "@/lib/utils";
import { DashboardCard, StatTile } from "@/components/DashboardCard";
import { ProgressChart } from "@/components/ProgressChart";

export const metadata = { title: "Ringkasan Admin - AturBelajar" };

export default async function AdminHome() {
  const user = await requireAdmin();
  const since = new Date(Date.now() - 14 * 86400000);
  const [students, teachers, tasks, tasksDone, schedules, focus, reflections, openHelp, levels, recent, helpRows] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.task.count(),
    prisma.task.count({ where: { status: "DONE" } }),
    prisma.studySchedule.count(),
    prisma.focusSession.count({ where: { status: "COMPLETED" } }),
    prisma.weeklyReflection.count(),
    prisma.helpRequest.count({ where: { resolvedAt: null } }),
    prisma.studentProfile.groupBy({ by: ["schoolLevel"], _count: { _all: true } }),
    prisma.user.findMany({ where: { role: "STUDENT", createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.helpRequest.findMany({ where: { resolvedAt: null }, orderBy: { createdAt: "desc" }, take: 4, include: { teacher: { select: { name: true } } } }),
  ]);

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(Date.now() - (13 - i) * 86400000);
    return { iso: isoJakarta(d), label: d.toLocaleDateString("id-ID", { day: "numeric", month: "short", timeZone: TZ }), pendaftar: 0 };
  });
  for (const r of recent) {
    const day = days.find((d) => d.iso === isoJakarta(r.createdAt));
    if (day) day.pendaftar++;
  }
  const lvl = (k: "SMP" | "SMA") => levels.find((l: { schoolLevel: string; _count: { _all: number } }) => l.schoolLevel === k)?._count._all ?? 0;
  const pct = tasks ? Math.round((tasksDone / tasks) * 100) : 0;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-navy md:text-3xl">Halo, {user.name}</h1>
        <p className="text-sm text-ink/70">Ringkasan penggunaan AturBelajar.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile value={students} label="Siswa terdaftar" tone="green" />
        <StatTile value={teachers} label="Guru BK" tone="blue" />
        <StatTile value={tasks} label="Tugas dicatat" tone="gold" />
        <StatTile value={openHelp} label="Permintaan bantuan terbuka" tone="orange" />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <DashboardCard title="Pendaftar siswa, 14 hari terakhir" className="md:col-span-2">
          <ProgressChart data={days} dataKey="pendaftar" name="Pendaftar baru" ariaLabel="Grafik pendaftar siswa baru 14 hari terakhir" />
        </DashboardCard>
        <DashboardCard title="Penggunaan fitur">
          <dl className="space-y-2 text-sm">
            {[["Jadwal belajar dibuat", schedules], ["Sesi fokus selesai", focus], ["Refleksi mingguan", reflections], ["Tugas selesai", `${tasksDone} (${pct}%)`], ["Siswa SMP", lvl("SMP")], ["Siswa SMA", lvl("SMA")]].map(([k, v]) => (
              <div key={String(k)} className="flex justify-between gap-3 border-b border-navy/5 pb-2 last:border-0"><dt className="text-ink/70">{k}</dt><dd className="font-semibold text-navy">{v}</dd></div>
            ))}
          </dl>
        </DashboardCard>
      </div>

      <DashboardCard title="Permintaan bantuan terbuka" action={<Link href="/admin/bantuan" className="text-sm font-medium text-forest">Lihat semua</Link>}>
        {helpRows.length === 0 ? <p className="text-sm text-ink/70">Tidak ada permintaan terbuka.</p> : (
          <ul className="divide-y divide-navy/10">
            {helpRows.map((r: { id: string; topic: string; createdAt: Date; teacher: { name: string } }) => (
              <li key={r.id} className="py-2.5 text-sm"><p className="font-semibold">{r.topic}</p><p className="text-xs text-ink/60">{r.teacher.name} - {fmtDate(r.createdAt)}</p></li>
            ))}
          </ul>
        )}
      </DashboardCard>

      <p className="flex gap-3 rounded-card bg-gold/20 p-4 text-sm text-navy">
        <Lock className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        Sesuai prinsip privasi AturBelajar, admin hanya melihat angka agregat dan data akun. Isi tugas, jadwal, pengingat, dan refleksi siswa tidak dapat dibuka dari sini.
      </p>
    </div>
  );
}
