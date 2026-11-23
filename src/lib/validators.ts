import { z } from "zod";
import { opt } from "./form";

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9_.]{3,24}$/, "3-24 karakter: huruf, angka, titik, atau underscore"),
    email: z.string().trim().toLowerCase().email("Email tidak valid"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .max(72, "Password maksimal 72 karakter"),
    schoolLevel: z.enum(["SMP", "SMA"]),
    grade: opt(z.coerce.number().int().min(7, "Kelas 7-12").max(12, "Kelas 7-12")),
    consent: z.literal("on", {
      errorMap: () => ({ message: "Persetujuan penggunaan data wajib dicentang" }),
    }),
  })
  .superRefine((v, ctx) => {
    if (v.grade == null) return;
    const [min, max] = v.schoolLevel === "SMP" ? [7, 9] : [10, 12];
    if (v.grade < min || v.grade > max) {
      ctx.addIssue({ code: "custom", path: ["grade"], message: `Kelas ${min}-${max} untuk jenjang ${v.schoolLevel}` });
    }
  });

export const loginSchema = z.object({
  identifier: z.string().trim().toLowerCase().min(3),
  password: z.string().min(1),
  expectedRole: z.enum(["STUDENT", "TEACHER", "ADMIN"]),
});

// Dipakai admin saat membuat akun Guru BK.
export const staffSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
  email: z.string().trim().toLowerCase().email("Email tidak valid"),
  username: opt(
    z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9_.]{3,24}$/, "3-24 karakter: huruf, angka, titik, atau underscore"),
  ),
  password: opt(z.string().min(10, "Password minimal 10 karakter").max(72, "Password maksimal 72 karakter")),
});

export type RegisterInput = z.infer<typeof registerSchema>;
