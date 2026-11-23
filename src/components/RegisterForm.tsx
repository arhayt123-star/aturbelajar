"use client";

import Link from "next/link";
import { registerStudent } from "@/features/auth/actions";
import { useFormAction } from "@/lib/use-form-action";
import { FieldError, FormMessage, PasswordInput, SubmitButton } from "./ui";
import { inputCls, labelCls } from "./styles";

export function RegisterForm() {
  const [state, action] = useFormAction(registerStudent);
  const e = state.errors ?? {};
  const v = state.values ?? {};
  if (state.ok) {
    return (
      <div className="space-y-4 text-center">
        <FormMessage state={state} />
        <Link href="/masuk" className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-forest font-semibold text-white">Ke halaman masuk</Link>
      </div>
    );
  }
  return (
    <form action={action} className="space-y-4" noValidate>
      <div><label htmlFor="name" className={labelCls}>Nama</label><input id="name" name="name" required defaultValue={v.name} className={inputCls} /><FieldError errors={e.name} /></div>
      <div><label htmlFor="username" className={labelCls}>Username</label><input id="username" name="username" autoComplete="username" required defaultValue={v.username} className={inputCls} /><FieldError errors={e.username} /></div>
      <div><label htmlFor="email" className={labelCls}>Email</label><input id="email" name="email" type="email" autoComplete="email" required defaultValue={v.email} className={inputCls} /><FieldError errors={e.email} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="schoolLevel" className={labelCls}>Jenjang</label>
          <select id="schoolLevel" name="schoolLevel" className={inputCls} defaultValue={v.schoolLevel ?? "SMP"}><option value="SMP">SMP</option><option value="SMA">SMA</option></select>
        </div>
        <div>
          <label htmlFor="grade" className={labelCls}>Kelas (opsional)</label>
          <input id="grade" name="grade" type="number" min={7} max={12} inputMode="numeric" defaultValue={v.grade} className={inputCls} />
          <FieldError errors={e.grade} />
        </div>
      </div>
      <div><label htmlFor="password" className={labelCls}>Password</label><PasswordInput autoComplete="new-password" /><FieldError errors={e.password} /></div>
      <div>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="consent" defaultChecked={v.consent === "on"} className="mt-1 h-5 w-5 accent-forest" />
          <span>Saya menyetujui penggunaan data saya untuk fitur AturBelajar sesuai <Link href="/etika" className="text-forest underline">kebijakan etika dan privasi</Link>.</span>
        </label>
        <FieldError errors={e.consent} />
      </div>
      <FormMessage state={state} />
      <SubmitButton className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-forest font-semibold text-white" pendingText="Membuat akun...">Daftar</SubmitButton>
    </form>
  );
}
