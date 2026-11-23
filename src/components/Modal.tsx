"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { btnIcon } from "./styles";

// Dialog bawaan browser: fokus terkunci di dalam, Esc menutup, latar belakang tidak bisa diklik.
// Isi hanya dirender saat terbuka sehingga formulir selalu mulai dari keadaan bersih.
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      // autoFocus milik React berjalan sebelum dialog dibuka, jadi fokus diatur manual ke isian pertama.
      d.querySelector<HTMLElement>("input:not([type=hidden]), select, textarea")?.focus();
    }
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      aria-label={title}
      className="m-auto w-[calc(100vw-1.5rem)] max-w-lg rounded-card border-0 bg-white p-0 text-ink shadow-soft backdrop:bg-navy/50"
    >
      {open && (
        <div className="max-h-[88dvh] overflow-y-auto p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-navy">{title}</h2>
            <button type="button" onClick={onClose} aria-label="Tutup" className={btnIcon}><X className="h-5 w-5" /></button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
