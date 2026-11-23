import { prisma } from "./prisma";

export async function getTaskStats(userId: string) {
  const g = await prisma.task.groupBy({ by: ["status"], where: { userId }, _count: { _all: true } });
  const get = (s: string) => g.find((x) => x.status === s)?._count._all ?? 0;
  const done = get("DONE");
  const inProgress = get("IN_PROGRESS");
  const notStarted = get("NOT_STARTED");
  const total = done + inProgress + notStarted;
  return { total, done, inProgress, notStarted, pct: total ? Math.round((done / total) * 100) : 0 };
}
