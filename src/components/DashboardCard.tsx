import type { ReactNode } from "react";
import { cardCls } from "./styles";

export function DashboardCard({ title, action, children, className = "" }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cardCls + " " + className}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-bold text-navy">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function StatTile({ value, label, tone = "green" }: { value: number | string; label: string; tone?: "green" | "gold" | "blue" | "orange" }) {
  const tones = { green: "bg-fresh/15 text-forest", gold: "bg-gold/25 text-navy", blue: "bg-sky-100 text-sky-900", orange: "bg-orange-100 text-orange-800" };
  return (
    <div className={"rounded-2xl p-4 " + tones[tone]}>
      <p className="text-3xl font-extrabold">{value}</p>
      <p className="text-xs font-medium">{label}</p>
    </div>
  );
}
