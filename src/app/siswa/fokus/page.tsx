import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/authz";
import { todayInfo } from "@/lib/utils";
import { FocusTimer } from "@/components/FocusTimer";

export const metadata = { title: "Fokus Belajar - AturBelajar" };

export default async function FocusPage() {
  const user = await requireStudent();
  const startOfDay = new Date(todayInfo().iso + "T00:00:00+07:00");
  const [tasks, sessions] = await Promise.all([
    prisma.task.findMany({ where: { userId: user.id, status: { not: "DONE" } }, select: { id: true, title: true }, orderBy: { createdAt: "desc" } }),
    prisma.focusSession.aggregate({ where: { userId: user.id, startedAt: { gte: startOfDay }, status: "COMPLETED" }, _sum: { actualSeconds: true } }),
  ]);
  const todayMinutes = Math.round((sessions._sum.actualSeconds ?? 0) / 60);
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-extrabold text-navy">Fokus Belajar</h1><p className="text-sm text-ink/70">Timer bersifat opsional. Pakai kalau membantu.</p></div>
      <FocusTimer tasks={tasks} todayMinutes={todayMinutes} />
    </div>
  );
}
