import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addWeeks,
  subWeeks,
  startOfMonth,
  endOfMonth,
  eachWeekOfInterval,
  addMonths,
} from "date-fns";
import { Task } from "../../types/task";
import { TaskItem } from "../TaskItem";
import styles from "./CalendarView.module.scss";

interface CalendarViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  viewMode: "calendar-day" | "calendar-week" | "calendar-month";
}

export const CalendarView = ({
  tasks,
  onEditTask,
  viewMode,
}: CalendarViewProps) => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter((task) => {
      if (!task.deadline) return false;
      return isSameDay(task.deadline, date);
    });
  };

  if (viewMode === "calendar-day") {
    const dayTasks = getTasksForDate(currentDate);
    return (
      <div className={styles.calendarView}>
        <div className={styles.header}>
          <button onClick={() => setCurrentDate(subWeeks(currentDate, 1))}>
            ←
          </button>
          <h2>{format(currentDate, "EEEE, MMMM d, yyyy")}</h2>
          <button onClick={() => setCurrentDate(addWeeks(currentDate, 1))}>
            →
          </button>
        </div>
        <div className={styles.tasks}>
          {dayTasks.length > 0 ? (
            dayTasks.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={onEditTask} />
            ))
          ) : (
            <p className={styles.empty}>{t("common.noTasks")}</p>
          )}
        </div>
      </div>
    );
  }

  if (viewMode === "calendar-week") {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className={styles.calendarView}>
        <div className={styles.header}>
          <button onClick={() => setCurrentDate(subWeeks(currentDate, 1))}>
            ←
          </button>
          <h2>
            {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
          </h2>
          <button onClick={() => setCurrentDate(addWeeks(currentDate, 1))}>
            →
          </button>
        </div>
        <div className={styles.weekGrid}>
          {weekDays.map((day) => {
            const dayTasks = getTasksForDate(day);
            return (
              <div key={day.toISOString()} className={styles.dayColumn}>
                <div className={styles.dayHeader}>
                  <h3>{format(day, "EEE")}</h3>
                  <span>{format(day, "d")}</span>
                </div>
                <div className={styles.dayTasks}>
                  {dayTasks.map((task) => (
                    <TaskItem key={task.id} task={task} onEdit={onEditTask} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (viewMode === "calendar-month") {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const weeks = eachWeekOfInterval(
      { start: monthStart, end: monthEnd },
      { weekStartsOn: 1 }
    );

    return (
      <div className={styles.calendarView}>
        <div className={styles.header}>
          <button onClick={() => setCurrentDate(addMonths(currentDate, -1))}>
            ←
          </button>
          <h2>{format(currentDate, "MMMM yyyy")}</h2>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            →
          </button>
        </div>
        <div className={styles.monthGrid}>
          {weeks.map((weekStart) => {
            const weekDays = eachDayOfInterval({
              start: weekStart,
              end: endOfWeek(weekStart),
            });
            return (
              <div key={weekStart.toISOString()} className={styles.weekRow}>
                {weekDays.map((day) => {
                  const dayTasks = getTasksForDate(day);
                  const isCurrentMonth = day >= monthStart && day <= monthEnd;
                  return (
                    <div
                      key={day.toISOString()}
                      className={`${styles.monthDay} ${
                        !isCurrentMonth ? styles.otherMonth : ""
                      }`}
                    >
                      <div className={styles.monthDayHeader}>
                        <span>{format(day, "d")}</span>
                        {dayTasks.length > 0 && (
                          <span className={styles.taskCount}>
                            {dayTasks.length}
                          </span>
                        )}
                      </div>
                      {isCurrentMonth && dayTasks.length > 0 && (
                        <div className={styles.monthDayTasks}>
                          {dayTasks.slice(0, 3).map((task) => (
                            <div key={task.id} className={styles.monthTaskItem}>
                              {task.title}
                            </div>
                          ))}
                          {dayTasks.length > 3 && (
                            <div className={styles.monthTaskItem}>
                              +{dayTasks.length - 3} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
