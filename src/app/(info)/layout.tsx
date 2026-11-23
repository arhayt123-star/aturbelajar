import { Navbar } from "@/components/Navbar";
import { PublicFooter } from "@/components/PublicFooter";
import { Sidebar } from "@/components/Sidebar";
import { MobileNavigation } from "@/components/MobileNavigation";
import { StaffNav } from "@/components/StaffNav";
import { getSessionUser } from "@/lib/session-user";
import { logoutAction } from "@/features/auth/actions";

// Halaman Tentang / Etika & Privasi / ADDIE. Jika pengguna sudah masuk, halaman ini
// tampil di dalam menu akunnya sendiri (siswa / Guru BK / admin) sehingga tidak
// terlihat seperti keluar akun. Pengunjung biasa melihat tampilan publik.
export default async function InfoLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  if (user?.role === "STUDENT") {
    return (
      <div className="min-h-dvh bg-cream md:pl-64">
        <Sidebar name={user.name} logout={logoutAction} />
        <MobileNavigation name={user.name} logout={logoutAction} />
        <main className="mx-auto w-full max-w-5xl pb-28 pt-0 md:pb-10">{children}</main>
      </div>
    );
  }
  if (user) {
    return (
      <div className="min-h-dvh bg-cream">
        <StaffNav name={user.name} logout={logoutAction} variant={user.role === "ADMIN" ? "admin" : "teacher"} />
        <main className="mx-auto w-full max-w-6xl pb-16">{children}</main>
      </div>
    );
  }
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <PublicFooter />
    </>
  );
}
