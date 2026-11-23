import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/authz";
import { fmtDate, isoJakarta, cn } from "@/lib/utils";
import { NewTaskPanel } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import type { TaskView } from "@/types";

export const metadata = { title: "Daftar Tugas - AturBelajar" };

export default async function TasksPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const user = await requireStudent();
  const { tab } = await searchParams;
  const showDone = tab === "selesai";
  const rows = await prisma.task.findMany({
    where: { userId: user.id, status: showDone ? "DONE" : { not: "DONE" } },
    include: { steps: { orderBy: { position: "asc" } } },
    orderBy: showDone
      ? [{ completedAt: "desc" }]
      : [{ dueDate: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }],
  });
  const [active, done] = await Promise.all([
    prisma.task.count({ where: { userId: user.id, status: { not: "DONE" } } }),
    prisma.task.count({ where: { userId: user.id, status: "DONE" } }),
  ]);
  const now = new Date();
  const order = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  const tasks: TaskView[] = rows
    .map((t) => ({
      id: t.id, title: t.title, subject: t.subject, priority: t.priority, status: t.status,
      dueInput: t.dueDate ? isoJakarta(t.dueDate) : null,
      dueLabel: t.dueDate ? fmtDate(t.dueDate) : null,
      // Tenggat berlaku sampai akhir hari (dueDate tersimpan sebagai 00:00 WIB).
      overdue: !!t.dueDate && t.dueDate.getTime() + 86400000 <= now.getTime() && t.status !== "DONE",
      estimatedMinutes: t.estimatedMinutes, notes: t.notes,
      steps: t.steps.map((s) => ({ id: s.id, title: s.title, isDone: s.isDone })),
    }))
    .sort((a, b) => (showDone ? 0 : order[a.priority] - order[b.priority]));

  const tabCls = (on: boolean) => cn("flex min-h-11 flex-1 items-center justify-center rounded-lg text-sm font-semibold", on ? "bg-forest text-white" : "text-forest");
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Daftar Tugas</h1>
        <p className="text-sm text-ink/70">Kelola tugasmu dengan mudah dan terorganisir.</p>
      </div>
      <NewTaskPanel />
      <div className="flex gap-1 rounded-xl bg-white p-1 shadow-soft">
        <Link href="/siswa/tugas" className={tabCls(!showDone)}>Aktif ({active})</Link>
        <Link href="/siswa/tugas?tab=selesai" className={tabCls(showDone)}>Selesai ({done})</Link>
      </div>
      <TaskList tasks={tasks} empty={showDone ? "Belum ada tugas selesai." : "Belum ada tugas aktif. Mulai dengan menambah satu tugas."} />
      {!showDone && <p className="rounded-card bg-fresh/10 p-4 text-sm text-forest">Tips: pecah tugas besar menjadi langkah kecil agar lebih mudah diselesaikan.</p>}
    </div>
  );
}
