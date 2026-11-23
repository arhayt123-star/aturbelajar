import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/authz";
import { todayInfo, toTime } from "@/lib/utils";
import { WeeklyCalendar } from "@/components/WeeklyCalendar";
import { NewSchedulePanel } from "@/components/ScheduleParts";
import type { ScheduleView } from "@/types";

export const metadata = { title: "Jadwal Mingguan - AturBelajar" };

export default async function SchedulePage({ searchParams }: { searchParams: Promise<{ hari?: string }> }) {
  const user = await requireStudent();
  const { hari } = await searchParams;
  const today = todayInfo().dow;
  const selected = Math.min(7, Math.max(1, Math.trunc(Number(hari)) || today));
  const [rows, tasks] = await Promise.all([
    prisma.studySchedule.findMany({ where: { userId: user.id }, include: { task: { select: { title: true } } }, orderBy: [{ dayOfWeek: "asc" }, { startMinute: "asc" }] }),
    prisma.task.findMany({ where: { userId: user.id, status: { not: "DONE" } }, select: { id: true, title: true }, orderBy: { createdAt: "desc" } }),
  ]);
  const items: ScheduleView[] = rows.map((r) => ({
    id: r.id, title: r.title, subject: r.subject, dayOfWeek: r.dayOfWeek, start: toTime(r.startMinute), end: toTime(r.endMinute),
    isBreak: r.isBreak, taskId: r.taskId, taskTitle: r.task?.title ?? null,
  }));
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-extrabold text-navy">Jadwal Mingguan</h1><p className="text-sm text-ink/70">Atur jadwal belajar sesuai kebutuhanmu.</p></div>
      <NewSchedulePanel tasks={tasks} defaultDay={selected} />
      <WeeklyCalendar items={items} selectedDay={selected} today={today} tasks={tasks} />
      <p className="rounded-card bg-gold/20 p-4 text-sm text-navy">Jadwal yang baik bukan jadwal yang paling padat, tetapi yang sesuai dengan kemampuanmu. Perubahan jadwal bukan kegagalan.</p>
    </div>
  );
}
