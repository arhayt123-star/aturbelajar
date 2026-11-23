"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/authz";
import { opt } from "@/lib/form";
import { toMinutes } from "@/lib/utils";
import type { ActionState } from "@/lib/action-types";

const schema = z.object({
  type: z.enum(["SCHEDULE", "TASK_DEADLINE"]),
  targetId: z.string().min(1, "Pilih tugas atau jadwal"),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Jam tidak valid"),
  frequency: z.enum(["ONCE", "DAILY", "WEEKLY"]),
  note: opt(z.string()),
});

export async function saveReminder(_p: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireStudent();
  const parsed = schema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  const d = parsed.data;
  const isTask = d.type === "TASK_DEADLINE";
  const owned = isTask
    ? await prisma.task.count({ where: { id: d.targetId, userId: user.id } })
    : await prisma.studySchedule.count({ where: { id: d.targetId, userId: user.id } });
  if (!owned) return { ok: false, message: "Data tidak valid" };
  await prisma.reminder.create({
    data: {
      userId: user.id, type: d.type, remindAt: toMinutes(d.time), frequency: d.frequency,
      taskId: isTask ? d.targetId : null, scheduleId: isTask ? null : d.targetId,
    },
  });
  revalidatePath("/siswa/pengingat");
  return { ok: true, message: "Pengingat tersimpan" };
}

export async function toggleReminder(id: string, enabled: boolean) {
  const user = await requireStudent();
  await prisma.reminder.updateMany({ where: { id, userId: user.id }, data: { enabled } });
  revalidatePath("/siswa/pengingat");
}

export async function deleteReminder(fd: FormData) {
  const user = await requireStudent();
  await prisma.reminder.deleteMany({ where: { id: String(fd.get("id") ?? ""), userId: user.id } });
  revalidatePath("/siswa/pengingat");
}
