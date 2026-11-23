"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { saveTask } from "@/features/tasks/actions";
import { useFormAction } from "@/lib/use-form-action";
import type { TaskView } from "@/types";
import { FieldError, FormMessage, SubmitButton } from "./ui";
import { btnGhost, btnPrimary, inputCls, labelCls } from "./styles";

export function TaskForm({ initial, onDone }: { initial?: TaskView; onDone?: () => void }) {
  const [state, action] = useFormAction(saveTask);
  const v = state.values;
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => { if (state.ok) done.current?.(); }, [state]);
  const e = state.errors ?? {};
  return (
    <form action={action} className="space-y-4" noValidate>
      {initial && <input type="hidden" name="id" value={initial.id} />}
      <div>
        <label className={labelCls} htmlFor={`t-${initial?.id ?? "new"}`}>Judul tugas</label>
        <input id={`t-${initial?.id ?? "new"}`} name="title" defaultValue={v?.title ?? initial?.title} required className={inputCls} placeholder="Contoh: Membuat rangkuman IPA" />
        <FieldError errors={e.title} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Mata pelajaran</label>
          <input name="subject" defaultValue={v?.subject ?? initial?.subject ?? ""} list={`mapel-${initial?.id ?? "new"}`} className={inputCls} />
          <datalist id={`mapel-${initial?.id ?? "new"}`}>{["Matematika", "IPA", "IPS", "Bahasa Indonesia", "Bahasa Inggris", "PKn", "Seni", "PJOK"].map((m) => <option key={m} value={m} />)}</datalist>
        </div>
        <div>
          <label className={labelCls}>Prioritas</label>
          <select name="priority" defaultValue={v?.priority ?? initial?.priority ?? "MEDIUM"} className={inputCls}>
            <option value="HIGH">Tinggi</option><option value="MEDIUM">Sedang</option><option value="LOW">Rendah</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Tanggal tenggat</label>
          <input type="date" name="dueDate" defaultValue={v?.dueDate ?? initial?.dueInput ?? ""} className={inputCls} />
          <FieldError errors={e.dueDate} />
        </div>
        <div>
          <label className={labelCls}>Estimasi durasi (menit)</label>
          <input type="number" name="estimatedMinutes" min={5} max={600} inputMode="numeric" defaultValue={v?.estimatedMinutes ?? initial?.estimatedMinutes ?? ""} className={inputCls} />
          <FieldError errors={e.estimatedMinutes} />
        </div>
      </div>
      <div>
        <label className={labelCls}>{initial ? "Tambah langkah kecil (satu per baris)" : "Langkah kecil (satu per baris, opsional)"}</label>
        <textarea name="steps" rows={4} defaultValue={v?.steps ?? ""} className={inputCls} placeholder={"Membaca materi\nMenandai informasi penting\nMenulis rangkuman\nMemeriksa hasil pekerjaan"} />
      </div>
      <div>
        <label className={labelCls}>Catatan</label>
        <textarea name="notes" rows={2} defaultValue={v?.notes ?? initial?.notes ?? ""} className={inputCls} />
      </div>
      <FormMessage state={state} />
      <div className="flex flex-wrap gap-3">
        <SubmitButton>{initial ? "Simpan perubahan" : "Simpan tugas"}</SubmitButton>
        {onDone && <button type="button" onClick={onDone} className={btnGhost}>Batal</button>}
      </div>
    </form>
  );
}

export function NewTaskPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      {!open ? (
        <button onClick={() => setOpen(true)} className={btnPrimary}><Plus className="h-5 w-5" aria-hidden /> Tambah Tugas</button>
      ) : (
        <div className="rounded-card bg-white p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-bold text-navy">Tugas baru</h2>
          <TaskForm onDone={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
