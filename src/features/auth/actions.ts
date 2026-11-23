"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";
import { clearLimit, hitLimit } from "@/lib/rate-limit";
import type { ActionState } from "@/lib/action-types";
import type { RoleName } from "@/types";

export type { ActionState };

// Pendaftaran publik HANYA membuat akun siswa. Peran tidak pernah diambil dari input.
export async function registerStudent(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.flatten().fieldErrors };
  }
  const { name, username, email, password, schoolLevel, grade } = parsed.data;

  const exists = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { id: true },
  });
  if (exists) return { ok: false, message: "Email atau username sudah digunakan" };

  const passwordHash = await bcrypt.hash(password, 12);
  try {
    await prisma.user.create({
      data: {
        name,
        username,
        email,
        passwordHash,
        role: "STUDENT",
        studentProfile: { create: { schoolLevel, grade } },
      },
    });
  } catch (e) {
    // Dua pendaftaran bersamaan dengan email/username sama.
    if ((e as { code?: string }).code === "P2002") return { ok: false, message: "Email atau username sudah digunakan" };
    throw e;
  }
  return { ok: true, message: "Akun berhasil dibuat. Silakan masuk." };
}

const HOME: Record<RoleName, string> = { STUDENT: "/siswa", TEACHER: "/guru", ADMIN: "/admin" };

export async function loginAction(
  expectedRole: RoleName,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const identifier = String(formData.get("identifier") ?? "").trim().toLowerCase();
  const limitKey = `login:${expectedRole}:${identifier}`;
  if (hitLimit(limitKey, 8, 10 * 60 * 1000).limited) {
    return { ok: false, message: "Terlalu banyak percobaan masuk. Coba lagi dalam 10 menit." };
  }
  try {
    await signIn("credentials", {
      identifier,
      password: formData.get("password"),
      expectedRole,
      redirectTo: HOME[expectedRole],
    });
    return { ok: true };
  } catch (e) {
    if (e instanceof AuthError) return { ok: false, message: "Username/email atau password salah" };
    clearLimit(limitKey); // redirect berhasil (dilempar sebagai error oleh Next.js)
    throw e; // redirect Next.js harus dilempar ulang
  }
}

// Keluar hanya terjadi lewat tombol "Keluar" (form), bukan karena berpindah halaman.
export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
