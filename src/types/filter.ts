import { TaskStatus, Priority } from "./task";

export type ViewMode =
  | "list"
  | "kanban"
  | "calendar-day"
  | "calendar-week"
  | "calendar-month"
  | "timeline";

export type SortBy = "created" | "deadline" | "priority" | "status" | "title";

export interface FilterState {
  viewMode: ViewMode;
  dateFilter: "all" | "today" | "tomorrow" | "week" | "month" | "overdue";
  statusFilter: TaskStatus[] | "all";
  tagFilter: string[] | "all";
  priorityFilter: Priority[] | "all";
  sortBy: SortBy;
  sortOrder: "asc" | "desc";
  searchQuery: string;
  hideArchived: boolean;
}
