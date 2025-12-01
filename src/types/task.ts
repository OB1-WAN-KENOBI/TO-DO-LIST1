import { z } from "zod";

export type TaskStatus =
  | "backlog"
  | "planned"
  | "in-progress"
  | "progress"
  | "completed"
  | "done"
  | "cancelled"
  | "archive";
export type KanbanStatus =
  | "backlog"
  | "planned"
  | "progress"
  | "done"
  | "archive";
export type Priority = "low" | "normal" | "high";
export type RepeatType = "daily" | "weekly" | "monthly" | "custom" | "none";

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface RepeatRule {
  type: RepeatType;
  interval?: number;
  daysOfWeek?: number[];
  endDate?: Date | null;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  startDate?: Date | null;
  deadline?: Date | null;
  status: TaskStatus;
  priority: Priority;
  tags: string[];
  labels?: string[];
  subtasks: Subtask[];
  notes?: string;
  repeatRule?: RepeatRule;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
  parentId?: string | null;
}

export const repeatRuleSchema = z.object({
  type: z.enum(["daily", "weekly", "monthly", "custom", "none"]),
  interval: z.number().int().positive().optional(),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
  endDate: z.coerce.date().nullable().optional(),
});

export const subtaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Subtask title is required"),
  completed: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const taskSchema = z
  .object({
    id: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    startDate: z.coerce.date().nullable().optional(),
    deadline: z.coerce.date().nullable().optional(),
    status: z.enum([
      "backlog",
      "planned",
      "in-progress",
      "progress",
      "completed",
      "done",
      "cancelled",
      "archive",
    ]),
    priority: z.enum(["low", "normal", "high"]),
    tags: z.array(z.string()),
    labels: z.array(z.string()).optional(),
    subtasks: z.array(subtaskSchema).optional(),
    order: z.number().optional(),
    notes: z.string().optional(),
    repeatRule: repeatRuleSchema.optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    completedAt: z.coerce.date().nullable().optional(),
    parentId: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.deadline && data.startDate) {
        return data.deadline >= data.startDate;
      }
      return true;
    },
    {
      message: "Deadline must be after start date",
      path: ["deadline"],
    }
  );

export type TaskFormData = z.infer<typeof taskSchema>;
