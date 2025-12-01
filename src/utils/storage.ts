import { Task, Tag } from "../types/task";

const STORAGE_KEY_TASKS = "todo-tasks";
const STORAGE_KEY_TAGS = "todo-tags";
const STORAGE_KEY_LEGACY = "tasks";

export interface StorageData {
  tasks: Task[];
  tags: Tag[];
}

export const migrateLegacyData = (): void => {
  try {
    const legacyData = localStorage.getItem(STORAGE_KEY_LEGACY);
    if (!legacyData) return;

    const legacyTasks = JSON.parse(legacyData);
    if (!Array.isArray(legacyTasks)) return;

    const migratedTasks: Task[] = legacyTasks.map(
      (task: { id: string; text: string; completed: boolean }) => ({
        id: task.id || `legacy-${Date.now()}-${Math.random()}`,
        title: task.text || "",
        description: "",
        startDate: null,
        deadline: null,
        status: task.completed ? "completed" : "planned",
        priority: "normal",
        tags: [],
        subtasks: [],
        notes: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        completedAt: task.completed ? new Date() : null,
        parentId: null,
      })
    );

    const existingData = loadData();
    const newTasks = [...migratedTasks, ...existingData.tasks];

    saveData({ tasks: newTasks, tags: existingData.tags });
    localStorage.removeItem(STORAGE_KEY_LEGACY);
  } catch (error) {
    console.error("Error migrating legacy data:", error);
  }
};

export const loadData = (): StorageData => {
  try {
    const tasksJson = localStorage.getItem(STORAGE_KEY_TASKS);
    const tagsJson = localStorage.getItem(STORAGE_KEY_TAGS);

    const tasks: Task[] = tasksJson
      ? JSON.parse(tasksJson).map((task: Task) => ({
          ...task,
          startDate: task.startDate ? new Date(task.startDate) : null,
          deadline: task.deadline ? new Date(task.deadline) : null,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          completedAt: task.completedAt ? new Date(task.completedAt) : null,
          subtasks:
            task.subtasks?.map((subtask) => ({
              ...subtask,
              createdAt: new Date(subtask.createdAt),
              updatedAt: new Date(subtask.updatedAt),
            })) || [],
        }))
      : [];

    const tags: Tag[] = tagsJson ? JSON.parse(tagsJson) : [];

    return { tasks, tags };
  } catch (error) {
    console.error("Error loading data:", error);
    return { tasks: [], tags: [] };
  }
};

export const saveData = (data: StorageData): void => {
  try {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(data.tasks));
    localStorage.setItem(STORAGE_KEY_TAGS, JSON.stringify(data.tags));
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

export const clearData = (): void => {
  localStorage.removeItem(STORAGE_KEY_TASKS);
  localStorage.removeItem(STORAGE_KEY_TAGS);
};
