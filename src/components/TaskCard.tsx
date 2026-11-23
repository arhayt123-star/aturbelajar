"use client";

import { useState, useTransition } from "react";
import { Clock, Pencil, Trash2 } from "lucide-react";
import { deleteTask, setTaskStatus, toggleStep } from "@/features/tasks/actions";
import type { TaskView } from "@/types";
import { ConfirmForm } from "./ui";
import { TaskForm } from "./TaskForm";
import { btnIcon, inputCls } from "./styles";
import { PRIORITY_LABEL, cn } from "@/lib/utils";

const PRIO_CLS = { HIGH: "bg-red-100 text-red-700", MEDIUM: "bg-gold/30 text-navy", LOW: "bg-sky-100 text-sky-800" };

export function TaskCard({ task }: { task: TaskView }) {
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  const done = task.status === "DONE";

  if (editing) {
    return (
      <li className="rounded-card bg-white p-5 shadow-soft">
        <TaskForm initial={task} onDone={() => setEditing(false)} />
      </li>
    );
  }
  return (
    <li className={cn("rounded-card bg-white p-4 shadow-soft transition", pending && "opacity-60")}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={done}
          aria-label={`Tandai selesai: ${task.title}`}
          onChange={(e) => start(() => setTaskStatus(task.id, e.target.checked ? "DONE" : "NOT_STARTED"))}
          className="mt-1 h-6 w-6 shrink-0 accent-forest"
        />
        <div className="min-w-0 flex-1">
          <p className={cn("break-words font-semibold text-navy", done && "text-ink/50 line-through")}>{task.title}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
            <span className={cn("rounded-full px-2.5 py-0.5 font-medium", PRIO_CLS[task.priority])}>{PRIORITY_LABEL[task.priority]}</span>
            {task.subject && <span className="rounded-full bg-fresh/15 px-2.5 py-0.5 text-forest">{task.subject}</span>}
            {task.dueLabel && <span className={task.overdue ? "text-red-700" : "text-ink/70"}>Tenggat {task.dueLabel}{task.overdue ? " (lewat)" : ""}</span>}
            {task.estimatedMinutes && <span className="inline-flex items-center gap-1 text-ink/70"><Clock className="h-3.5 w-3.5" aria-hidden />{task.estimatedMinutes} mnt</span>}
          </div>
          {task.notes && <p className="mt-2 text-sm text-ink/70">{task.notes}</p>}
          {task.steps.length > 0 && (
            <ul className="mt-3 space-y-1">
              {task.steps.map((s) => (
                <li key={s.id}>
                  <label className="flex min-h-9 items-center gap-2.5 text-sm">
                    <input type="checkbox" checked={s.isDone} onChange={(e) => start(() => toggleStep(s.id, e.target.checked))} className="h-5 w-5 accent-fresh" />
                    <span className={s.isDone ? "text-ink/50 line-through" : ""}>{s.title}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3">
            <label className="sr-only" htmlFor={`st-${task.id}`}>Status</label>
            <select id={`st-${task.id}`} value={task.status} onChange={(e) => start(() => setTaskStatus(task.id, e.target.value))} className={inputCls + " !w-auto !py-1.5 text-sm"}>
              <option value="NOT_STARTED">Belum mulai</option>
              <option value="IN_PROGRESS">Sedang dikerjakan</option>
              <option value="DONE">Selesai</option>
            </select>
          </div>
        </div>
        <div className="flex shrink-0">
          <button onClick={() => setEditing(true)} aria-label={`Edit ${task.title}`} className={btnIcon}><Pencil className="h-5 w-5" /></button>
          <ConfirmForm action={deleteTask} message="Hapus tugas ini beserta langkah-langkahnya?" fields={{ id: task.id }}>
            <button aria-label={`Hapus ${task.title}`} className={btnIcon + " text-red-600"}><Trash2 className="h-5 w-5" /></button>
          </ConfirmForm>
        </div>
      </div>
    </li>
  );
}
