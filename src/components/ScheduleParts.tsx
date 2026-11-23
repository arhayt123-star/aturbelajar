"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Coffee, Pencil, Plus, Trash2 } from "lucide-react";
import { deleteSchedule, saveSchedule } from "@/features/schedule/actions";
import { useFormAction } from "@/lib/use-form-action";
import type { ScheduleView, TaskOption } from "@/types";
import { ConfirmForm, FieldError, FormMessage, SubmitButton } from "./ui";
import { Modal } from "./Modal";
import { btnGhost, btnIcon, inputCls, labelCls } from "./styles";
import { DAYS, cn, toMinutes } from "@/lib/utils";

export function formatDuration(start: string, end: string) {
  const mins = toMinutes(end) - toMinutes(start);
  if (mins <= 0) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return [h ? `${h} jam` : "", m ? `${m} mnt` : ""].filter(Boolean).join(" ");
}

export function ScheduleForm({ initial, tasks, defaultDay, onDone }: { initial?: ScheduleView; tasks: TaskOption[]; defaultDay: number; onDone: () => void }) {
  const [state, action] = useFormAction(saveSchedule);
  const v = state.values;
  const uid = useId();
  // onDone dibuat ulang di setiap render induk; simpan di ref agar efek hanya jalan saat state berubah.
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => { if (state.ok) done.current(); }, [state]);
  const e = state.errors ?? {};
  const id = (n: string) => `${uid}-${n}`;
  return (
    <form action={action} className="space-y-4" noValidate>
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <div>
        <label htmlFor={id("title")} className={labelCls}>Kegiatan</label>
        <input id={id("title")} name="title" defaultValue={v?.title ?? initial?.title} required autoFocus maxLength={80} className={inputCls} placeholder="Mis. Belajar Matematika" />
        <FieldError errors={e.title} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={id("day")} className={labelCls}>Hari</label>
          <select id={id("day")} name="dayOfWeek" defaultValue={v?.dayOfWeek ?? initial?.dayOfWeek ?? defaultDay} className={inputCls}>
            {DAYS.map((d, i) => <option key={d} value={i + 1}>{d}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={id("subject")} className={labelCls}>Mata pelajaran</label>
          <input id={id("subject")} name="subject" defaultValue={v?.subject ?? initial?.subject ?? ""} maxLength={60} className={inputCls} placeholder="Opsional" />
          <FieldError errors={e.subject} />
        </div>
        <div>
          <label htmlFor={id("start")} className={labelCls}>Mulai</label>
          <input id={id("start")} type="time" name="start" defaultValue={v?.start ?? initial?.start ?? "08:00"} required className={inputCls} />
          <FieldError errors={e.start} />
        </div>
        <div>
          <label htmlFor={id("end")} className={labelCls}>Selesai</label>
          <input id={id("end")} type="time" name="end" defaultValue={v?.end ?? initial?.end ?? "09:00"} required className={inputCls} />
          <FieldError errors={e.end} />
        </div>
      </div>
      <div>
        <label htmlFor={id("task")} className={labelCls}>Hubungkan dengan tugas (opsional)</label>
        <select id={id("task")} name="taskId" defaultValue={v?.taskId ?? initial?.taskId ?? ""} className={inputCls}>
          <option value="">Tidak dihubungkan</option>
          {tasks.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
      </div>
      <label className="flex min-h-11 items-center gap-3 text-sm">
        <input type="checkbox" name="isBreak" defaultChecked={v ? v.isBreak === "on" : initial?.isBreak} className="h-5 w-5 accent-forest" /> Ini waktu istirahat
      </label>
      <FormMessage state={state} />
      <div className="flex flex-wrap gap-3">
        <SubmitButton>Simpan</SubmitButton>
        <button type="button" onClick={onDone} className={btnGhost}>Batal</button>
      </div>
    </form>
  );
}

export function NewSchedulePanel({ tasks, defaultDay }: { tasks: TaskOption[]; defaultDay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-card border-2 border-dashed border-fresh/50 bg-white/60 font-medium text-forest transition hover:bg-fresh/10">
        <Plus className="h-5 w-5" aria-hidden /> Tambah Kegiatan
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Kegiatan baru">
        <ScheduleForm tasks={tasks} defaultDay={defaultDay} onDone={() => setOpen(false)} />
      </Modal>
    </>
  );
}

export function ScheduleItem({ item, tasks }: { item: ScheduleView; tasks: TaskOption[] }) {
  const [editing, setEditing] = useState(false);
  const duration = formatDuration(item.start, item.end);
  return (
    <li className={cn("flex items-stretch gap-3 rounded-2xl p-3 sm:p-4", item.isBreak ? "bg-gold/25" : "bg-fresh/10")}>
      <div className="w-16 shrink-0 text-center sm:w-20">
        <p className="text-base font-extrabold tabular-nums text-navy">{item.start}</p>
        <p className="text-xs tabular-nums text-navy/60">{item.end}</p>
      </div>
      <div className={cn("w-1 shrink-0 rounded-full", item.isBreak ? "bg-gold" : "bg-fresh")} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 break-words font-semibold text-navy">
          {item.isBreak && <Coffee className="h-4 w-4 shrink-0" aria-label="Istirahat" />}
          <span className="min-w-0 break-words">{item.title}</span>
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/70">
          {duration && <span>{duration}</span>}
          {item.subject && <span className="rounded-full bg-white/80 px-2 py-0.5 text-forest">{item.subject}</span>}
          {item.taskTitle && <span className="text-forest">Tugas: {item.taskTitle}</span>}
        </div>
      </div>
      <div className="flex shrink-0 items-start">
        <button type="button" onClick={() => setEditing(true)} aria-label={`Edit ${item.title}`} className={btnIcon}><Pencil className="h-4 w-4" /></button>
        <ConfirmForm action={deleteSchedule} message="Hapus kegiatan ini?" fields={{ id: item.id }}>
          <button aria-label={`Hapus ${item.title}`} className={btnIcon + " text-red-600"}><Trash2 className="h-4 w-4" /></button>
        </ConfirmForm>
      </div>
      <Modal open={editing} onClose={() => setEditing(false)} title="Edit kegiatan">
        <ScheduleForm initial={item} tasks={tasks} defaultDay={item.dayOfWeek} onDone={() => setEditing(false)} />
      </Modal>
    </li>
  );
}
