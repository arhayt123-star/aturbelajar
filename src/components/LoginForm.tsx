"use client";


import { loginAction } from "@/features/auth/actions";
import { useFormAction } from "@/lib/use-form-action";
import { FormMessage, PasswordInput, SubmitButton } from "./ui";
import { inputCls, labelCls } from "./styles";
import type { RoleName } from "@/types";

export function LoginForm({ role }: { role: RoleName }) {
  const [state, action] = useFormAction(loginAction.bind(null, role));
  return (
    <form action={action} className="space-y-4" noValidate>
      <div>
        <label htmlFor="identifier" className={labelCls}>Username atau email</label>
        <input id="identifier" name="identifier" autoComplete="username" required defaultValue={state.values?.identifier ?? ""} className={inputCls} />
      </div>
      <div>
        <label htmlFor="password" className={labelCls}>Password</label>
        <PasswordInput />
      </div>
      <FormMessage state={state} />
      <SubmitButton className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-forest font-semibold text-white" pendingText="Memeriksa...">
        Masuk
      </SubmitButton>
    </form>
  );
}
