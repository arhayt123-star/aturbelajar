import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/authz";
import { DeleteAccountForm, NameForm } from "@/components/AccountForms";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { cardCls } from "@/components/styles";

export const metadata = { title: "Akun & Data - AturBelajar" };

export default async function ProfilePage() {
  const user = await requireStudent();
  const row = await prisma.user.findUnique({ where: { id: user.id }, select: { name: true, email: true, username: true } });
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-navy">Akun & Data</h1>
      <section className={cardCls}>
        <p className="text-sm"><span className="text-ink/60">Username:</span> {row?.username}</p>
        <p className="text-sm"><span className="text-ink/60">Email:</span> {row?.email}</p>
      </section>
      <NameForm name={row?.name ?? ""} />
      <ChangePasswordForm />
      <DeleteAccountForm />
    </div>
  );
}
