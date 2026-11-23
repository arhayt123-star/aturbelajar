import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { RoleName } from "@/types";

// Pertahanan kedua di sisi server (middleware saja tidak cukup).
// Peran dicek ulang ke database supaya akun yang sudah dihapus atau diubah
// perannya tidak tetap bisa memakai token lama sampai kedaluwarsa.
const requireRole = cache(async (role: RoleName, loginPath: string) => {
  const session = await auth();
  if (!session?.user || session.user.role !== role) redirect(loginPath);
  const row = await prisma.user.findUnique({ where: { id: session.user.id }, select: { id: true, role: true } });
  if (!row || row.role !== role) redirect(loginPath);
  return session.user;
});

export const requireStudent = () => requireRole("STUDENT", "/masuk");
export const requireTeacher = () => requireRole("TEACHER", "/guru/masuk");
export const requireAdmin = () => requireRole("ADMIN", "/admin/masuk");
