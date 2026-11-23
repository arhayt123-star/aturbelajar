"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/authz";
import { opt } from "@/lib/form";
import { toMinutes } from "@/lib/utils";
import type { ActionState } from "@/lib/action-types";

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Jam tidak valid");
const schema = z.object({
  id: opt(z.string()),
  title: z.string().trim().min(2, "Nama kegiatan minimal 2 karakter").max(80),
  subject: opt(z.string().trim().max(60)),
  dayOfWeek: z.coerce.number().int().min(1).max(7),
  start: time,
  end: time,
  isBreak: opt(z.literal("on")),
  taskId: opt(z.string()),
});

export async function saveSchedule(_p: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireStudent();
  const parsed = schema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  const d = parsed.data;
  const startMinute = toMinutes(d.start);
  const endMinute = toMinutes(d.end);
  if (endMinute <= startMinute) return { ok: false, errors: { end: ["Jam selesai harus setelah jam mulai"] } };

  if (d.taskId) {
    const own = await prisma.task.count({ where: { id: d.taskId, userId: user.id } });
    if (!own) return { ok: false, message: "Tugas tidak valid" };
  }
  const data = {
    title: d.title, subject: d.subject ?? null, dayOfWeek: d.dayOfWeek, startMinute, endMinute,
    isBreak: d.isBreak === "on", taskId: d.taskId ?? null,
  };
  if (d.id) {
    const r = await prisma.studySchedule.updateMany({ where: { id: d.id, userId: user.id }, data });
    if (!r.count) return { ok: false, message: "Kegiatan tidak ditemukan" };
  } else {
    await prisma.studySchedule.create({ data: { ...data, userId: user.id } });
  }
  revalidatePath("/siswa", "layout");
  return { ok: true, message: "Kegiatan tersimpan" };
}

export async function deleteSchedule(fd: FormData) {
  const user = await requireStudent();
  await prisma.studySchedule.deleteMany({ where: { id: String(fd.get("id") ?? ""), userId: user.id } });
  revalidatePath("/siswa", "layout");
}
