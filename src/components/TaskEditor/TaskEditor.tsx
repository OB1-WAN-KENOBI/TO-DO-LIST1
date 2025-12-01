import { useEffect } from "react";
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
  const { addTask, updateTask, tags } = useTaskStore();
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
        createdAt: new Date(),
        updatedAt: new Date(),
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
          <h2>{task ? "Edit Task" : "New Task"}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} weight="light" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              {...register("title")}
              placeholder="Enter task title"
            />
            {errors.title && (
              <span className={styles.error}>{errors.title.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="startDate">Start Date</label>
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
              <label htmlFor="deadline">Deadline</label>
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
              <label htmlFor="status">Status</label>
              <select id="status" {...register("status")}>
                <option value="backlog">Backlog</option>
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="progress">Progress</option>
                <option value="done">Done</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="archive">Archive</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="priority">Priority</label>
              <select id="priority" {...register("priority")}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              placeholder="Enter tags separated by commas"
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
            <label htmlFor="labels">Labels</label>
            <input
              id="labels"
              placeholder="Enter labels separated by commas"
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
            <label htmlFor="repeatType">Repeat</label>
            <select
              id="repeatType"
              value={repeatType}
              onChange={(e) =>
                setValue("repeatRule.type", e.target.value as RepeatType)
              }
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {repeatType !== "none" && (
            <div className={styles.field}>
              <label htmlFor="interval">Interval (days)</label>
              <input
                id="interval"
                type="number"
                min="1"
                {...register("repeatRule.interval", { valueAsNumber: true })}
              />
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              {...register("notes")}
              placeholder="Additional notes"
              rows={4}
            />
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              {task ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
