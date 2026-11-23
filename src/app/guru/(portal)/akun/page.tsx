import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/authz";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { cardCls } from "@/components/styles";

export const metadata = { title: "Akun Guru BK - AturBelajar" };

export default async function TeacherAccountPage() {
  const user = await requireTeacher();
  const row = await prisma.user.findUnique({ where: { id: user.id }, select: { name: true, email: true, username: true } });
  return (
    <div className="max-w-xl space-y-5">
      <h1 className="text-2xl font-extrabold text-navy">Akun Guru BK</h1>
      <section className={cardCls}><p className="text-sm"><span className="text-ink/60">Nama:</span> {row?.name}</p><p className="text-sm"><span className="text-ink/60">Username:</span> {row?.username}</p><p className="text-sm"><span className="text-ink/60">Email:</span> {row?.email}</p></section>
      <ChangePasswordForm minLength={10} />
    </div>
  );
}
