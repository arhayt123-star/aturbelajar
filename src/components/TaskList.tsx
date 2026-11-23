import type { TaskView } from "@/types";
import { TaskCard } from "./TaskCard";

export function TaskList({ tasks, empty }: { tasks: TaskView[]; empty: string }) {
  if (!tasks.length) return <p className="rounded-card bg-white p-6 text-center text-ink/70 shadow-soft">{empty}</p>;
  return <ul className="space-y-3">{tasks.map((t) => <TaskCard key={t.id} task={t} />)}</ul>;
}
