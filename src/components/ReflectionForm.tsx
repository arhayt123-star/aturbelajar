"use client";

import { useActionState } from "react";
import { saveReflection } from "@/features/reflection/actions";
import type { ActionState } from "@/lib/action-types";
import { FormMessage, SubmitButton } from "./ui";
import { cardCls, inputCls } from "./styles";

export function ReflectionForm({ weekStart, questions, answers }: { weekStart: string; questions: string[]; answers: string[] }) {
  const [state, action] = useActionState(saveReflection, { ok: false } as ActionState);
  return (
    <form action={action} className={cardCls + " space-y-5"} key={weekStart}>
      <input type="hidden" name="weekStart" value={weekStart} />
      <p className="text-sm text-ink/75">Refleksi bukan tentang menyalahkan diri sendiri, tetapi memahami apa yang perlu diperbaiki.</p>
      {questions.map((q, i) => (
        <div key={q}>
          <label htmlFor={`q${i + 1}`} className="mb-1.5 block text-sm font-semibold text-navy">{i + 1}. {q}</label>
          <textarea id={`q${i + 1}`} name={`q${i + 1}`} rows={3} maxLength={1500} defaultValue={answers[i] ?? ""} className={inputCls} placeholder="Tulis jawaban di sini..." />
        </div>
      ))}
      <FormMessage state={state} />
      <SubmitButton>Simpan Refleksi</SubmitButton>
    </form>
  );
}
