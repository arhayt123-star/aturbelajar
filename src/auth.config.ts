import type { NextAuthConfig } from "next-auth";
import type { RoleName } from "./types";

// Konfigurasi ringan (tanpa Prisma/bcrypt) agar kompatibel dengan middleware edge.
export const authConfig = {
  pages: { signIn: "/masuk" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const path = nextUrl.pathname;
      if (path === "/guru/masuk" || path === "/admin/masuk") return true;
      const need: RoleName | null = path.startsWith("/admin")
        ? "ADMIN"
        : path.startsWith("/guru")
          ? "TEACHER"
          : path.startsWith("/siswa")
            ? "STUDENT"
            : null;
      if (!need) return true;
      if (auth?.user?.role === need) return true;
      // Arahkan ke halaman masuk yang sesuai dengan area yang dituju.
      const login = need === "ADMIN" ? "/admin/masuk" : need === "TEACHER" ? "/guru/masuk" : "/masuk";
      return Response.redirect(new URL(login, nextUrl));
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: RoleName }).role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as RoleName;
      return session;
    },
  },
} satisfies NextAuthConfig;
