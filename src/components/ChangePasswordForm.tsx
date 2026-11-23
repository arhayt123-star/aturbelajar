"use client";

import { useActionState } from "react";
import { changePassword } from "@/features/account/actions";
import type { ActionState } from "@/lib/action-types";
import { FieldError, FormMessage, PasswordInput, SubmitButton } from "./ui";
import { cardCls, labelCls } from "./styles";

export function ChangePasswordForm({ minLength = 8 }: { minLength?: number }) {
  const [state, action] = useActionState(changePassword, { ok: false } as ActionState);
  const e = state.errors ?? {};
  // key: kosongkan isian setelah berhasil.
  return (
    <form action={action} className={cardCls + " space-y-3"} key={state.ok ? "ok" : "form"}>
      <h2 className="font-bold text-navy">Ganti password</h2>
      <div><label htmlFor="pw-current" className={labelCls}>Password saat ini</label><PasswordInput id="pw-current" name="current" /><FieldError errors={e.current} /></div>
      <div><label htmlFor="pw-next" className={labelCls}>Password baru (minimal {minLength} karakter)</label><PasswordInput id="pw-next" name="next" autoComplete="new-password" /><FieldError errors={e.next} /></div>
      <div><label htmlFor="pw-confirm" className={labelCls}>Ulangi password baru</label><PasswordInput id="pw-confirm" name="confirm" autoComplete="new-password" /><FieldError errors={e.confirm} /></div>
      <FormMessage state={state} />
      <SubmitButton>Ganti password</SubmitButton>
    </form>
  );
}
