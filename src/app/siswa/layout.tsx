import { signOut } from "@/auth";
import { requireStudent } from "@/lib/authz";
import { Sidebar } from "@/components/Sidebar";
import { MobileNavigation } from "@/components/MobileNavigation";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await requireStudent();
  async function logout() {
    "use server";
    await signOut({ redirectTo: "/" });
  }
  return (
    <div className="min-h-dvh bg-cream md:pl-64">
      <Sidebar name={user.name ?? "Siswa"} logout={logout} />
      <MobileNavigation name={user.name ?? "Siswa"} logout={logout} />
      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 md:px-8 md:pb-10 md:pt-8">{children}</main>
    </div>
  );
}
