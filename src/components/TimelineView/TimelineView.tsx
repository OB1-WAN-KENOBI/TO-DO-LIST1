import { format, startOfDay, addHours } from "date-fns";
import { Task } from "../../types/task";
import { TaskItem } from "../TaskItem";
import styles from "./TimelineView.module.scss";

interface TimelineViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export const TimelineView = ({ tasks, onEditTask }: TimelineViewProps) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const today = startOfDay(new Date());

  const getTasksForHour = (hour: number): Task[] => {
    return tasks.filter((task) => {
      if (!task.startDate) return false;

      // Ensure startDate is a Date object
      const startDate =
        task.startDate instanceof Date
          ? task.startDate
          : new Date(task.startDate);

      // Skip if date is invalid
      if (isNaN(startDate.getTime())) return false;

      const taskHour = startDate.getHours();
      return taskHour === hour;
    });
  };

  return (
    <div className={styles.timelineView}>
      <h2 className={styles.title}>Today's Timeline</h2>
      <div className={styles.timeline}>
        {hours.map((hour) => {
          const hourTasks = getTasksForHour(hour);
          const hourDate = addHours(today, hour);
          const isCurrentHour = new Date().getHours() === hour;

          return (
            <div
              key={hour}
              className={`${styles.hourSlot} ${
                isCurrentHour ? styles.currentHour : ""
              }`}
            >
              <div className={styles.hourLabel}>
                <span>{format(hourDate, "HH:mm")}</span>
              </div>
              <div className={styles.hourTasks}>
                {hourTasks.length > 0 ? (
                  hourTasks.map((task) => (
                    <TaskItem key={task.id} task={task} onEdit={onEditTask} />
                  ))
                ) : (
                  <div className={styles.emptySlot} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
