// Pembatas percobaan sederhana di memori proses.
// Cukup untuk satu instance server; untuk banyak instance gunakan penyimpanan bersama (mis. Redis).
type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function hitLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 5000) for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false };
  }
  b.count++;
  return { limited: b.count > max };
}

export function clearLimit(key: string) {
  buckets.delete(key);
}
