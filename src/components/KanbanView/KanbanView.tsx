import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Task, KanbanStatus } from "../../types/task";
import { useTaskStore } from "../../store/taskStore";
import { useFilterStore } from "../../store/filterStore";
import { KanbanColumn } from "../KanbanColumn";
import { KanbanCard } from "../KanbanCard";
import styles from "./KanbanView.module.scss";

interface KanbanViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

const KANBAN_COLUMNS: Array<{
  status: KanbanStatus;
  title: string;
  hidden?: boolean;
}> = [
  { status: "backlog", title: "Backlog" },
  { status: "planned", title: "Planned" },
  { status: "progress", title: "In Progress" },
  { status: "done", title: "Done" },
  { status: "archive", title: "Archived", hidden: true },
];

// Маппинг для отображения колонок с учетом фильтра hideArchived
const getVisibleColumns = (hideArchived: boolean) => {
  return KANBAN_COLUMNS.filter((col) => !col.hidden || !hideArchived);
};

export const KanbanView = ({ tasks, onEditTask }: KanbanViewProps) => {
  const { setStatus, reorderTasks } = useTaskStore();
  const {
    searchQuery,
    statusFilter,
    tagFilter,
    priorityFilter,
    dateFilter,
    hideArchived,
  } = useFilterStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

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
      filtered = filtered.filter((task) => task.status !== "archive");
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
      progress: [],
      done: [],
      archive: [],
    };

    filteredTasks.forEach((task) => {
      const kanbanStatus = mapToKanbanStatus(task.status);
      if (grouped[kanbanStatus]) {
        grouped[kanbanStatus].push(task);
      }
    });

    return grouped;
  }, [filteredTasks]);

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((t) => t.id === activeId);
    if (!activeTask) {
      setActiveId(null);
      return;
    }

    const activeStatus = mapToKanbanStatus(activeTask.status);

    // Проверяем, является ли overId статусом колонки
    const isColumn = KANBAN_COLUMNS.some((col) => col.status === overId);

    if (isColumn) {
      // Перетаскивание на колонку
      const overStatus = overId as KanbanStatus;
      if (activeStatus !== overStatus) {
        // Перемещение в другую колонку
        setStatus(activeId, overStatus);
      } else {
        // Перетаскивание внутри той же колонки (на пустое место)
        // Ничего не делаем, порядок уже правильный
      }
    } else {
      // Перетаскивание на другую карточку
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) {
        const overTaskStatus = mapToKanbanStatus(overTask.status);

        if (activeStatus !== overTaskStatus) {
          // Перемещение в другую колонку
          setStatus(activeId, overTaskStatus);
        } else {
          // Перемещение внутри колонки
          const columnTasks = tasksByStatus[activeStatus];
          const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
          const newIndex = columnTasks.findIndex((t) => t.id === overId);

          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            const reordered = arrayMove(columnTasks, oldIndex, newIndex);
            const taskIds = reordered.map((t) => t.id);
            reorderTasks(activeStatus, taskIds);
          }
        }
      }
    }

    setActiveId(null);
  };

  return (
    <div className={styles.kanbanView}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.columns}>
          {getVisibleColumns(hideArchived).map((column) => (
            <KanbanColumn
              key={column.status}
              status={column.status}
              title={column.title}
              tasks={tasksByStatus[column.status]}
              onEditTask={onEditTask}
              isHidden={false}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <div style={{ opacity: 0.8 }}>
              <KanbanCard task={activeTask} onEdit={onEditTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

function mapToKanbanStatus(status: Task["status"]): KanbanStatus {
  switch (status) {
    case "backlog":
      return "backlog";
    case "planned":
      return "planned";
    case "in-progress":
    case "progress":
      return "progress";
    case "completed":
    case "done":
      return "done";
    case "cancelled":
    case "archive":
      return "archive";
    default:
      // Маппинг старых статусов для обратной совместимости
      if (status === "planned") return "planned";
      if (status === "in-progress") return "progress";
      if (status === "completed") return "done";
      if (status === "cancelled") return "archive";
      return "backlog";
  }
}
