import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/authz";
import { isoJakarta, toTime } from "@/lib/utils";
import { ReminderSettings, type ReminderView } from "@/components/ReminderSettings";

export const metadata = { title: "Pengingat - AturBelajar" };

export default async function RemindersPage() {
  const user = await requireStudent();
  const [rows, tasks, schedules] = await Promise.all([
    prisma.reminder.findMany({ where: { userId: user.id }, include: { task: { select: { title: true } }, schedule: { select: { title: true } } }, orderBy: { remindAt: "asc" } }),
    prisma.task.findMany({ where: { userId: user.id, status: { not: "DONE" } }, select: { id: true, title: true } }),
    prisma.studySchedule.findMany({ where: { userId: user.id }, select: { id: true, title: true } }),
  ]);
  const reminders: ReminderView[] = rows.map((r) => {
    const iso = isoJakarta(r.createdAt);
    return {
      id: r.id, minute: r.remindAt, time: toTime(r.remindAt), frequency: r.frequency, enabled: r.enabled,
      label: r.type === "TASK_DEADLINE" ? `Tenggat tugas: ${r.task?.title ?? "(dihapus)"}` : `Jadwal belajar: ${r.schedule?.title ?? "(dihapus)"}`,
      createdIso: iso, createdDow: ((new Date(iso + "T00:00:00Z").getUTCDay() + 6) % 7) + 1,
    };
  });
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-extrabold text-navy">Pengingat</h1><p className="text-sm text-ink/70">Atur pengingat jadwal dan tenggat tugas.</p></div>
      <ReminderSettings reminders={reminders} tasks={tasks} schedules={schedules} />
    </div>
  );
}
