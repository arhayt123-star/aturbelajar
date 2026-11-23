import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/authz";
import { getTaskStats } from "@/lib/stats";
import { PRIORITY_LABEL, TZ, fmtDate, todayInfo, toTime } from "@/lib/utils";
import { DashboardCard, StatTile } from "@/components/DashboardCard";
import { btnGhost, btnPrimary } from "@/components/styles";
import { FLOW } from "@/lib/content";

export const metadata = { title: "Dashboard - AturBelajar" };

export default async function StudentDashboard() {
  const user = await requireStudent();
  const t = todayInfo();
  const [schedule, upcoming, stats] = await Promise.all([
    prisma.studySchedule.findMany({ where: { userId: user.id, dayOfWeek: t.dow }, orderBy: { startMinute: "asc" } }),
    prisma.task.findMany({ where: { userId: user.id, status: { not: "DONE" } }, orderBy: [{ dueDate: { sort: "asc", nulls: "last" } }], take: 3 }),
    getTaskStats(user.id),
  ]);
  const dateLabel = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: TZ });
  const firstName = (user.name ?? "").split(" ")[0] || "Siswa";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-navy md:text-3xl">Halo, {firstName}!</h1>
        <p className="text-sm text-ink/70">{dateLabel}. Semangat belajar hari ini!</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <DashboardCard title="Jadwal Hari Ini" action={<Link href="/siswa/jadwal" className="inline-flex items-center gap-1 text-sm font-medium text-forest">Lihat semua <ArrowRight className="h-4 w-4" /></Link>}>
          {schedule.length === 0 ? <p className="text-sm text-ink/70">Belum ada kegiatan hari ini.</p> : (
            <ul className="space-y-2">
              {schedule.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 rounded-xl bg-cream px-3 py-2 text-sm">
                  <span className="min-w-0 break-words font-medium">{s.title}</span>
                  <span className="shrink-0 text-ink/70">{toTime(s.startMinute)} - {toTime(s.endMinute)}</span>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>

        <DashboardCard title="Tugas Terdekat" action={<Link href="/siswa/tugas" className="inline-flex items-center gap-1 text-sm font-medium text-forest">Lihat semua <ArrowRight className="h-4 w-4" /></Link>}>
          {upcoming.length === 0 ? <p className="text-sm text-ink/70">Tidak ada tugas aktif.</p> : (
            <ul className="space-y-2">
              {upcoming.map((x) => (
                <li key={x.id} className="rounded-xl bg-cream px-3 py-2 text-sm">
                  <p className="break-words font-medium">{x.title}</p>
                  <p className="text-xs text-ink/70">{x.dueDate ? `Tenggat ${fmtDate(x.dueDate)}` : "Tanpa tenggat"} - Prioritas {PRIORITY_LABEL[x.priority]}</p>
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>
      </div>

      <DashboardCard title="Ringkasan Progres">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile value={stats.total} label="Total tugas" />
          <StatTile value={stats.done} label="Selesai" tone="green" />
          <StatTile value={stats.notStarted + stats.inProgress} label="Belum selesai" tone="orange" />
          <StatTile value={`${stats.pct}%`} label="Tingkat penyelesaian" tone="gold" />
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-fresh/15" role="progressbar" aria-valuenow={stats.pct} aria-valuemin={0} aria-valuemax={100} aria-label="Tingkat penyelesaian">
          <div className="h-full rounded-full bg-fresh transition-all duration-700" style={{ width: `${stats.pct}%` }} />
        </div>
      </DashboardCard>

      <div className="flex flex-wrap gap-3">
        <Link href="/siswa/tugas" className={btnPrimary}><Plus className="h-5 w-5" aria-hidden /> Tambah Tugas</Link>
        <Link href="/siswa/jadwal" className={btnGhost}>Lihat Jadwal</Link>
      </div>

      <DashboardCard title="Alur belajarmu">
        <ol className="flex gap-2 overflow-x-auto pb-1 text-xs">
          {[["Tugas", "/siswa/tugas"], ["Jadwal", "/siswa/jadwal"], ["Pengingat", "/siswa/pengingat"], ["Fokus", "/siswa/fokus"], ["Progres", "/siswa/progres"], ["Refleksi", "/siswa/refleksi"]].map(([l, h], i) => (
            <li key={l} className="shrink-0"><Link href={h} className="flex min-h-11 items-center gap-2 rounded-full bg-cream px-3.5 font-medium text-forest"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-forest text-[10px] text-white">{i + 1}</span>{l}</Link></li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-ink/60">Langkah terakhir: {FLOW[FLOW.length - 1].toLowerCase()}. Perubahan jadwal bukan kegagalan.</p>
      </DashboardCard>
    </div>
  );
}
