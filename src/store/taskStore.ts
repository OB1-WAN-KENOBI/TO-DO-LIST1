import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Task, Tag, Subtask, TaskStatus } from "../types/task";
import { loadData, saveData, migrateLegacyData } from "../utils/storage";
import { generateRepeatInstances, getNextRepeatDate } from "../utils/dateUtils";

interface TaskStore {
  tasks: Task[];
  tags: Tag[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleStatus: (id: string) => void;
  setStatus: (id: string, status: TaskStatus) => void;
  reorderTasks: (status: TaskStatus, taskIds: string[]) => void;
  addSubtask: (
    taskId: string,
    subtask: Omit<Subtask, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateSubtask: (
    taskId: string,
    subtaskId: string,
    updates: Partial<Subtask>
  ) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  addTag: (tag: Tag) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  deleteTag: (id: string) => void;
  initialize: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      tags: [],

      initialize: () => {
        migrateLegacyData();
        const data = loadData();
        set({ tasks: data.tasks, tags: data.tags });
      },

      addTask: (taskData) => {
        set((state) => {
          const tasksWithSameStatus = state.tasks.filter(
            (t) => t.status === taskData.status
          );
          const maxOrder = tasksWithSameStatus.reduce(
            (max, t) => Math.max(max, t.order || 0),
            -1
          );

          const newTask: Task = {
            ...taskData,
            id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date(),
            updatedAt: new Date(),
            subtasks: taskData.subtasks || [],
            order: taskData.order !== undefined ? taskData.order : maxOrder + 1,
          };

          const newTasks = [...state.tasks, newTask];
          saveData({ tasks: newTasks, tags: state.tags });
          return { tasks: newTasks };
        });
      },

      updateTask: (id, updates) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task) return state;

          const updatedTask: Task = {
            ...task,
            ...updates,
            updatedAt: new Date(),
          };

          if (updates.status === "completed" && task.status !== "completed") {
            updatedTask.completedAt = new Date();
          } else if (
            updates.status !== "completed" &&
            task.status === "completed"
          ) {
            updatedTask.completedAt = null;
          }

          const newTasks = state.tasks.map((t) =>
            t.id === id ? updatedTask : t
          );
          saveData({ tasks: newTasks, tags: state.tags });
          return { tasks: newTasks };
        });
      },

      deleteTask: (id) => {
        set((state) => {
          const newTasks = state.tasks.filter(
            (t) => t.id !== id && t.parentId !== id
          );
          saveData({ tasks: newTasks, tags: state.tags });
          return { tasks: newTasks };
        });
      },

      toggleStatus: (id) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task) return state;

          const newStatus: Task["status"] =
            task.status === "completed" ? "planned" : "completed";

          const updatedTask: Task = {
            ...task,
            status: newStatus,
            completedAt: newStatus === "completed" ? new Date() : null,
            updatedAt: new Date(),
          };

          const newTasks = state.tasks.map((t) =>
            t.id === id ? updatedTask : t
          );
          saveData({ tasks: newTasks, tags: state.tags });
          return { tasks: newTasks };
        });
      },

      setStatus: (id, status) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === id);
          if (!task) return state;

          const updates: Partial<Task> = {
            status,
            updatedAt: new Date(),
          };

          // При переносе в Done автоматически помечаем как выполненную
          if (status === "done" || status === "completed") {
            updates.completedAt = new Date();
          } else if (
            (task.status === "done" || task.status === "completed") &&
            status !== "done" &&
            status !== "completed"
          ) {
            updates.completedAt = null;
          }

          // При переносе в Backlog приоритет обнуляется до normal
          if (status === "backlog") {
            updates.priority = "normal";
          }

          // Если статус изменился, нужно пересчитать order для нового статуса
          if (task.status !== status) {
            const tasksInNewStatus = state.tasks.filter(
              (t) => t.id !== id && t.status === status
            );
            const maxOrder = tasksInNewStatus.reduce(
              (max, t) => Math.max(max, t.order || 0),
              -1
            );
            updates.order = maxOrder + 1;
          }

          const updatedTask: Task = {
            ...task,
            ...updates,
          };

          const newTasks = state.tasks.map((t) =>
            t.id === id ? updatedTask : t
          );
          saveData({ tasks: newTasks, tags: state.tags });
          return { tasks: newTasks };
        });
      },

      reorderTasks: (status, taskIds) => {
        set((state) => {
          const newTasks = state.tasks.map((task) => {
            const index = taskIds.indexOf(task.id);
            if (index !== -1 && task.status === status) {
              return {
                ...task,
                order: index,
                updatedAt: new Date(),
              };
            }
            return task;
          });

          saveData({ tasks: newTasks, tags: state.tags });
          return { tasks: newTasks };
        });
      },

      addSubtask: (taskId, subtaskData) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task) return state;

          const newSubtask: Subtask = {
            ...subtaskData,
            id: `subtask-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          const updatedTask: Task = {
            ...task,
            subtasks: [...task.subtasks, newSubtask],
            updatedAt: new Date(),
          };

          const newTasks = state.tasks.map((t) =>
            t.id === taskId ? updatedTask : t
          );
          saveData({ tasks: newTasks, tags: state.tags });
          return { tasks: newTasks };
        });
      },

      updateSubtask: (taskId, subtaskId, updates) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task) return state;

          const updatedSubtasks = task.subtasks.map((st) =>
            st.id === subtaskId
              ? { ...st, ...updates, updatedAt: new Date() }
              : st
          );

          const updatedTask: Task = {
            ...task,
            subtasks: updatedSubtasks,
            updatedAt: new Date(),
          };

          const newTasks = state.tasks.map((t) =>
            t.id === taskId ? updatedTask : t
          );
          saveData({ tasks: newTasks, tags: state.tags });
          return { tasks: newTasks };
        });
      },

      deleteSubtask: (taskId, subtaskId) => {
        set((state) => {
          const task = state.tasks.find((t) => t.id === taskId);
          if (!task) return state;

          const updatedTask: Task = {
            ...task,
            subtasks: task.subtasks.filter((st) => st.id !== subtaskId),
            updatedAt: new Date(),
          };

          const newTasks = state.tasks.map((t) =>
            t.id === taskId ? updatedTask : t
          );
          saveData({ tasks: newTasks, tags: state.tags });
          return { tasks: newTasks };
        });
      },

      addTag: (tag) => {
        set((state) => {
          const newTags = [...state.tags, tag];
          saveData({ tasks: state.tasks, tags: newTags });
          return { tags: newTags };
        });
      },

      updateTag: (id, updates) => {
        set((state) => {
          const newTags = state.tags.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          );
          saveData({ tasks: state.tasks, tags: newTags });
          return { tags: newTags };
        });
      },

      deleteTag: (id) => {
        set((state) => {
          const newTags = state.tags.filter((t) => t.id !== id);
          const newTasks = state.tasks.map((task) => ({
            ...task,
            tags: task.tags.filter((tagId) => tagId !== id),
          }));
          saveData({ tasks: newTasks, tags: newTags });
          return { tags: newTags, tasks: newTasks };
        });
      },
    }),
    {
      name: "todo-task-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tasks: state.tasks, tags: state.tags }),
    }
  )
);
