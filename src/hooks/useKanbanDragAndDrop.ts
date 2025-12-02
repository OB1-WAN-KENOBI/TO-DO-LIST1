import { useState } from "react";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Task, KanbanStatus } from "../types/task";
import { useTaskStore } from "../store/taskStore";
import {
  KANBAN_COLUMNS,
  mapToKanbanStatus,
  kanbanToTaskStatus,
} from "../utils/kanbanUtils";

interface UseKanbanDragAndDropProps {
  tasks: Task[];
}

export function useKanbanDragAndDrop({ tasks }: UseKanbanDragAndDropProps) {
  const { reorderTasks, setStatus } = useTaskStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over, active } = event;
    if (over && over.id !== active.id) {
      setOverId(over.id as string);
    } else if (!over) {
      setOverId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setOverId(null);
      return;
    }

    const activeIdValue = active.id as string;
    const overIdValue = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeIdValue);
    if (!activeTask) {
      setActiveId(null);
      setOverId(null);
      return;
    }

    // Определяем колонки через data.current согласно ТЗ
    const sourceStatus =
      (active.data.current?.column as KanbanStatus) ||
      mapToKanbanStatus(activeTask.status);

    // Проверяем, является ли overId статусом колонки
    const isColumn = KANBAN_COLUMNS.some((col) => col.status === overIdValue);

    let targetStatus: KanbanStatus;
    if (isColumn) {
      targetStatus = overIdValue as KanbanStatus;
    } else {
      const overTask = tasks.find((t) => t.id === overIdValue);
      if (!overTask) {
        setActiveId(null);
        setOverId(null);
        return;
      }
      targetStatus =
        (over.data.current?.column as KanbanStatus) ||
        mapToKanbanStatus(overTask.status);
    }

    // Получаем задачи колонок, отсортированные по order
    const sourceTasks = tasks
      .filter((t) => {
        const taskStatus = mapToKanbanStatus(t.status);
        return taskStatus === sourceStatus;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const targetTasks = tasks
      .filter((t) => {
        const taskStatus = mapToKanbanStatus(t.status);
        return taskStatus === targetStatus && t.id !== activeIdValue;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    // Находим индексы согласно ТЗ
    const activeIndex = sourceTasks.findIndex((t) => t.id === activeIdValue);
    const overIndex = isColumn
      ? -1 // Если перетаскиваем на колонку, индекс = -1 (вставляем в начало или конец)
      : targetTasks.findIndex((t) => t.id === overIdValue);

    if (activeIndex === -1) {
      setActiveId(null);
      setOverId(null);
      return;
    }

    if (sourceStatus === targetStatus) {
      // Внутри одной колонки - используем arrayMove для правильного перемещения
      // Используем sourceTasks, так как он содержит все задачи колонки, включая активную
      const sourceIds = sourceTasks.map((t) => t.id);

      // Находим overIndex в sourceTasks (так как это та же колонка)
      const overIndexInSource = sourceTasks.findIndex(
        (t) => t.id === overIdValue
      );

      if (overIndexInSource === -1) {
        setActiveId(null);
        setOverId(null);
        return;
      }

      // arrayMove правильно обрабатывает индексы при перемещении вверх/вниз
      const newIds = arrayMove(sourceIds, activeIndex, overIndexInSource);

      // Находим реальные статусы для обновления
      const realTargetStatus =
        sourceTasks.length > 0
          ? sourceTasks[0].status
          : kanbanToTaskStatus(targetStatus);

      reorderTasks(realTargetStatus, newIds);
    } else {
      // Между колонками
      // Получаем массив ID задач целевой колонки
      const targetIds = targetTasks.map((t) => t.id);

      // Вычисляем новый индекс
      let newIndex: number;
      if (overIndex === -1 || isColumn) {
        // Перетаскиваем на пустую колонку или на саму колонку
        newIndex = 0;
      } else {
        newIndex = overIndex;
      }

      // Вставляем в целевую колонку
      targetIds.splice(newIndex, 0, activeIdValue);

      // Находим реальные статусы для обновления
      const realTargetStatus =
        targetTasks.length > 0
          ? targetTasks[0].status
          : kanbanToTaskStatus(targetStatus);

      const realSourceStatus =
        sourceTasks.length > 0
          ? sourceTasks[0].status
          : kanbanToTaskStatus(sourceStatus);

      // Обновляем статус если нужно
      setStatus(activeIdValue, realTargetStatus);

      // Пересчитываем order = index для всех задач в целевой колонке через reorderTasks
      reorderTasks(realTargetStatus, targetIds);

      // Пересчитываем order в исходной колонке
      const remainingSourceTasks = sourceTasks
        .filter((t) => t.id !== activeIdValue)
        .map((t) => t.id);

      if (remainingSourceTasks.length > 0) {
        reorderTasks(realSourceStatus, remainingSourceTasks);
      }

      setActiveId(null);
      setOverId(null);
      return;
    }

    setActiveId(null);
    setOverId(null);
  };

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  return {
    activeId,
    overId,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
