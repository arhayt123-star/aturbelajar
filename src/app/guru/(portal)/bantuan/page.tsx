import { prisma } from "@/lib/prisma";
import { requireTeacher } from "@/lib/authz";
import { HelpRequestForm } from "@/components/HelpRequestForm";
import { cardCls } from "@/components/styles";
import { fmtDate } from "@/lib/utils";

export const metadata = { title: "Permintaan Bantuan - AturBelajar" };

export default async function HelpPage() {
  const user = await requireTeacher();
  const rows = await prisma.helpRequest.findMany({ where: { teacherId: user.id }, orderBy: { createdAt: "desc" }, take: 10 });
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold text-navy">Permintaan Pendampingan</h1>
      <p className="rounded-card bg-gold/20 p-4 text-sm text-navy">Permintaan disimpan di database dan dapat dilihat admin. Belum ada pengiriman otomatis (email/WhatsApp), jadi tindak lanjut dilakukan manual oleh pengelola.</p>
      <HelpRequestForm />
      <section className={cardCls}>
        <h2 className="mb-3 font-bold text-navy">Permintaan sebelumnya</h2>
        {rows.length === 0 ? <p className="text-sm text-ink/70">Belum ada permintaan.</p> : (
          <ul className="divide-y divide-navy/10">{rows.map((r) => <li key={r.id} className="py-3 text-sm"><p className="font-semibold">{r.topic} <span className="font-normal text-ink/60">- {fmtDate(r.createdAt)}</span> <span className={"ml-1 rounded-full px-2 py-0.5 text-xs font-medium " + (r.resolvedAt ? "bg-fresh/15 text-forest" : "bg-gold/30 text-navy")}>{r.resolvedAt ? "Sudah ditindaklanjuti" : "Menunggu"}</span></p><p className="mt-1 break-words text-ink/80">{r.message}</p></li>)}</ul>
        )}
      </section>
    </div>
  );
}
