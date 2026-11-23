import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { existsSync, readFileSync } from "node:fs";

// tsx tidak membaca .env sendiri, jadi dibaca manual agar TEACHER_* dan ADMIN_* terbaca.
if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!m || line.trim().startsWith("#")) continue;
    const v = m[2].replace(/^(['"])(.*)\1$/, "$2");
    if (process.env[m[1]] === undefined) process.env[m[1]] = v;
  }
}

const prisma = new PrismaClient();

const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9_.]/g, "_");

async function upsertStaff(role: "TEACHER" | "ADMIN", prefix: string) {
  const name = process.env[`${prefix}_NAME`];
  const email = process.env[`${prefix}_EMAIL`]?.toLowerCase();
  const password = process.env[`${prefix}_PASSWORD`];
  if (!name && !email && !password) return null; // dilewati

  if (!name || !email || !password) {
    throw new Error(`Isi ${prefix}_NAME, ${prefix}_EMAIL, dan ${prefix}_PASSWORD di .env`);
  }
  if (password.length < 10) throw new Error(`${prefix}_PASSWORD minimal 10 karakter`);

  const passwordHash = await bcrypt.hash(password, 12);
  const base = clean(email.split("@")[0]).slice(0, 24);

  const existing = await prisma.user.findUnique({ where: { email } });
  let username = existing?.username ?? base;
  if (!existing) {
    // Hindari bentrok username unik dengan akun lain.
    for (let i = 2; await prisma.user.findUnique({ where: { username } }); i++) username = `${base.slice(0, 20)}${i}`;
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, passwordHash, role },
    create: { name, email, username, passwordHash, role },
  });
  if (role === "TEACHER") {
    await prisma.teacherProfile.upsert({ where: { userId: user.id }, update: {}, create: { userId: user.id } });
  }
  console.log(`Akun ${role === "ADMIN" ? "Admin" : "Guru BK"} siap: ${email} (username: ${user.username})`);
  return user;
}

async function main() {
  const t = await upsertStaff("TEACHER", "TEACHER");
  const a = await upsertStaff("ADMIN", "ADMIN");
  if (!t && !a) throw new Error("Isi TEACHER_* dan/atau ADMIN_* di .env sebelum menjalankan seed");
}

main().finally(() => prisma.$disconnect());
