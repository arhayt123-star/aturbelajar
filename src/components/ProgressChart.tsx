"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ProgressChart({ data, dataKey = "selesai", name = "Tugas selesai", ariaLabel = "Grafik jumlah tugas selesai 7 hari terakhir" }: { data: { label: string; [k: string]: string | number }[]; dataKey?: string; name?: string; ariaLabel?: string }) {
  return (
    <div className="h-56 w-full" role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#183153" strokeOpacity={0.1} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip cursor={{ fill: "#4C956C", fillOpacity: 0.1 }} />
          <Bar dataKey={dataKey} name={name} fill="#4C956C" radius={[6, 6, 0, 0]} isAnimationActive />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
