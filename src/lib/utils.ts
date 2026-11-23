export const TZ = "Asia/Jakarta";
export const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export const toTime = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export const isoJakarta = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: TZ });

export function todayInfo() {
  const iso = isoJakarta(new Date());
  const date = new Date(iso + "T00:00:00Z");
  const dow = ((date.getUTCDay() + 6) % 7) + 1; // 1 = Senin
  return { iso, date, dow };
}

export function weekStartOf(iso: string) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d;
}

export const fmtDate = (d: Date | string) =>
  new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", timeZone: TZ });

export const PRIORITY_LABEL = { HIGH: "Tinggi", MEDIUM: "Sedang", LOW: "Rendah" } as const;
export const STATUS_LABEL = {
  NOT_STARTED: "Belum mulai",
  IN_PROGRESS: "Dikerjakan",
  DONE: "Selesai",
} as const;
