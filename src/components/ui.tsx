"use client";

import { useFormStatus } from "react-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { btnPrimary, inputCls } from "./styles";
import type { ActionState } from "@/lib/action-types";

export function SubmitButton({
  children,
  className = btnPrimary,
  pendingText = "Menyimpan...",
}: {
  children: ReactNode;
  className?: string;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> {pendingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function PasswordInput({
  name = "password",
  id = "password",
  autoComplete = "current-password",
}: {
  name?: string;
  id?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        required
        className={inputCls + " pr-12"}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-ink/60"
      >
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}

export function FormMessage({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={
        "rounded-xl px-4 py-3 text-sm " +
        (state.ok ? "bg-fresh/15 text-forest" : "bg-red-50 text-red-700")
      }
    >
      {state.message}
    </p>
  );
}

export function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-sm text-red-700">{errors[0]}</p>;
}

export function ConfirmForm({
  action,
  message,
  children,
  className,
  fields,
}: {
  action: (fd: FormData) => void | Promise<void>;
  message: string;
  children: ReactNode;
  className?: string;
  fields: Record<string, string>;
}) {
  return (
    <form
      action={action}
      className={className}
      onSubmit={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      {children}
    </form>
  );
}
