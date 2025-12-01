import { useMemo } from "react";
import { Task } from "../../types/task";
import { useFilterStore } from "../../store/filterStore";
import { getTaskDateGroup, isOverdue } from "../../utils/dateUtils";
import { TaskItem } from "../TaskItem";
import styles from "./TaskList.module.scss";

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export const TaskList = ({ tasks, onEditTask }: TaskListProps) => {
  const {
    dateFilter,
    statusFilter,
    tagFilter,
    priorityFilter,
    sortBy,
    sortOrder,
    searchQuery,
  } = useFilterStore();

  const filteredAndSortedTasks = useMemo(() => {
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

    if (dateFilter !== "all") {
      filtered = filtered.filter((task) => {
        if (!task.deadline) return dateFilter === "later";
        const group = getTaskDateGroup(task);
        if (dateFilter === "overdue") return isOverdue(task.deadline);
        return group === dateFilter;
      });
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

    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "created":
          comparison = a.createdAt.getTime() - b.createdAt.getTime();
          break;
        case "deadline":
          if (!a.deadline && !b.deadline) comparison = 0;
          else if (!a.deadline) comparison = 1;
          else if (!b.deadline) comparison = -1;
          else comparison = a.deadline.getTime() - b.deadline.getTime();
          break;
        case "priority":
          const priorityOrder = { high: 3, normal: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case "status":
          const statusOrder = {
            completed: 4,
            cancelled: 3,
            "in-progress": 2,
            planned: 1,
          };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [
    tasks,
    dateFilter,
    statusFilter,
    tagFilter,
    priorityFilter,
    sortBy,
    sortOrder,
    searchQuery,
  ]);

  const groupedTasks = useMemo(() => {
    const groups: Record<string, Task[]> = {
      overdue: [],
      today: [],
      tomorrow: [],
      week: [],
      later: [],
    };

    filteredAndSortedTasks.forEach((task) => {
      if (!task.deadline) {
        groups.later.push(task);
        return;
      }

      if (isOverdue(task.deadline)) {
        groups.overdue.push(task);
      } else {
        const group = getTaskDateGroup(task);
        groups[group].push(task);
      }
    });

    return groups;
  }, [filteredAndSortedTasks]);

  if (filteredAndSortedTasks.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No tasks found</p>
      </div>
    );
  }

  return (
    <div className={styles.taskList}>
      {groupedTasks.overdue.length > 0 && (
        <section className={styles.group}>
          <h2 className={styles.groupTitle}>Overdue</h2>
          <div className={styles.tasks}>
            {groupedTasks.overdue.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={onEditTask} />
            ))}
          </div>
        </section>
      )}

      {groupedTasks.today.length > 0 && (
        <section className={styles.group}>
          <h2 className={styles.groupTitle}>Today</h2>
          <div className={styles.tasks}>
            {groupedTasks.today.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={onEditTask} />
            ))}
          </div>
        </section>
      )}

      {groupedTasks.tomorrow.length > 0 && (
        <section className={styles.group}>
          <h2 className={styles.groupTitle}>Tomorrow</h2>
          <div className={styles.tasks}>
            {groupedTasks.tomorrow.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={onEditTask} />
            ))}
          </div>
        </section>
      )}

      {groupedTasks.week.length > 0 && (
        <section className={styles.group}>
          <h2 className={styles.groupTitle}>This Week</h2>
          <div className={styles.tasks}>
            {groupedTasks.week.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={onEditTask} />
            ))}
          </div>
        </section>
      )}

      {groupedTasks.later.length > 0 && (
        <section className={styles.group}>
          <h2 className={styles.groupTitle}>Later</h2>
          <div className={styles.tasks}>
            {groupedTasks.later.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={onEditTask} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
