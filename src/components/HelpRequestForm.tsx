"use client";

import { sendHelpRequest } from "@/features/teacher/actions";
import { useFormAction } from "@/lib/use-form-action";
import { FieldError, FormMessage, SubmitButton } from "./ui";
import { cardCls, inputCls, labelCls } from "./styles";

export function HelpRequestForm() {
  const [state, action] = useFormAction(sendHelpRequest);
  return (
    <form action={action} className={cardCls + " space-y-3"} key={state.ok ? "saved" : "form"}>
      <div><label htmlFor="topic" className={labelCls}>Topik</label><input id="topic" name="topic" defaultValue={state.values?.topic ?? ""} className={inputCls} /><FieldError errors={state.errors?.topic} /></div>
      <div><label htmlFor="message" className={labelCls}>Pesan</label><textarea id="message" name="message" rows={5} defaultValue={state.values?.message ?? ""} className={inputCls} /><FieldError errors={state.errors?.message} /></div>
      <p className="text-xs text-ink/60">Jangan menulis data pribadi siswa pada formulir ini.</p>
      <FormMessage state={state} />
      <SubmitButton>Kirim permintaan</SubmitButton>
    </form>
  );
}
