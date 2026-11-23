"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Pause, Play, SkipForward } from "lucide-react";
import { finishFocus, startFocus } from "@/features/focus/actions";
import type { TaskOption } from "@/types";
import { btnGhost, btnPrimary, cardCls, inputCls, labelCls } from "./styles";

type Phase = "idle" | "running" | "paused" | "done";

export function FocusTimer({ tasks, todayMinutes }: { tasks: TaskOption[]; todayMinutes: number }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [taskId, setTaskId] = useState("");
  const [minutes, setMinutes] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [error, setError] = useState("");
  const sessionId = useRef<string | null>(null);
  const endAt = useRef(0);
  const total = minutes * 60;

  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) { clearInterval(id); void end("COMPLETED", total); setPhase("done"); }
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  async function end(status: "COMPLETED" | "SKIPPED", seconds: number) {
    if (sessionId.current) await finishFocus(sessionId.current, seconds, status);
    sessionId.current = null;
  }

  async function start() {
    setError("");
    if (!sessionId.current) {
      const r = await startFocus(taskId || null, minutes);
      if (r.error || !r.id) return setError(r.error ?? "Gagal memulai sesi");
      sessionId.current = r.id;
    }
    endAt.current = Date.now() + remaining * 1000;
    setPhase("running");
  }

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const R = 88, C = 2 * Math.PI * R;
  const progress = total ? 1 - remaining / total : 0;

  return (
    <div className={cardCls + " mx-auto max-w-md space-y-5 text-center"}>
      {phase === "idle" && (
        <div className="space-y-3 text-left">
          <div><label className={labelCls}>Mengerjakan tugas</label>
            <select value={taskId} onChange={(e) => setTaskId(e.target.value)} className={inputCls}><option value="">Tanpa memilih tugas</option>{tasks.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}</select></div>
          <div><label className={labelCls}>Durasi (menit)</label>
            <select value={minutes} onChange={(e) => { const m = Number(e.target.value); setMinutes(m); setRemaining(m * 60); }} className={inputCls}>{[10, 15, 25, 30, 45, 60].map((m) => <option key={m} value={m}>{m} menit</option>)}</select></div>
        </div>
      )}
      <div className="relative mx-auto h-56 w-56" role="timer" aria-live="off">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <circle cx="100" cy="100" r={R} fill="none" stroke="#4C956C" strokeOpacity=".18" strokeWidth="14" />
          <circle cx="100" cy="100" r={R} fill="none" stroke="#245B45" strokeWidth="14" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - progress)} style={{ transition: "stroke-dashoffset .3s linear" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-5xl font-extrabold tabular-nums text-navy">{mm}:{ss}</p>
          {phase === "done" && <p className="mt-1 text-sm font-semibold text-forest">Sesi selesai</p>}
        </div>
      </div>

      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <div className="flex flex-wrap justify-center gap-3">
        {(phase === "idle" || phase === "paused") && <button onClick={start} className={btnPrimary}><Play className="h-5 w-5" aria-hidden /> {phase === "paused" ? "Lanjutkan" : "Mulai"}</button>}
        {phase === "running" && <button onClick={() => { setRemaining(Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000))); setPhase("paused"); }} className={btnGhost}><Pause className="h-5 w-5" aria-hidden /> Jeda</button>}
        {(phase === "running" || phase === "paused") && (
          <>
            <button onClick={async () => { await end("COMPLETED", total - remaining); setPhase("done"); }} className={btnGhost}><Check className="h-5 w-5" aria-hidden /> Selesai</button>
            <button onClick={async () => { await end("SKIPPED", total - remaining); setPhase("idle"); setRemaining(total); }} className={btnGhost}><SkipForward className="h-5 w-5" aria-hidden /> Lewati</button>
          </>
        )}
        {phase === "done" && <button onClick={() => { setPhase("idle"); setRemaining(total); }} className={btnPrimary}>Sesi baru</button>}
      </div>
      <p className="rounded-xl bg-fresh/10 p-3 text-sm text-forest">Mulai dari satu langkah kecil. Tidak harus langsung selesai semuanya.</p>
      <p className="text-xs text-ink/60">Fokus yang tercatat hari ini: {todayMinutes} menit</p>
    </div>
  );
}
