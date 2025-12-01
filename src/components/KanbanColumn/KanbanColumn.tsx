import { useMemo } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Task, TaskStatus } from "../../types/task";
import { KanbanCard } from "../KanbanCard";
import styles from "./KanbanColumn.module.scss";

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  isHidden?: boolean;
}

export const KanbanColumn = ({
  status,
  title,
  tasks,
  onEditTask,
  isHidden = false,
}: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [tasks]);

  const taskIds = sortedTasks.map((task) => task.id);

  if (isHidden) {
    return null;
  }

  return (
    <div
      className={`${styles.kanbanColumn} ${isOver ? styles.isOver : ""}`}
      ref={setNodeRef}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.count}>{tasks.length}</span>
      </div>
      <div className={styles.content}>
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <KanbanCard key={task.id} task={task} onEdit={onEditTask} />
            ))
          ) : (
            <div className={styles.empty}>No tasks</div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};
