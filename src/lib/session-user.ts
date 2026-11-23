import { auth } from "@/auth";
import { homeByRole } from "@/components/nav";
import type { RoleName } from "@/types";

// Membaca sesi tanpa mengubahnya: halaman publik tidak pernah memutus login.
export async function getSessionUser() {
  const session = await auth();
  const u = session?.user;
  if (!u?.role) return null;
  const role = u.role as RoleName;
  return { id: u.id, name: u.name ?? "Pengguna", role, home: homeByRole[role] };
}
