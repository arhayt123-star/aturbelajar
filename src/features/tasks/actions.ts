"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/authz";
import { opt } from "@/lib/form";
import type { ActionState } from "@/lib/action-types";

const taskSchema = z.object({
  id: opt(z.string()),
  title: z.string().trim().min(2, "Judul minimal 2 karakter").max(120, "Judul maksimal 120 karakter"),
  subject: opt(z.string().trim().max(60)),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
  dueDate: opt(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal tidak valid")),
  estimatedMinutes: opt(z.coerce.number().int().min(5, "Minimal 5 menit").max(600, "Maksimal 600 menit")),
  notes: opt(z.string().trim().max(500)),
  steps: opt(z.string().max(1000)),
});

const refresh = () => revalidatePath("/siswa", "layout");

export async function saveTask(_p: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireStudent();
  const parsed = taskSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  const d = parsed.data;
  const dueDate = d.dueDate ? new Date(d.dueDate + "T00:00:00+07:00") : null;
  const lines = (d.steps ?? "").split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 12);
  const base = {
    title: d.title, subject: d.subject ?? null, priority: d.priority, dueDate,
    estimatedMinutes: d.estimatedMinutes ?? null, notes: d.notes ?? null,
  };

  if (d.id) {
    const res = await prisma.task.updateMany({ where: { id: d.id, userId: user.id }, data: base });
    if (res.count === 0) return { ok: false, message: "Tugas tidak ditemukan" };
    if (lines.length) {
      const start = await prisma.taskStep.count({ where: { taskId: d.id } });
      await prisma.taskStep.createMany({ data: lines.map((title, i) => ({ taskId: d.id!, title, position: start + i })) });
    }
  } else {
    await prisma.task.create({
      data: { ...base, userId: user.id, steps: { create: lines.map((title, i) => ({ title, position: i })) } },
    });
  }
  refresh();
  return { ok: true, message: "Tugas tersimpan" };
}

export async function setTaskStatus(id: string, status: string) {
  const user = await requireStudent();
  const s = z.enum(["NOT_STARTED", "IN_PROGRESS", "DONE"]).parse(status);
  await prisma.task.updateMany({
    where: { id, userId: user.id },
    data: { status: s, completedAt: s === "DONE" ? new Date() : null },
  });
  refresh();
}

export async function toggleStep(stepId: string, isDone: boolean) {
  const user = await requireStudent();
  await prisma.taskStep.updateMany({ where: { id: stepId, task: { userId: user.id } }, data: { isDone } });
  refresh();
}

export async function deleteTask(fd: FormData) {
  const user = await requireStudent();
  const id = String(fd.get("id") ?? "");
  await prisma.task.deleteMany({ where: { id, userId: user.id } });
  refresh();
}
