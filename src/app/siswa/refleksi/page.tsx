import Link from "next/link";
import { Trash2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireStudent } from "@/lib/authz";
import { todayInfo, weekStartOf } from "@/lib/utils";
import { REFLECTION_QUESTIONS } from "@/lib/content";
import { ReflectionForm } from "@/components/ReflectionForm";
import { ConfirmForm } from "@/components/ui";
import { deleteReflection } from "@/features/reflection/actions";
import { btnIcon, cardCls } from "@/components/styles";

export const metadata = { title: "Refleksi Mingguan - AturBelajar" };

const weekLabel = (iso: string) => {
  const s = new Date(iso + "T00:00:00Z");
  const e = new Date(s); e.setUTCDate(e.getUTCDate() + 6);
  const f = (d: Date) => d.toLocaleDateString("id-ID", { day: "numeric", month: "short", timeZone: "UTC" });
  return `${f(s)} - ${f(e)}`;
};

export default async function ReflectionPage({ searchParams }: { searchParams: Promise<{ minggu?: string }> }) {
  const user = await requireStudent();
  const { minggu } = await searchParams;
  const valid = minggu && /^\d{4}-\d{2}-\d{2}$/.test(minggu) ? minggu : todayInfo().iso;
  const weekStart = weekStartOf(valid);
  const weekIso = weekStart.toISOString().slice(0, 10);
  const [current, all] = await Promise.all([
    prisma.weeklyReflection.findUnique({ where: { userId_weekStart: { userId: user.id, weekStart } } }),
    prisma.weeklyReflection.findMany({ where: { userId: user.id }, orderBy: { weekStart: "desc" }, take: 12 }),
  ]);
  const raw = Array.isArray(current?.answers) ? (current!.answers as { q: number; answer: string }[]) : [];
  const answers = REFLECTION_QUESTIONS.map((_, i) => raw.find((r) => r.q === i + 1)?.answer ?? "");

  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-extrabold text-navy">Refleksi Mingguan</h1><p className="text-sm text-ink/70">Minggu {weekLabel(weekIso)}. Refleksi ini bersifat pribadi dan tidak dibuka untuk Guru BK.</p></div>
      <ReflectionForm weekStart={weekIso} questions={REFLECTION_QUESTIONS} answers={answers} />
      <section className={cardCls}>
        <h2 className="mb-3 font-bold text-navy">Refleksi tersimpan</h2>
        {all.length === 0 ? <p className="text-sm text-ink/70">Belum ada refleksi tersimpan.</p> : (
          <ul className="divide-y divide-navy/10">
            {all.map((r) => {
              const iso = r.weekStart.toISOString().slice(0, 10);
              return (
                <li key={r.id} className="flex items-center justify-between gap-3 py-2.5">
                  <Link href={`/siswa/refleksi?minggu=${iso}`} className="flex min-h-11 flex-1 items-center text-sm font-medium text-forest underline">Minggu {weekLabel(iso)}</Link>
                  <ConfirmForm action={deleteReflection} message="Hapus refleksi minggu ini?" fields={{ id: r.id }}><button aria-label="Hapus refleksi" className={btnIcon + " text-red-600"}><Trash2 className="h-5 w-5" /></button></ConfirmForm>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
