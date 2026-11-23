"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/authz";
import type { ActionState } from "@/lib/action-types";

const schema = z.object({
  topic: z.string().trim().min(3, "Topik minimal 3 karakter").max(100),
  message: z.string().trim().min(10, "Pesan minimal 10 karakter").max(1000),
});

export async function sendHelpRequest(_p: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireTeacher();
  const parsed = schema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  await prisma.helpRequest.create({ data: { teacherId: user.id, ...parsed.data } });
  revalidatePath("/guru/bantuan");
  return { ok: true, message: "Permintaan tersimpan" };
}
