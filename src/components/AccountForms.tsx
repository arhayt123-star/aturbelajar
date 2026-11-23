"use client";

import { useActionState } from "react";
import { useFormAction } from "@/lib/use-form-action";
import { deleteAccount, updateName } from "@/features/account/actions";
import type { ActionState } from "@/lib/action-types";
import { FieldError, FormMessage, PasswordInput, SubmitButton } from "./ui";
import { cardCls, inputCls, labelCls } from "./styles";

export function NameForm({ name }: { name: string }) {
  const [state, action] = useFormAction(updateName);
  return (
    <form action={action} className={cardCls + " space-y-3"}>
      <h2 className="font-bold text-navy">Profil</h2>
      <div><label htmlFor="name" className={labelCls}>Nama</label><input id="name" name="name" defaultValue={state.values?.name ?? name} className={inputCls} /><FieldError errors={state.errors?.name} /></div>
      <FormMessage state={state} />
      <SubmitButton>Simpan</SubmitButton>
    </form>
  );
}

export function DeleteAccountForm() {
  const [state, action] = useActionState(deleteAccount, { ok: false } as ActionState);
  return (
    <form action={action} className={cardCls + " space-y-3 border border-red-200"} onSubmit={(e) => { if (!window.confirm("Hapus akun dan semua datamu secara permanen? Tindakan ini tidak dapat dibatalkan.")) e.preventDefault(); }}>
      <h2 className="font-bold text-red-700">Hapus akun dan data</h2>
      <p className="text-sm text-ink/75">Seluruh tugas, jadwal, pengingat, sesi fokus, dan refleksimu akan dihapus permanen.</p>
      <div><label htmlFor="del-pw" className={labelCls}>Konfirmasi dengan password</label><PasswordInput id="del-pw" /></div>
      <FormMessage state={state} />
      <SubmitButton className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-5 font-semibold text-white" pendingText="Menghapus...">Hapus akun saya</SubmitButton>
    </form>
  );
}
