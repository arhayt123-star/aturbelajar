"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/authz";

export async function startFocus(taskId: string | null, plannedMinutes: number): Promise<{ id?: string; error?: string }> {
  const user = await requireStudent();
  const minutes = z.number().int().min(5).max(120).safeParse(plannedMinutes);
  if (!minutes.success) return { error: "Durasi harus 5-120 menit" };
  if (taskId) {
    const own = await prisma.task.count({ where: { id: taskId, userId: user.id } });
    if (!own) return { error: "Tugas tidak valid" };
  }
  const s = await prisma.focusSession.create({ data: { userId: user.id, taskId, plannedMinutes: minutes.data } });
  return { id: s.id };
}

export async function finishFocus(id: string, actualSeconds: number, status: "COMPLETED" | "SKIPPED") {
  const user = await requireStudent();
  await prisma.focusSession.updateMany({
    where: { id, userId: user.id },
    data: { status, actualSeconds: Math.max(0, Math.min(Math.round(actualSeconds), 7200)), endedAt: new Date() },
  });
  revalidatePath("/siswa/fokus");
}
