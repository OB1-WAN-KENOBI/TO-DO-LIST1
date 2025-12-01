import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DotsSixVertical } from "phosphor-react";
import { Task, Priority } from "../../types/task";
import {
  formatTaskDate,
  formatTaskTime,
  isOverdue,
} from "../../utils/dateUtils";
import { useTaskStore } from "../../store/taskStore";
import styles from "./KanbanCard.module.scss";

interface KanbanCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const KanbanCard = ({ task, onEdit }: KanbanCardProps) => {
  const { tags } = useTaskStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityClass = (priority: Priority): string => {
    return styles[`priority-${priority}`];
  };

  const overdue = task.deadline ? isOverdue(task.deadline) : false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.kanbanCard} ${overdue ? styles.overdue : ""}`}
      onClick={() => onEdit(task)}
    >
      <div className={styles.dragHandle} {...attributes} {...listeners}>
        <DotsSixVertical size={16} weight="light" />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h4 className={styles.title}>{task.title}</h4>
          <span
            className={`${styles.priority} ${getPriorityClass(task.priority)}`}
          >
            {task.priority}
          </span>
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
  );
};
