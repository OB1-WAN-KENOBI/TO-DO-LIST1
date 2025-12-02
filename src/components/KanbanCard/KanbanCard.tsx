import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DotsSixVertical } from "phosphor-react";
import { Task } from "../../types/task";
import { formatTaskDate, formatTaskTime } from "../../utils/dateUtils";
import { useTaskStore } from "../../store/taskStore";
import { useKanbanCard } from "../../hooks/useKanbanCard";
import { mapToKanbanStatus } from "../../utils/kanbanUtils";
import styles from "./KanbanCard.module.scss";

interface KanbanCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  activeId?: string | null;
  overId?: string | null;
  isOver?: boolean;
  insertBefore?: boolean;
}

export const KanbanCard = memo(
  ({ task, onEdit, activeId, isOver, insertBefore }: KanbanCardProps) => {
    const { t } = useTranslation();
    const { tags } = useTaskStore();
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: task.id,
      data: {
        column: mapToKanbanStatus(task.status),
      },
      animateLayoutChanges: () => true,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const { overdue, showInsertLine, getPriorityClass, cardClassName } =
      useKanbanCard({
        task,
        isOver,
        activeId,
      });

    return (
      <>
        {showInsertLine && insertBefore && (
          <div className={styles.insertLine} />
        )}
        <div
          ref={setNodeRef}
          style={style}
          className={`${styles.kanbanCard} ${cardClassName
            .map((cls) => styles[cls])
            .join(" ")}`.trim()}
          data-dragging={isDragging}
          {...attributes}
          {...listeners}
        >
          <div className={styles.dragHandle}>
            <DotsSixVertical size={16} weight="light" />
          </div>

          <div className={styles.content}>
            <div className={styles.header}>
              <h4
                className={styles.title}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
              >
                {task.title}
              </h4>
              <div className={styles.headerRight}>
                <span
                  className={`${styles.priority} ${
                    styles[getPriorityClass(task.priority)]
                  }`}
                >
                  {t(`common.priority.${task.priority}`)}
                </span>
              </div>
            </div>

            {task.description && (
              <p className={styles.description}>{task.description}</p>
            )}

            {task.deadline && (
              <div
                className={`${styles.deadline} ${
                  overdue ? styles.overdueDate : ""
                }`}
              >
                {formatTaskDate(task.deadline)} {formatTaskTime(task.deadline)}
              </div>
            )}

            {(task.tags.length > 0 || task.labels?.length) && (
              <div className={styles.labels}>
                {task.labels?.map((label, index) => (
                  <span key={index} className={styles.label}>
                    {label}
                  </span>
                ))}
                {task.tags.map((tagId) => {
                  const tag = tags.find((t) => t.id === tagId);
                  return (
                    <span
                      key={tagId}
                      className={styles.label}
                      style={
                        tag
                          ? {
                              backgroundColor: tag.color + "20",
                              color: tag.color,
                            }
                          : undefined
                      }
                    >
                      {tag ? tag.name : tagId}
                    </span>
                  );
                })}
              </div>
            )}

            {task.subtasks.length > 0 && (
              <div className={styles.subtasks}>
                {task.subtasks.filter((st) => st.completed).length} /{" "}
                {task.subtasks.length}
              </div>
            )}
          </div>
        </div>
        {showInsertLine && !insertBefore && (
          <div className={styles.insertLine} />
        )}
      </>
    );
  }
);
