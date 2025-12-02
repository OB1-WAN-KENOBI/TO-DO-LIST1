import { useMemo } from "react";
import { Task, KanbanStatus } from "../types/task";

interface UseKanbanColumnProps {
  tasks: Task[];
  activeId?: string | null;
  overId?: string | null;
  status: KanbanStatus;
}

export function useKanbanColumn({
  tasks,
  activeId,
  overId,
  status,
}: UseKanbanColumnProps) {
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [tasks]);

  const taskIds = sortedTasks.map((task) => task.id);

  const getTaskProps = (task: Task, index: number) => {
    // Проверяем, что overId не равен статусу колонки (это означает, что перетаскиваем на карточку, а не на колонку)
    // Также проверяем, что overId не null/undefined
    const isOverTask =
      overId !== null &&
      overId !== undefined &&
      overId === task.id &&
      overId !== status;
    const isActive = activeId === task.id;

    // Находим индексы в массиве sortedTasks
    const activeIndex = activeId
      ? sortedTasks.findIndex((t) => t.id === activeId)
      : -1;
    const overIndex = index;

    // Определяем, показывать ли линию перед или после карточки
    // Если перетаскиваем из другой колонки (activeIndex === -1), всегда показываем линию перед
    // Если перетаскиваем внутри колонки вниз (activeIndex < overIndex), показываем линию перед
    // Если перетаскиваем внутри колонки вверх (activeIndex > overIndex), показываем линию после
    const insertBefore =
      isOverTask &&
      !isActive &&
      (activeIndex === -1 || activeIndex < overIndex);

    return {
      isOver: isOverTask,
      insertBefore,
    };
  };

  return {
    sortedTasks,
    taskIds,
    getTaskProps,
  };
}
