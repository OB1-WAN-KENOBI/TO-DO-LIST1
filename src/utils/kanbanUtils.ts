import { Task, KanbanStatus, TaskStatus } from "../types/task";

export const KANBAN_COLUMNS: Array<{
  status: KanbanStatus;
  title: string;
  hidden?: boolean;
}> = [
  { status: "backlog", title: "Backlog" },
  { status: "planned", title: "Planned" },
  { status: "in-progress", title: "In Progress" },
  { status: "completed", title: "Done" },
  { status: "cancelled", title: "Archived", hidden: true },
];

export function mapToKanbanStatus(status: Task["status"]): KanbanStatus {
  // TaskStatus and KanbanStatus are now unified
  return status;
}

export function kanbanToTaskStatus(kanban: KanbanStatus): TaskStatus {
  // TaskStatus and KanbanStatus are now unified
  return kanban;
}

export function getVisibleColumns(hideArchived: boolean) {
  return KANBAN_COLUMNS.filter((col) => !col.hidden || !hideArchived);
}
