import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";
import { prisma } from "./lib/prisma";
import { loginSchema } from "./lib/validators";

// Hash tiruan agar waktu respons sama baik akun ada maupun tidak.
const DUMMY_HASH = "$2a$12$mmMeY2ahHo3UdcT9.XlcLuDJ1U3cg.dD0/8Y829IFuWoDLgzv4T/a";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        identifier: {},
        password: {},
        expectedRole: {},
      },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { identifier, password, expectedRole } = parsed.data;

        const user = await prisma.user.findFirst({
          where: { OR: [{ email: identifier }, { username: identifier }] },
        });

        const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
        // Peran harus cocok dengan halaman login yang dipakai.
        if (!user || !ok || user.role !== expectedRole) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
});
