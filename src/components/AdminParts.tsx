"use client";

import { useActionState, useState } from "react";
import { useFormAction } from "@/lib/use-form-action";
import { Copy, Check, KeyRound, Trash2, UserPlus } from "lucide-react";
import { createTeacher, deleteUser, resetUserPassword } from "@/features/admin/actions";
import type { ActionState } from "@/lib/action-types";
import { ConfirmForm, FieldError, FormMessage, SubmitButton } from "./ui";
import { Modal } from "./Modal";
import { btnGhost, btnGold, btnIcon, inputCls, labelCls } from "./styles";

function SecretBox({ secret }: { secret: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="rounded-xl border border-gold bg-gold/15 p-3 text-sm">
      <p className="font-semibold text-navy">Password sementara (hanya ditampilkan sekali):</p>
      <div className="mt-2 flex items-center gap-2">
        <code className="min-w-0 flex-1 select-all break-all rounded-lg bg-white px-3 py-2 font-mono text-base">{secret}</code>
        <button
          type="button"
          className={btnGhost + " !min-h-10 !px-3"}
          onClick={async () => {
            try { await navigator.clipboard.writeText(secret); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* abaikan */ }
          }}
        >
          {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />} {copied ? "Tersalin" : "Salin"}
        </button>
      </div>
    </div>
  );
}

export function CreateTeacherPanel() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={btnGold}><UserPlus className="h-5 w-5" aria-hidden /> Tambah Guru BK</button>
      <Modal open={open} onClose={() => setOpen(false)} title="Akun Guru BK baru">
        <CreateTeacherForm onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
}

function CreateTeacherForm({ onClose }: { onClose: () => void }) {
  const [state, action] = useFormAction(createTeacher);
  const e = state.errors ?? {};
  const v = state.values ?? {};
  if (state.ok) {
    return (
      <div className="space-y-4">
        <FormMessage state={state} />
        {state.secret && <SecretBox secret={state.secret} />}
        <button type="button" onClick={onClose} className={btnGhost}>Selesai</button>
      </div>
    );
  }
  return (
    <form action={action} className="space-y-3" noValidate>
      <div><label htmlFor="ct-name" className={labelCls}>Nama</label><input id="ct-name" name="name" required autoFocus defaultValue={v.name} className={inputCls} /><FieldError errors={e.name} /></div>
      <div><label htmlFor="ct-email" className={labelCls}>Email</label><input id="ct-email" name="email" type="email" required defaultValue={v.email} className={inputCls} /><FieldError errors={e.email} /></div>
      <div><label htmlFor="ct-user" className={labelCls}>Username (opsional)</label><input id="ct-user" name="username" defaultValue={v.username} className={inputCls} placeholder="Otomatis dari email" /><FieldError errors={e.username} /></div>
      <div><label htmlFor="ct-pw" className={labelCls}>Password (opsional)</label><input id="ct-pw" name="password" type="text" autoComplete="off" className={inputCls} placeholder="Kosongkan untuk dibuat otomatis" /><FieldError errors={e.password} /></div>
      <FormMessage state={state} />
      <div className="flex flex-wrap gap-3"><SubmitButton pendingText="Membuat...">Buat akun</SubmitButton><button type="button" onClick={onClose} className={btnGhost}>Batal</button></div>
    </form>
  );
}

export function ResetPasswordButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`Reset password ${name}`} title="Reset password" className={btnIcon}><KeyRound className="h-4 w-4" /></button>
      <Modal open={open} onClose={() => setOpen(false)} title="Reset password">
        <ResetForm id={id} name={name} onClose={() => setOpen(false)} />
      </Modal>
    </>
  );
}

function ResetForm({ id, name, onClose }: { id: string; name: string; onClose: () => void }) {
  const [state, action] = useActionState(resetUserPassword, { ok: false } as ActionState);
  if (state.ok) {
    return (
      <div className="space-y-4">
        <FormMessage state={state} />
        {state.secret && <SecretBox secret={state.secret} />}
        <button type="button" onClick={onClose} className={btnGhost}>Tutup</button>
      </div>
    );
  }
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={id} />
      <p className="text-sm">Buat password sementara baru untuk <strong>{name}</strong>? Password lama langsung tidak berlaku.</p>
      <FormMessage state={state} />
      <div className="flex flex-wrap gap-3"><SubmitButton pendingText="Memproses...">Buat password baru</SubmitButton><button type="button" onClick={onClose} className={btnGhost}>Batal</button></div>
    </form>
  );
}

export function DeleteUserButton({ id, name }: { id: string; name: string }) {
  return (
    <ConfirmForm action={deleteUser} message={`Hapus akun "${name}" beserta SEMUA datanya secara permanen? Tindakan ini tidak dapat dibatalkan.`} fields={{ id }}>
      <button aria-label={`Hapus akun ${name}`} title="Hapus akun" className={btnIcon + " text-red-600"}><Trash2 className="h-4 w-4" /></button>
    </ConfirmForm>
  );
}
