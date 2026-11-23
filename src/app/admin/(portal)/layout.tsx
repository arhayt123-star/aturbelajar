import { signOut } from "@/auth";
import { requireAdmin } from "@/lib/authz";
import { StaffNav } from "@/components/StaffNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();
  async function logout() {
    "use server";
    await signOut({ redirectTo: "/" });
  }
  return (
    <div className="min-h-dvh bg-cream">
      <StaffNav name={user.name ?? "Admin"} logout={logout} variant="admin" />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 md:px-6 md:pt-8">{children}</main>
    </div>
  );
}
