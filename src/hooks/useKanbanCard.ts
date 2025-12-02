import { useMemo } from "react";
import { Task, Priority } from "../types/task";
import { isOverdue } from "../utils/dateUtils";

interface UseKanbanCardProps {
  task: Task;
  isOver?: boolean;
  activeId?: string | null;
}

export function useKanbanCard({ task, isOver, activeId }: UseKanbanCardProps) {
  const overdue = useMemo(
    () => (task.deadline ? isOverdue(task.deadline) : false),
    [task.deadline]
  );

  const showInsertLine = useMemo(
    () => isOver && activeId !== task.id,
    [isOver, activeId, task.id]
  );

  const getPriorityClass = (priority: Priority): string => {
    return `priority-${priority}`;
  };

  const cardClassName = useMemo(() => {
    const classes: string[] = [];
    if (overdue) classes.push("overdue");
    if (isOver && activeId !== task.id) classes.push("isOver");
    return classes;
  }, [overdue, isOver, activeId, task.id]);

  return {
    overdue,
    showInsertLine,
    getPriorityClass,
    cardClassName,
  };
}
