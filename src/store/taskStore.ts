import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Task, Tag, Subtask, TaskStatus } from "../types/task";
import { addDays, addWeeks } from "date-fns";

const generateExampleTasks = (): { tasks: Task[]; tags: Tag[] } => {
  const now = new Date();
  const tags: Tag[] = [
    { id: "tag-1", name: "Работа", color: "#3b82f6" },
    { id: "tag-2", name: "Личное", color: "#10b981" },
    { id: "tag-3", name: "Срочно", color: "#ef4444" },
    { id: "tag-4", name: "Проект", color: "#8b5cf6" },
    { id: "tag-5", name: "Дом", color: "#f59e0b" },
  ];

  const tasks: Task[] = [
    {
      id: "task-example-1",
      title: "Завершить отчет по проекту",
      description:
        "Подготовить финальный отчет с результатами и рекомендациями",
      startDate: addDays(now, -2),
      deadline: addDays(now, 1),
      status: "in-progress",
      priority: "high",
      tags: [tags[0].id, tags[3].id],
      subtasks: [
        {
          id: "subtask-1",
          title: "Собрать данные",
          completed: true,
          createdAt: addDays(now, -2),
          updatedAt: addDays(now, -1),
        },
        {
          id: "subtask-2",
          title: "Написать выводы",
          completed: false,
          createdAt: addDays(now, -2),
          updatedAt: addDays(now, -2),
        },
        {
          id: "subtask-3",
          title: "Проверить орфографию",
          completed: false,
          createdAt: addDays(now, -1),
          updatedAt: addDays(now, -1),
        },
      ],
      notes: "Важно успеть до дедлайна",
      order: 0,
      createdAt: addDays(now, -5),
      updatedAt: now,
      completedAt: null,
      parentId: null,
    },
    {
      id: "task-example-2",
      title: "Купить продукты",
      description: "Молоко, хлеб, яйца, овощи",
      startDate: null,
      deadline: addDays(now, 0),
      status: "planned",
      priority: "normal",
      tags: [tags[1].id, tags[4].id],
      subtasks: [],
      notes: "",
      order: 0,
      createdAt: addDays(now, -1),
      updatedAt: addDays(now, -1),
      completedAt: null,
      parentId: null,
    },
    {
      id: "task-example-3",
      title: "Встреча с командой",
      description: "Обсуждение планов на следующий спринт",
      startDate: addDays(now, 2),
      deadline: addDays(now, 2),
      status: "planned",
      priority: "high",
      tags: [tags[0].id],
      subtasks: [
        {
          id: "subtask-4",
          title: "Подготовить презентацию",
          completed: false,
          createdAt: addDays(now, -3),
          updatedAt: addDays(now, -3),
        },
      ],
      notes: "Не забыть взять ноутбук",
      order: 1,
      createdAt: addDays(now, -3),
      updatedAt: addDays(now, -3),
      completedAt: null,
      parentId: null,
    },
    {
      id: "task-example-4",
      title: "Изучить новый фреймворк",
      description: "Просмотреть документацию и сделать тестовый проект",
      startDate: null,
      deadline: addWeeks(now, 2),
      status: "backlog",
      priority: "low",
      tags: [tags[0].id],
      subtasks: [],
      notes: "",
      order: 0,
      createdAt: addDays(now, -7),
      updatedAt: addDays(now, -7),
      completedAt: null,
      parentId: null,
    },
    {
      id: "task-example-5",
      title: "Позвонить родителям",
      description: "Обсудить планы на выходные",
      startDate: null,
      deadline: addDays(now, 3),
      status: "planned",
      priority: "normal",
      tags: [tags[1].id],
      subtasks: [],
      notes: "",
      order: 2,
      createdAt: addDays(now, -2),
      updatedAt: addDays(now, -2),
      completedAt: null,
      parentId: null,
    },
    {
      id: "task-example-6",
      title: "Оплатить счета",
      description: "Коммунальные услуги и интернет",
      startDate: null,
      deadline: addDays(now, -1),
      status: "in-progress",
      priority: "high",
      tags: [tags[1].id, tags[3].id, tags[4].id],
      subtasks: [],
      notes: "Срочно!",
      order: 0,
      createdAt: addDays(now, -4),
      updatedAt: now,
      completedAt: null,
      parentId: null,
    },
    {
      id: "task-example-7",
      title: "Занятия спортом",
      description: "Тренировка в спортзале",
      startDate: addDays(now, 1),
      deadline: addDays(now, 1),
      status: "planned",
      priority: "normal",
      tags: [tags[1].id],
      subtasks: [],
      notes: "",
      repeatRule: {
        type: "weekly",
        interval: 1,
        daysOfWeek: [1, 3, 5],
        endDate: null,
      },
      order: 3,
      createdAt: addDays(now, -10),
      updatedAt: addDays(now, -10),
      completedAt: null,
      parentId: null,
    },
    {
      id: "task-example-8",
      title: "Ревью кода",
      description: "Проверить pull request от коллеги",
      startDate: null,
      deadline: addDays(now, 0),
      status: "in-progress",
      priority: "high",
      tags: [tags[0].id],
      subtasks: [],
      notes: "",
      order: 1,
      createdAt: addDays(now, -1),
      updatedAt: now,
      completedAt: null,
      parentId: null,
    },
    {
      id: "task-example-9",
      title: "Записаться к врачу",
      description: "Плановый осмотр",
      startDate: null,
      deadline: addWeeks(now, 1),
      status: "backlog",
      priority: "normal",
      tags: [tags[1].id],
      subtasks: [],
      notes: "",
      order: 1,
      createdAt: addDays(now, -5),
      updatedAt: addDays(now, -5),
      completedAt: null,
      parentId: null,
    },
    {
      id: "task-example-10",
      title: "Обновить резюме",
      description: "Добавить новые навыки и проекты",
      startDate: null,
      deadline: addDays(now, 5),
      status: "backlog",
      priority: "low",
      tags: [tags[0].id],
      subtasks: [],
      notes: "",
      order: 2,
      createdAt: addDays(now, -14),
      updatedAt: addDays(now, -14),
      completedAt: null,
      parentId: null,
    },
    {
      id: "task-example-11",
      title: "Завершенная задача",
      description: "Пример выполненной задачи",
      startDate: addDays(now, -5),
      deadline: addDays(now, -2),
      status: "completed",
      priority: "normal",
      tags: [tags[0].id],
      subtasks: [],
      notes: "",
      order: 0,
      createdAt: addDays(now, -7),
      updatedAt: addDays(now, -2),
      completedAt: addDays(now, -2),
      parentId: null,
    },
    {
      id: "task-example-12",
      title: "Еще одна завершенная",
      description: "Вторая выполненная задача для примера",
      startDate: addDays(now, -10),
      deadline: addDays(now, -8),
      status: "completed",
      priority: "high",
      tags: [tags[1].id, tags[4].id],
      subtasks: [
        {
          id: "subtask-5",
          title: "Подзадача 1",
          completed: true,
          createdAt: addDays(now, -10),
          updatedAt: addDays(now, -9),
        },
        {
          id: "subtask-6",
          title: "Подзадача 2",
          completed: true,
          createdAt: addDays(now, -10),
          updatedAt: addDays(now, -8),
        },
      ],
      notes: "",
      order: 1,
      createdAt: addDays(now, -12),
      updatedAt: addDays(now, -8),
      completedAt: addDays(now, -8),
      parentId: null,
    },
  ];

  return { tasks, tags };
};

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
        // Zustand persist автоматически загружает данные из localStorage
        // Проверяем, нужно ли создать примеры
        const state = get();
        if (state.tasks.length === 0 && state.tags.length === 0) {
          const examples = generateExampleTasks();
          set({ tasks: examples.tasks, tags: examples.tags });
        }
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
          return { tasks: newTasks };
        });
      },

      deleteTask: (id) => {
        set((state) => {
          const newTasks = state.tasks.filter(
            (t) => t.id !== id && t.parentId !== id
          );
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

          // При переносе в completed автоматически помечаем как выполненную
          if (status === "completed") {
            updates.completedAt = new Date();
          } else if (task.status === "completed") {
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
          return { tasks: newTasks };
        });
      },

      addTag: (tag) => {
        set((state) => {
          const newTags = [...state.tags, tag];
          return { tags: newTags };
        });
      },

      updateTag: (id, updates) => {
        set((state) => {
          const newTags = state.tags.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          );
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
          return { tags: newTags, tasks: newTasks };
        });
      },
    }),
    {
      name: "todo-task-storage",
      storage: createJSONStorage(() => localStorage, {
        reviver: (_key, value) => {
          // Восстанавливаем даты из строк
          if (typeof value === "string") {
            const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
            if (dateRegex.test(value)) {
              return new Date(value);
            }
          }
          return value;
        },
      }),
      partialize: (state) => ({ tasks: state.tasks, tags: state.tags }),
    }
  )
);
