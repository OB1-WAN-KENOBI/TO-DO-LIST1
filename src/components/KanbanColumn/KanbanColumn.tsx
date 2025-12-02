import { useTranslation } from "react-i18next";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Task, KanbanStatus } from "../../types/task";
import { KanbanCard } from "../KanbanCard";
import { useKanbanColumn } from "../../hooks/useKanbanColumn";
import styles from "./KanbanColumn.module.scss";

interface KanbanColumnProps {
  status: KanbanStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  isHidden?: boolean;
  activeId?: string | null;
  overId?: string | null;
}

export const KanbanColumn = ({
  status,
  tasks,
  onEditTask,
  isHidden = false,
  activeId,
  overId,
}: KanbanColumnProps) => {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      column: status,
    },
  });

  const { sortedTasks, taskIds, getTaskProps } = useKanbanColumn({
    tasks,
    activeId,
    overId,
    status,
  });

  if (isHidden) {
    return null;
  }

  return (
    <div
      className={`${styles.kanbanColumn} ${isOver ? styles.isOver : ""}`}
      ref={setNodeRef}
    >
      <div className={styles.header}>
        <h3 className={styles.title}>{t(`kanban.columnTitles.${status}`)}</h3>
        <span className={styles.count}>{tasks.length}</span>
      </div>
      <div className={styles.content}>
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {/* Показываем линию в начале пустой колонки */}
          {isOver && sortedTasks.length === 0 && (
            <div className={styles.insertLine} />
          )}
          {/* Показываем линию в начале непустой колонки, если перетаскиваем на саму колонку */}
          {isOver &&
            sortedTasks.length > 0 &&
            overId === status &&
            activeId && <div className={styles.insertLine} />}
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task, index) => {
              const { isOver: isOverTask, insertBefore } = getTaskProps(
                task,
                index
              );

              return (
                <KanbanCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  activeId={activeId}
                  overId={overId}
                  isOver={isOverTask}
                  insertBefore={insertBefore}
                />
              );
            })
          ) : (
            <div className={styles.empty}>{t("kanban.noTasks")}</div>
          )}
        </SortableContext>
      </div>
    </div>
  );
};
