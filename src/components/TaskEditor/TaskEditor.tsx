import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "phosphor-react";
import { Task, TaskFormData, taskSchema, RepeatType } from "../../types/task";
import { useTaskStore } from "../../store/taskStore";
import styles from "./TaskEditor.module.scss";

const formatDateTimeLocal = (date: Date | null | undefined): string => {
  if (!date) return "";
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

interface TaskEditorProps {
  task?: Task | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskEditor = ({ task, isOpen, onClose }: TaskEditorProps) => {
  const { t } = useTranslation();
  const { addTask, updateTask } = useTaskStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "backlog",
      priority: "normal",
      tags: [],
      labels: [],
      subtasks: [],
      notes: "",
      repeatRule: {
        type: "none",
      },
    },
  });

  useEffect(() => {
    if (task && isOpen) {
      reset({
        id: task.id,
        title: task.title,
        description: task.description || "",
        startDate: task.startDate,
        deadline: task.deadline,
        status: task.status,
        priority: task.priority,
        tags: task.tags,
        labels: task.labels || [],
        subtasks: task.subtasks,
        notes: task.notes || "",
        repeatRule: task.repeatRule || { type: "none" },
      });
    } else if (!task && isOpen) {
      reset({
        title: "",
        description: "",
        status: "backlog",
        priority: "normal",
        tags: [],
        labels: [],
        subtasks: [],
        notes: "",
        repeatRule: { type: "none" },
      });
    }
  }, [task, reset, isOpen]);

  const onSubmit = (data: TaskFormData) => {
    if (task) {
      updateTask(task.id, {
        ...data,
        updatedAt: new Date(),
      });
    } else {
      addTask({
        ...data,
        subtasks: data.subtasks || [],
        tags: data.tags || [],
        completedAt: null,
        parentId: null,
      });
    }
    onClose();
  };

  const repeatType = watch("repeatRule.type");

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{task ? t("taskEditor.editTask") : t("taskEditor.newTask")}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} weight="light" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="title">{t("taskEditor.title")} *</label>
            <input
              id="title"
              {...register("title")}
              placeholder={t("taskEditor.enterTitle")}
            />
            {errors.title && (
              <span className={styles.error}>{errors.title.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="description">{t("taskEditor.description")}</label>
            <textarea
              id="description"
              {...register("description")}
              placeholder={t("taskEditor.enterDescription")}
              rows={3}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="startDate">{t("taskEditor.startDate")}</label>
              <input
                id="startDate"
                type="datetime-local"
                {...register("startDate", {
                  setValueAs: (v) => {
                    if (!v) return null;
                    const date = new Date(v);
                    return isNaN(date.getTime()) ? null : date;
                  },
                })}
                value={
                  watch("startDate")
                    ? formatDateTimeLocal(watch("startDate")!)
                    : ""
                }
                onChange={(e) => {
                  if (e.target.value) {
                    const date = new Date(e.target.value);
                    setValue("startDate", isNaN(date.getTime()) ? null : date);
                  } else {
                    setValue("startDate", null);
                  }
                }}
              />
              {errors.startDate && (
                <span className={styles.error}>{errors.startDate.message}</span>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="deadline">{t("taskEditor.deadline")}</label>
              <input
                id="deadline"
                type="datetime-local"
                {...register("deadline", {
                  setValueAs: (v) => {
                    if (!v) return null;
                    const date = new Date(v);
                    return isNaN(date.getTime()) ? null : date;
                  },
                })}
                value={
                  watch("deadline")
                    ? formatDateTimeLocal(watch("deadline")!)
                    : ""
                }
                onChange={(e) => {
                  if (e.target.value) {
                    const date = new Date(e.target.value);
                    setValue("deadline", isNaN(date.getTime()) ? null : date);
                  } else {
                    setValue("deadline", null);
                  }
                }}
              />
              {errors.deadline && (
                <span className={styles.error}>{errors.deadline.message}</span>
              )}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="status">{t("taskEditor.status")}</label>
              <select id="status" {...register("status")}>
                <option value="backlog">{t("common.status.backlog")}</option>
                <option value="planned">{t("common.status.planned")}</option>
                <option value="in-progress">
                  {t("common.status.in-progress")}
                </option>
                <option value="completed">
                  {t("common.status.completed")}
                </option>
                <option value="cancelled">
                  {t("common.status.cancelled")}
                </option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="priority">{t("taskEditor.priority")}</label>
              <select id="priority" {...register("priority")}>
                <option value="low">{t("common.priority.low")}</option>
                <option value="normal">{t("common.priority.normal")}</option>
                <option value="high">{t("common.priority.high")}</option>
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="tags">{t("taskEditor.tags")}</label>
            <input
              id="tags"
              placeholder={t("taskEditor.enterTags")}
              onBlur={(e) => {
                const tagValues = e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter((t) => t.length > 0);
                setValue("tags", tagValues);
              }}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="labels">{t("taskEditor.labels")}</label>
            <input
              id="labels"
              placeholder={t("taskEditor.enterLabels")}
              onBlur={(e) => {
                const labelValues = e.target.value
                  .split(",")
                  .map((l) => l.trim())
                  .filter((l) => l.length > 0);
                setValue("labels", labelValues);
              }}
              defaultValue={task?.labels?.join(", ") || ""}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="repeatType">{t("taskEditor.repeat")}</label>
            <select
              id="repeatType"
              value={repeatType}
              onChange={(e) =>
                setValue("repeatRule.type", e.target.value as RepeatType)
              }
            >
              <option value="none">{t("common.repeatType.none")}</option>
              <option value="daily">{t("common.repeatType.daily")}</option>
              <option value="weekly">{t("common.repeatType.weekly")}</option>
              <option value="monthly">{t("common.repeatType.monthly")}</option>
              <option value="custom">{t("common.repeatType.custom")}</option>
            </select>
          </div>

          {repeatType !== "none" && (
            <div className={styles.field}>
              <label htmlFor="interval">{t("taskEditor.interval")}</label>
              <input
                id="interval"
                type="number"
                min="1"
                {...register("repeatRule.interval", { valueAsNumber: true })}
              />
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="notes">{t("taskEditor.notes")}</label>
            <textarea
              id="notes"
              {...register("notes")}
              placeholder={t("taskEditor.additionalNotes")}
              rows={4}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              {t("taskEditor.cancel")}
            </button>
            <button type="submit" className={styles.submitButton}>
              {task ? t("taskEditor.update") : t("taskEditor.create")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
