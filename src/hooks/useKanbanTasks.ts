import { useMemo } from "react";
import { Task, KanbanStatus } from "../types/task";
import { useFilterStore } from "../store/filterStore";
import { mapToKanbanStatus } from "../utils/kanbanUtils";

export function useKanbanTasks(tasks: Task[]) {
  const { searchQuery, statusFilter, tagFilter, priorityFilter, hideArchived } =
    useFilterStore();

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query) ||
          task.notes?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => statusFilter.includes(task.status));
    }

    if (tagFilter !== "all") {
      filtered = filtered.filter((task) =>
        task.tags.some((tagId) => tagFilter.includes(tagId))
      );
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) =>
        priorityFilter.includes(task.priority)
      );
    }

    if (hideArchived) {
      filtered = filtered.filter((task) => task.status !== "cancelled");
    }

    return filtered;
  }, [
    tasks,
    searchQuery,
    statusFilter,
    tagFilter,
    priorityFilter,
    hideArchived,
  ]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<KanbanStatus, Task[]> = {
      backlog: [],
      planned: [],
      "in-progress": [],
      completed: [],
      cancelled: [],
    };

    filteredTasks.forEach((task) => {
      const kanbanStatus = mapToKanbanStatus(task.status);
      if (grouped[kanbanStatus]) {
        grouped[kanbanStatus].push(task);
      }
    });

    return grouped;
  }, [filteredTasks]);

  return {
    filteredTasks,
    tasksByStatus,
  };
}
