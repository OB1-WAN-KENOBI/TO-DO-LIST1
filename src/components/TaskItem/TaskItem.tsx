import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Trash, CheckCircle, Circle } from "phosphor-react";
import { Task, Priority } from "../../types/task";
import {
  formatTaskDate,
  formatTaskTime,
  isOverdue,
} from "../../utils/dateUtils";
import { useTaskStore } from "../../store/taskStore";
import styles from "./TaskItem.module.scss";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskItem = memo(({ task, onEdit }: TaskItemProps) => {
  const { t } = useTranslation();
  const { toggleStatus, deleteTask, tags } = useTaskStore();

  const handleToggle = () => {
    toggleStatus(task.id);
  };

  const handleDelete = () => {
    if (confirm(t("taskItem.confirmDelete"))) {
      deleteTask(task.id);
    }
  };

  const getPriorityClass = (priority: Priority): string => {
    return styles[`priority-${priority}`];
  };

  const getStatusClass = (status: Task["status"]): string => {
    return styles[`status-${status}`];
  };

  const overdue = task.deadline ? isOverdue(task.deadline) : false;

  return (
    <div
      className={`${styles.taskItem} ${getStatusClass(task.status)} ${
        overdue ? styles.overdue : ""
      }`}
    >
      <div className={styles.content}>
        <button
          onClick={handleToggle}
          className={styles.checkbox}
          aria-label={
            task.status === "completed"
              ? t("taskItem.markIncomplete")
              : t("taskItem.markComplete")
          }
        >
          {task.status === "completed" ? (
            <CheckCircle size={24} weight="fill" />
          ) : (
            <Circle size={24} weight="light" />
          )}
        </button>

        <div className={styles.details}>
          <div className={styles.header}>
            <h3 className={styles.title}>{task.title}</h3>
            <span
              className={`${styles.priority} ${getPriorityClass(
                task.priority
              )}`}
            >
              {t(`common.priority.${task.priority}`)}
            </span>
          </div>

          {task.description && (
            <p className={styles.description}>{task.description}</p>
          )}

          <div className={styles.meta}>
            {task.startDate && (
              <span className={styles.date}>
                {t("common.start")}: {formatTaskDate(task.startDate)}{" "}
                {formatTaskTime(task.startDate)}
              </span>
            )}
            {task.deadline && (
              <span
                className={`${styles.date} ${
                  overdue ? styles.overdueDate : ""
                }`}
              >
                {t("common.due")}: {formatTaskDate(task.deadline)}{" "}
                {formatTaskTime(task.deadline)}
              </span>
            )}
          </div>

          {task.tags.length > 0 && (
            <div className={styles.tags}>
              {task.tags.map((tagId) => {
                const tag = tags.find((t) => t.id === tagId);
                return (
                  <span
                    key={tagId}
                    className={styles.tag}
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
              <span className={styles.subtasksLabel}>
                {t("common.subtasks")}:{" "}
                {task.subtasks.filter((st) => st.completed).length} /{" "}
                {task.subtasks.length}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={() => onEdit(task)}
          className={styles.actionButton}
          aria-label={t("taskItem.editTask")}
        >
          <Pencil size={18} weight="light" />
        </button>
        <button
          onClick={handleDelete}
          className={styles.actionButton}
          aria-label={t("taskItem.deleteTask")}
        >
          <Trash size={18} weight="light" />
        </button>
      </div>
    </div>
  );
});
