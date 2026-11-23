export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Logo AturBelajar">
      <rect width="48" height="48" rx="12" fill="#245B45" />
      <path d="M12 37 L22 12 L32 37" stroke="#F5F3EB" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M16.5 29 l3.2 3.2 6-7" stroke="#4C956C" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="34" cy="33" r="9" fill="#F2C14E" />
      <path d="M34 28v5l3 2" stroke="#183153" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <rect x="29" y="8" width="12" height="9" rx="2" fill="#F5F3EB" />
      <path d="M29 11h12" stroke="#183153" strokeWidth="1.6" />
    </svg>
  );
}

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Logo />
      <span className={"text-lg font-extrabold tracking-tight " + (light ? "text-white" : "text-navy")}>
        Atur<span className={light ? "text-gold" : "text-fresh"}>Belajar</span>
      </span>
    </span>
  );
}
