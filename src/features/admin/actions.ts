"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";
import { generatePassword } from "@/lib/password";
import { staffSchema } from "@/lib/validators";
import type { ActionState } from "@/lib/action-types";

const refresh = () => revalidatePath("/admin", "layout");

// Admin hanya membuat akun Guru BK. Akun admin dibuat lewat seed (npm run db:seed).
export async function createTeacher(_p: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = staffSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  const { name, email } = parsed.data;
  const username = parsed.data.username ?? email.split("@")[0].toLowerCase().replace(/[^a-z0-9_.]/g, "_").slice(0, 24).padEnd(3, "_");
  const password = parsed.data.password ?? generatePassword();

  const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] }, select: { id: true } });
  if (exists) return { ok: false, message: "Email atau username sudah digunakan" };

  try {
    await prisma.user.create({
      data: {
        name, email, username, role: "TEACHER",
        passwordHash: await bcrypt.hash(password, 12),
        teacherProfile: { create: {} },
      },
    });
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") return { ok: false, message: "Email atau username sudah digunakan" };
    throw e;
  }
  refresh();
  return { ok: true, message: `Akun Guru BK dibuat. Username: ${username}`, secret: parsed.data.password ? undefined : password };
}

// Mengembalikan password sementara satu kali. Hanya untuk siswa dan Guru BK.
export async function resetUserPassword(_p: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const target = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } });
  if (!target || target.role === "ADMIN") return { ok: false, message: "Pengguna tidak ditemukan" };
  const password = generatePassword();
  await prisma.user.update({ where: { id }, data: { passwordHash: await bcrypt.hash(password, 12) } });
  return { ok: true, message: "Password diganti. Sampaikan ke pemilik akun dan minta segera mengubahnya.", secret: password };
}

// Menghapus akun beserta seluruh datanya (cascade). Akun admin tidak bisa dihapus dari sini.
export async function deleteUser(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  await prisma.user.deleteMany({ where: { id, role: { in: ["STUDENT", "TEACHER"] } } });
  refresh();
}

export async function setHelpResolved(fd: FormData) {
  await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const resolved = z.enum(["1", "0"]).parse(fd.get("resolved")) === "1";
  await prisma.helpRequest.updateMany({ where: { id }, data: { resolvedAt: resolved ? new Date() : null } });
  refresh();
  revalidatePath("/guru/bantuan");
}

export async function deleteHelpRequest(fd: FormData) {
  await requireAdmin();
  await prisma.helpRequest.deleteMany({ where: { id: String(fd.get("id") ?? "") } });
  refresh();
  revalidatePath("/guru/bantuan");
}
