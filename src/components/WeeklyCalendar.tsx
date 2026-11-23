import Link from "next/link";
import type { ScheduleView, TaskOption } from "@/types";
import { ScheduleItem } from "./ScheduleParts";
import { cardCls } from "./styles";
import { DAYS, cn } from "@/lib/utils";

export function WeeklyCalendar({ items, selectedDay, today, tasks }: { items: ScheduleView[]; selectedDay: number; today: number; tasks: TaskOption[] }) {
  const byDay = (d: number) => items.filter((i) => i.dayOfWeek === d);
  const dayItems = byDay(selectedDay);
  return (
    <div className="space-y-5">
      <nav aria-label="Pilih hari" className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {DAYS.map((d, i) => {
          const n = byDay(i + 1).length;
          const active = selectedDay === i + 1;
          return (
            <Link
              key={d}
              href={`/siswa/jadwal?hari=${i + 1}`}
              scroll={false}
              aria-current={active ? "date" : undefined}
              className={cn(
                "relative flex min-h-16 flex-col items-center justify-center rounded-xl px-0.5 text-sm font-semibold transition",
                active ? "bg-forest text-white shadow-soft" : "bg-white text-forest shadow-soft hover:bg-fresh/10",
                today === i + 1 && !active && "ring-2 ring-gold",
              )}
            >
              <span className="sm:hidden">{d.slice(0, 3)}</span>
              <span className="hidden sm:inline">{d}</span>
              <span className={cn("mt-1 min-w-5 rounded-full px-1.5 text-[11px] font-bold leading-5", active ? "bg-white/20" : n ? "bg-fresh/15" : "text-ink/30")}>{n}</span>
              {today === i + 1 && <span className={cn("absolute -top-2 rounded-full px-1.5 text-[9px] font-bold leading-4", active ? "bg-gold text-navy" : "bg-gold text-navy")}>Hari ini</span>}
            </Link>
          );
        })}
      </nav>

      <section aria-label={`Kegiatan hari ${DAYS[selectedDay - 1]}`} className={cardCls}>
        <h2 className="mb-3 text-lg font-bold text-navy">{DAYS[selectedDay - 1]}{today === selectedDay && <span className="ml-2 text-sm font-medium text-forest">(hari ini)</span>}</h2>
        {dayItems.length === 0 ? (
          <p className="rounded-xl bg-cream p-5 text-center text-sm text-ink/70">Belum ada kegiatan di hari {DAYS[selectedDay - 1]}. Tekan &quot;Tambah Kegiatan&quot; untuk mulai menyusun.</p>
        ) : (
          <ul className="space-y-2.5">{dayItems.map((i) => <ScheduleItem key={i.id} item={i} tasks={tasks} />)}</ul>
        )}
      </section>

      <section aria-label="Ringkasan seminggu" className="hidden md:block">
        <h2 className="mb-2 text-sm font-bold text-navy/70">Ringkasan seminggu</h2>
        <div className="grid grid-cols-7 gap-2">
          {DAYS.map((d, idx) => (
            <div key={d} className={cn("min-w-0 rounded-xl bg-white/70 p-2", selectedDay === idx + 1 && "ring-2 ring-forest/40")}>
              <p className="mb-1.5 text-center text-xs font-bold text-navy">{d.slice(0, 3)}</p>
              <ul className="space-y-1">
                {byDay(idx + 1).map((i) => (
                  <li key={i.id}>
                    <Link href={`/siswa/jadwal?hari=${idx + 1}`} scroll={false} title={`${i.start} ${i.title}`} className={cn("block truncate rounded-md px-1.5 py-1 text-[11px] leading-tight", i.isBreak ? "bg-gold/30" : "bg-fresh/15")}>
                      <span className="font-semibold tabular-nums">{i.start}</span> {i.title}
                    </Link>
                  </li>
                ))}
                {byDay(idx + 1).length === 0 && <li className="py-1 text-center text-[11px] text-ink/30">-</li>}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
