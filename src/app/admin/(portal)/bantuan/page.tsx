import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authz";
import { fmtDate, cn } from "@/lib/utils";
import { ConfirmForm } from "@/components/ui";
import { deleteHelpRequest, setHelpResolved } from "@/features/admin/actions";
import { btnGhost, btnPrimary, cardCls } from "@/components/styles";

export const metadata = { title: "Permintaan Bantuan - Admin" };

export default async function AdminHelpPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const { status } = await searchParams;
  const filter = status === "selesai" ? "selesai" : status === "semua" ? "semua" : "terbuka";
  const rows = await prisma.helpRequest.findMany({
    where: filter === "terbuka" ? { resolvedAt: null } : filter === "selesai" ? { resolvedAt: { not: null } } : {},
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { teacher: { select: { name: true, email: true } } },
  });
  const tab = (label: string, v: string) => (
    <Link href={`/admin/bantuan?status=${v}`} className={cn("flex min-h-10 items-center rounded-lg px-3.5 text-sm font-semibold", filter === v ? "bg-forest text-white" : "text-forest")}>{label}</Link>
  );
  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-extrabold text-navy">Permintaan Bantuan</h1><p className="text-sm text-ink/70">Permintaan pendampingan yang dikirim Guru BK. Tindak lanjut dilakukan manual, lalu tandai selesai di sini.</p></div>
      <div className="flex w-fit gap-1 rounded-xl bg-white p-1 shadow-soft">{tab("Terbuka", "terbuka")}{tab("Selesai", "selesai")}{tab("Semua", "semua")}</div>
      {rows.length === 0 ? <p className={cardCls + " text-center text-sm text-ink/70"}>Tidak ada permintaan.</p> : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.id} className={cardCls}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="break-words font-bold text-navy">{r.topic}</p>
                  <p className="text-xs text-ink/60">{r.teacher.name} ({r.teacher.email}) - {fmtDate(r.createdAt)}</p>
                </div>
                <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", r.resolvedAt ? "bg-fresh/15 text-forest" : "bg-orange-100 text-orange-800")}>{r.resolvedAt ? `Selesai ${fmtDate(r.resolvedAt)}` : "Terbuka"}</span>
              </div>
              <p className="mt-3 whitespace-pre-wrap break-words text-sm text-ink/85">{r.message}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <form action={setHelpResolved}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="resolved" value={r.resolvedAt ? "0" : "1"} />
                  <button className={(r.resolvedAt ? btnGhost : btnPrimary) + " !min-h-10 !py-1.5 text-sm"}>{r.resolvedAt ? "Buka kembali" : "Tandai selesai"}</button>
                </form>
                <ConfirmForm action={deleteHelpRequest} message="Hapus permintaan ini?" fields={{ id: r.id }}>
                  <button className="inline-flex min-h-10 items-center rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-700 hover:bg-red-50">Hapus</button>
                </ConfirmForm>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
