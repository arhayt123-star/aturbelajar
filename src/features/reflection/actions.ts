"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/authz";
import { weekStartOf } from "@/lib/utils";
import { REFLECTION_QUESTIONS } from "@/lib/content";
import type { ActionState } from "@/lib/action-types";

export async function saveReflection(_p: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireStudent();
  const iso = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).safeParse(fd.get("weekStart"));
  if (!iso.success) return { ok: false, message: "Minggu tidak valid" };
  const answers = REFLECTION_QUESTIONS.map((_, i) => ({ q: i + 1, answer: String(fd.get(`q${i + 1}`) ?? "").trim().slice(0, 1500) }));
  if (answers.every((a) => !a.answer)) return { ok: false, message: "Isi minimal satu jawaban" };
  const weekStart = weekStartOf(iso.data);
  await prisma.weeklyReflection.upsert({
    where: { userId_weekStart: { userId: user.id, weekStart } },
    update: { answers },
    create: { userId: user.id, weekStart, answers },
  });
  revalidatePath("/siswa/refleksi");
  return { ok: true, message: "Refleksi tersimpan" };
}

export async function deleteReflection(fd: FormData) {
  const user = await requireStudent();
  await prisma.weeklyReflection.deleteMany({ where: { id: String(fd.get("id") ?? ""), userId: user.id } });
  revalidatePath("/siswa/refleksi");
}
