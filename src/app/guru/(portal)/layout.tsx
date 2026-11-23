import { signOut } from "@/auth";
import { requireTeacher } from "@/lib/authz";
import { StaffNav } from "@/components/StaffNav";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const user = await requireTeacher();
  async function logout() {
    "use server";
    await signOut({ redirectTo: "/" });
  }
  return (
    <div className="min-h-dvh bg-cream">
      <StaffNav name={user.name ?? "Guru BK"} logout={logout} variant="teacher" />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 md:px-6 md:pt-8">{children}</main>
    </div>
  );
}
