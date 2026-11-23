"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { requireStudent } from "@/lib/authz";
import { clearLimit, hitLimit } from "@/lib/rate-limit";
import type { ActionState } from "@/lib/action-types";

export async function updateName(_p: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireStudent();
  const p = z.string().trim().min(2, "Nama minimal 2 karakter").max(80).safeParse(fd.get("name"));
  if (!p.success) return { ok: false, errors: { name: [p.error.issues[0].message] } };
  await prisma.user.update({ where: { id: user.id }, data: { name: p.data } });
  revalidatePath("/siswa", "layout");
  return { ok: true, message: "Nama diperbarui" };
}

// Menghapus akun beserta SELURUH data (cascade). Tidak bisa dibatalkan.
export async function deleteAccount(_p: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireStudent();
  const password = String(fd.get("password") ?? "");
  const row = await prisma.user.findUnique({ where: { id: user.id }, select: { passwordHash: true } });
  if (!row || !(await bcrypt.compare(password, row.passwordHash))) return { ok: false, message: "Password salah" };
  await prisma.user.delete({ where: { id: user.id } });
  await signOut({ redirectTo: "/" });
  return { ok: true };
}

// Berlaku untuk semua peran (siswa, Guru BK, admin).
export async function changePassword(_p: ActionState, fd: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) return { ok: false, message: "Sesi berakhir. Silakan masuk lagi." };
  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  const confirm = String(fd.get("confirm") ?? "");
  const row = await prisma.user.findUnique({ where: { id: session.user.id }, select: { passwordHash: true, role: true } });
  if (!row) return { ok: false, message: "Akun tidak ditemukan" };

  const min = row.role === "STUDENT" ? 8 : 10;
  if (next.length < min) return { ok: false, errors: { next: [`Password baru minimal ${min} karakter`] } };
  if (next.length > 72) return { ok: false, errors: { next: ["Password maksimal 72 karakter"] } };
  if (next !== confirm) return { ok: false, errors: { confirm: ["Konfirmasi tidak sama"] } };

  const key = `pw:${session.user.id}`;
  if (hitLimit(key, 6, 10 * 60 * 1000).limited) return { ok: false, message: "Terlalu banyak percobaan. Coba lagi nanti." };
  if (!(await bcrypt.compare(current, row.passwordHash))) return { ok: false, errors: { current: ["Password saat ini salah"] } };
  clearLimit(key);

  await prisma.user.update({ where: { id: session.user.id }, data: { passwordHash: await bcrypt.hash(next, 12) } });
  return { ok: true, message: "Password berhasil diganti" };
}
