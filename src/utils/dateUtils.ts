import {
  startOfDay,
  endOfDay,
  isToday,
  isTomorrow,
  isThisWeek,
  isThisMonth,
  isPast,
  addDays,
  addWeeks,
  addMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  parseISO,
} from "date-fns";
import { Task, RepeatRule, RepeatType } from "../types/task";

export const isOverdue = (deadline: Date | null | undefined): boolean => {
  if (!deadline) return false;
  return isPast(endOfDay(deadline)) && !isToday(deadline);
};

export const getTaskDateGroup = (
  task: Task
): "today" | "tomorrow" | "week" | "later" | "overdue" => {
  if (!task.deadline) return "later";

  if (isOverdue(task.deadline)) return "overdue";
  if (isToday(task.deadline)) return "today";
  if (isTomorrow(task.deadline)) return "tomorrow";
  if (isThisWeek(task.deadline)) return "week";

  return "later";
};

export const generateRepeatInstances = (
  task: Task,
  startDate: Date,
  endDate: Date
): Task[] => {
  if (!task.repeatRule || task.repeatRule.type === "none") {
    return [];
  }

  const instances: Task[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    if (task.repeatRule.endDate && currentDate > task.repeatRule.endDate) {
      break;
    }

    const shouldCreate = (): boolean => {
      switch (task.repeatRule?.type) {
        case "daily":
          return true;
        case "weekly":
          if (
            task.repeatRule.daysOfWeek &&
            task.repeatRule.daysOfWeek.length > 0
          ) {
            return task.repeatRule.daysOfWeek.includes(currentDate.getDay());
          }
          return true;
        case "monthly":
          return true;
        case "custom":
          if (task.repeatRule.interval) {
            const daysDiff = Math.floor(
              (currentDate.getTime() - startDate.getTime()) /
                (1000 * 60 * 60 * 24)
            );
            return daysDiff % task.repeatRule.interval === 0;
          }
          return true;
        default:
          return false;
      }
    };

    if (shouldCreate()) {
      const instance: Task = {
        ...task,
        id: `${task.id}-${format(currentDate, "yyyy-MM-dd")}`,
        startDate: task.startDate ? new Date(currentDate) : null,
        deadline: task.deadline
          ? new Date(
              currentDate.getTime() +
                (task.deadline.getTime() -
                  (task.startDate?.getTime() || task.deadline.getTime()))
            )
          : null,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "planned",
      };
      instances.push(instance);
    }

    currentDate = addDays(currentDate, 1);
  }

  return instances;
};

export const getNextRepeatDate = (task: Task): Date | null => {
  if (!task.repeatRule || task.repeatRule.type === "none" || !task.deadline) {
    return null;
  }

  const baseDate = task.deadline;
  let nextDate: Date;

  switch (task.repeatRule.type) {
    case "daily":
      nextDate = addDays(baseDate, 1);
      break;
    case "weekly":
      nextDate = addWeeks(baseDate, task.repeatRule.interval || 1);
      break;
    case "monthly":
      nextDate = addMonths(baseDate, task.repeatRule.interval || 1);
      break;
    case "custom":
      nextDate = addDays(baseDate, task.repeatRule.interval || 1);
      break;
    default:
      return null;
  }

  return nextDate;
};

export const formatTaskDate = (date: Date | null | undefined): string => {
  if (!date) return "";
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "MMM d, yyyy");
};

export const formatTaskTime = (date: Date | null | undefined): string => {
  if (!date) return "";
  return format(date, "HH:mm");
};
