"use client";

import { useActionState } from "react";
import type { ActionState } from "./action-types";

// React 19 mengosongkan semua isian formulir setelah action selesai, termasuk saat validasi gagal
// (pengguna harus mengetik ulang semuanya). Hook ini menyimpan isian yang dikirim ke state
// supaya formulir bisa memakainya sebagai defaultValue. Isian sensitif tidak pernah disimpan.
const SENSITIVE = new Set(["password", "current", "next", "confirm"]);

export function useFormAction(action: (prev: ActionState, fd: FormData) => Promise<ActionState>) {
  return useActionState(async (prev: ActionState, fd: FormData): Promise<ActionState> => {
    const res = await action(prev, fd);
    if (res.ok) return res;
    const values: Record<string, string> = {};
    fd.forEach((v, k) => { if (typeof v === "string" && !SENSITIVE.has(k)) values[k] = v; });
    return { ...res, values };
  }, { ok: false } as ActionState);
}
