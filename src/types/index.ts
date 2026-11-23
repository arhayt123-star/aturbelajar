export type TaskView = {
  id: string;
  title: string;
  subject: string | null;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "NOT_STARTED" | "IN_PROGRESS" | "DONE";
  dueInput: string | null; // YYYY-MM-DD
  dueLabel: string | null;
  overdue: boolean;
  estimatedMinutes: number | null;
  notes: string | null;
  steps: { id: string; title: string; isDone: boolean }[];
};

export type ScheduleView = {
  id: string;
  title: string;
  subject: string | null;
  dayOfWeek: number;
  start: string; // HH:MM
  end: string;
  isBreak: boolean;
  taskId: string | null;
  taskTitle: string | null;
};

export type TaskOption = { id: string; title: string };

export type RoleName = "STUDENT" | "TEACHER" | "ADMIN";
