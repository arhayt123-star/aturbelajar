"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Bell, Trash2 } from "lucide-react";
import { deleteReminder, saveReminder, toggleReminder } from "@/features/reminders/actions";
import { useFormAction } from "@/lib/use-form-action";
import type { TaskOption } from "@/types";
import { ConfirmForm, FieldError, FormMessage, SubmitButton } from "./ui";
import { btnGhost, btnIcon, cardCls, inputCls, labelCls } from "./styles";

export type ReminderView = { id: string; label: string; time: string; minute: number; frequency: "ONCE" | "DAILY" | "WEEKLY"; enabled: boolean; createdIso: string; createdDow: number };
const FREQ = { ONCE: "Sekali", DAILY: "Setiap hari", WEEKLY: "Setiap minggu" } as const;
const TZ = "Asia/Jakarta";

export function ReminderSettings({ reminders, tasks, schedules }: { reminders: ReminderView[]; tasks: TaskOption[]; schedules: TaskOption[] }) {
  const [state, action] = useFormAction(saveReminder);
  const [type, setType] = useState<"SCHEDULE" | "TASK_DEADLINE">("TASK_DEADLINE");
  const [perm, setPerm] = useState<string>("default");
  const [, start] = useTransition();
  const fired = useRef(new Set<string>()); // bertahan antar render agar tidak berbunyi dua kali dalam menit yang sama
  const e = state.errors ?? {};
  const options = type === "TASK_DEADLINE" ? tasks : schedules;

  useEffect(() => { setPerm(typeof Notification === "undefined" ? "unsupported" : Notification.permission); }, []);

  // Pengecekan hanya berjalan selama halaman ini terbuka di browser.
  useEffect(() => {
    if (typeof Notification === "undefined" || perm !== "granted") return;
    const tick = () => {
      const now = new Date();
      const hm = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(now);
      const [h, m] = hm.split(":").map(Number);
      const minute = h * 60 + m;
      const todayIso = now.toLocaleDateString("en-CA", { timeZone: TZ });
      const dow = ((new Date(todayIso + "T00:00:00Z").getUTCDay() + 6) % 7) + 1;
      for (const r of reminders) {
        if (!r.enabled || r.minute !== minute) continue;
        if (r.frequency === "ONCE" && r.createdIso !== todayIso) continue;
        if (r.frequency === "WEEKLY" && r.createdDow !== dow) continue;
        const key = `${r.id}-${todayIso}-${minute}`;
        if (fired.current.has(key)) continue;
        fired.current.add(key);
        new Notification("AturBelajar", { body: r.label });
      }
    };
    tick();
    const id = setInterval(tick, 20000);
    return () => clearInterval(id);
  }, [reminders, perm]);

  return (
    <div className="space-y-5">
      <div className={cardCls}>
        <h2 className="font-bold text-navy">Notifikasi browser</h2>
        <p className="mt-1 text-sm text-ink/75">Pengingat hanya muncul saat AturBelajar terbuka di browser. Belum ada pengiriman otomatis di latar belakang.</p>
        {perm === "granted" ? <p className="mt-3 text-sm font-medium text-forest">Izin notifikasi aktif.</p>
          : perm === "denied" ? <p className="mt-3 text-sm text-red-700">Notifikasi diblokir. Ubah izin di pengaturan browser jika ingin mengaktifkan.</p>
          : perm === "unsupported" ? <p className="mt-3 text-sm text-ink/70">Browser ini tidak mendukung notifikasi. Pengingat tetap tersimpan.</p>
          : <button className={btnGhost + " mt-3"} onClick={async () => { if (typeof Notification !== "undefined") setPerm(await Notification.requestPermission()); }}><Bell className="h-5 w-5" aria-hidden /> Izinkan notifikasi</button>}
      </div>

      <form action={action} className={cardCls + " space-y-3"} noValidate key={state.ok ? "saved" : "form"}>
        <h2 className="font-bold text-navy">Tambah pengingat</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className={labelCls}>Jenis</label>
            <select name="type" value={type} onChange={(ev) => setType(ev.target.value as typeof type)} className={inputCls}>
              <option value="TASK_DEADLINE">Tenggat tugas</option><option value="SCHEDULE">Jadwal belajar</option>
            </select></div>
          <div><label className={labelCls}>{type === "TASK_DEADLINE" ? "Tugas" : "Kegiatan"}</label>
            <select key={type} name="targetId" className={inputCls} defaultValue={state.values?.type === type ? (state.values?.targetId ?? "") : ""}><option value="" disabled>Pilih...</option>{options.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}</select>
            <FieldError errors={e.targetId} /></div>
          <div><label className={labelCls}>Jam</label><input type="time" name="time" defaultValue={state.values?.time ?? "16:00"} required className={inputCls} /><FieldError errors={e.time} /></div>
          <div><label className={labelCls}>Frekuensi</label>
            <select name="frequency" className={inputCls} defaultValue={state.values?.frequency ?? "DAILY"}><option value="ONCE">Sekali (hari ini)</option><option value="DAILY">Setiap hari</option><option value="WEEKLY">Setiap minggu</option></select></div>
        </div>
        <FormMessage state={state} />
        <SubmitButton>Simpan pengingat</SubmitButton>
      </form>

      <div className={cardCls}>
        <h2 className="mb-3 font-bold text-navy">Pengingatmu</h2>
        {reminders.length === 0 ? <p className="text-sm text-ink/70">Belum ada pengingat.</p> : (
          <ul className="divide-y divide-navy/10">
            {reminders.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0"><p className="break-words text-sm font-semibold">{r.label}</p><p className="text-xs text-ink/70">{r.time} - {FREQ[r.frequency]}</p></div>
                <div className="flex shrink-0 items-center gap-1">
                  <label className="flex min-h-11 items-center gap-2 text-xs"><input type="checkbox" checked={r.enabled} onChange={(ev) => start(() => toggleReminder(r.id, ev.target.checked))} className="h-5 w-5 accent-forest" /> Aktif</label>
                  <ConfirmForm action={deleteReminder} message="Hapus pengingat ini?" fields={{ id: r.id }}><button aria-label="Hapus pengingat" className={btnIcon + " text-red-600"}><Trash2 className="h-5 w-5" /></button></ConfirmForm>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
