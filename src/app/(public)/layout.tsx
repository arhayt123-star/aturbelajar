import { Navbar } from "@/components/Navbar";
import { PublicFooter } from "@/components/PublicFooter";
import { getSessionUser } from "@/lib/session-user";
import { logoutAction } from "@/features/auth/actions";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  return (
    <>
      <Navbar user={user ? { name: user.name, home: user.home } : null} logout={logoutAction} />
      <main>{children}</main>
      <PublicFooter />
    </>
  );
}
