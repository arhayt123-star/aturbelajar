import type { DefaultSession } from "next-auth";

type RoleName = "STUDENT" | "TEACHER" | "ADMIN";

declare module "next-auth" {
  interface Session {
    user: { id: string; role: RoleName } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: RoleName;
  }
}
