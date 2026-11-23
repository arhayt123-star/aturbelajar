import { Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/authz";
import { getTaskStats } from "@/lib/stats";
import { TZ, fmtDate, isoJakarta } from "@/lib/utils";
import { DashboardCard, StatTile } from "@/components/DashboardCard";
import { ProgressChart } from "@/components/ProgressChart";

export const metadata = { title: "Progres Belajar - AturBelajar" };

export default async function ProgressPage() {
  const user = await requireStudent();
  const since = new Date(Date.now() - 7 * 86400000);
  const [stats, recentDone, history] = await Promise.all([
    getTaskStats(user.id),
    prisma.task.findMany({ where: { userId: user.id, status: "DONE", completedAt: { gte: since } }, select: { completedAt: true } }),
    prisma.task.findMany({ where: { userId: user.id, status: "DONE" }, orderBy: { completedAt: "desc" }, take: 8, select: { id: true, title: true, completedAt: true } }),
  ]);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    return { iso: isoJakarta(d), label: d.toLocaleDateString("id-ID", { weekday: "short", timeZone: TZ }), selesai: 0 };
  });
  for (const t of recentDone) {
    const day = days.find((d) => d.iso === isoJakarta(t.completedAt!));
    if (day) day.selesai++;
  }
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-extrabold text-navy">Progres Belajar</h1><p className="text-sm text-ink/70">Lihat perkembangan belajarmu dari data tugas yang kamu catat.</p></div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile value={stats.total} label="Total tugas" tone="blue" />
        <StatTile value={stats.done} label="Selesai" tone="green" />
        <StatTile value={stats.inProgress} label="Dalam proses" tone="gold" />
        <StatTile value={stats.notStarted} label="Belum dimulai" tone="orange" />
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <DashboardCard title="Tingkat Penyelesaian">
          <p className="text-5xl font-extrabold text-forest">{stats.pct}%</p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-fresh/15"><div className="h-full rounded-full bg-fresh transition-all duration-700" style={{ width: `${stats.pct}%` }} /></div>
          <p className="mt-2 text-xs text-ink/60">{stats.done} dari {stats.total} tugas selesai</p>
        </DashboardCard>
        <DashboardCard title="Tugas selesai, 7 hari terakhir" className="md:col-span-2"><ProgressChart data={days} /></DashboardCard>
      </div>
      <DashboardCard title="Riwayat Tugas Terbaru">
        {history.length === 0 ? <p className="text-sm text-ink/70">Belum ada tugas selesai.</p> : (
          <ul className="divide-y divide-navy/10">
            {history.map((h) => (
              <li key={h.id} className="flex items-center gap-3 py-2.5 text-sm"><Check className="h-5 w-5 shrink-0 text-fresh" aria-hidden /><span className="min-w-0 flex-1 break-words font-medium">{h.title}</span><span className="shrink-0 text-xs text-ink/60">{h.completedAt ? fmtDate(h.completedAt) : ""}</span></li>
            ))}
          </ul>
        )}
      </DashboardCard>
    </div>
  );
}
