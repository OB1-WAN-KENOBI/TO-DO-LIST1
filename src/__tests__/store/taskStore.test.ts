import { describe, it, expect, beforeEach, vi } from "vitest";
import { useTaskStore } from "../../store/taskStore";
import { Task } from "../../store/../types/task";

describe("taskStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useTaskStore.setState({ tasks: [], tags: [] });
    vi.clearAllMocks();
  });

  describe("addTask", () => {
    it("should add a new task with generated id and timestamps", () => {
      const taskData = {
        title: "Test Task",
        description: "Test Description",
        status: "planned" as const,
        priority: "normal" as const,
        tags: [],
        subtasks: [],
      };

      useTaskStore.getState().addTask(taskData);

      const tasks = useTaskStore.getState().tasks;
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe("Test Task");
      expect(tasks[0].id).toMatch(/^task-/);
      expect(tasks[0].createdAt).toBeInstanceOf(Date);
      expect(tasks[0].updatedAt).toBeInstanceOf(Date);
    });

    it("should set order based on existing tasks with same status", () => {
      const store = useTaskStore.getState();
      store.addTask({
        title: "Task 1",
        status: "planned",
        priority: "normal",
        tags: [],
        subtasks: [],
      });
      store.addTask({
        title: "Task 2",
        status: "planned",
        priority: "normal",
        tags: [],
        subtasks: [],
      });

      const tasks = useTaskStore.getState().tasks;
      expect(tasks[0].order).toBe(0);
      expect(tasks[1].order).toBe(1);
    });
  });

  describe("updateTask", () => {
    it("should update task properties", () => {
      useTaskStore.setState({
        tasks: [
          {
            id: "task-1",
            title: "Original",
            status: "planned",
            priority: "normal",
            tags: [],
            subtasks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Task,
        ],
        tags: [],
      });

      useTaskStore.getState().updateTask("task-1", { title: "Updated" });

      const task = useTaskStore.getState().tasks[0];
      expect(task.title).toBe("Updated");
    });

    it("should set completedAt when status changes to completed", () => {
      useTaskStore.setState({
        tasks: [
          {
            id: "task-1",
            title: "Test",
            status: "planned",
            priority: "normal",
            tags: [],
            subtasks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            completedAt: null,
          } as Task,
        ],
        tags: [],
      });

      useTaskStore.getState().updateTask("task-1", { status: "completed" });

      const task = useTaskStore.getState().tasks[0];
      expect(task.completedAt).toBeInstanceOf(Date);
    });
  });

  describe("deleteTask", () => {
    it("should remove task by id", () => {
      useTaskStore.setState({
        tasks: [
          {
            id: "task-1",
            title: "Test",
            status: "planned",
            priority: "normal",
            tags: [],
            subtasks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Task,
        ],
        tags: [],
      });

      useTaskStore.getState().deleteTask("task-1");

      expect(useTaskStore.getState().tasks).toHaveLength(0);
    });
  });

  describe("toggleStatus", () => {
    it("should toggle between planned and completed", () => {
      useTaskStore.setState({
        tasks: [
          {
            id: "task-1",
            title: "Test",
            status: "planned",
            priority: "normal",
            tags: [],
            subtasks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Task,
        ],
        tags: [],
      });

      useTaskStore.getState().toggleStatus("task-1");
      expect(useTaskStore.getState().tasks[0].status).toBe("completed");

      useTaskStore.getState().toggleStatus("task-1");
      expect(useTaskStore.getState().tasks[0].status).toBe("planned");
    });
  });

  describe("setStatus", () => {
    it("should change task status", () => {
      useTaskStore.setState({
        tasks: [
          {
            id: "task-1",
            title: "Test",
            status: "planned",
            priority: "normal",
            tags: [],
            subtasks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Task,
        ],
        tags: [],
      });

      useTaskStore.getState().setStatus("task-1", "in-progress");

      expect(useTaskStore.getState().tasks[0].status).toBe("in-progress");
    });

    it("should reset priority to normal when moving to backlog", () => {
      useTaskStore.setState({
        tasks: [
          {
            id: "task-1",
            title: "Test",
            status: "planned",
            priority: "high",
            tags: [],
            subtasks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Task,
        ],
        tags: [],
      });

      useTaskStore.getState().setStatus("task-1", "backlog");

      expect(useTaskStore.getState().tasks[0].priority).toBe("normal");
    });
  });

  describe("reorderTasks", () => {
    it("should update order for tasks with given ids", () => {
      useTaskStore.setState({
        tasks: [
          {
            id: "task-1",
            title: "Task 1",
            status: "planned",
            priority: "normal",
            tags: [],
            subtasks: [],
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Task,
          {
            id: "task-2",
            title: "Task 2",
            status: "planned",
            priority: "normal",
            tags: [],
            subtasks: [],
            order: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Task,
        ],
        tags: [],
      });

      useTaskStore.getState().reorderTasks("planned", ["task-2", "task-1"]);

      const tasks = useTaskStore.getState().tasks;
      const task1 = tasks.find((t) => t.id === "task-1");
      const task2 = tasks.find((t) => t.id === "task-2");
      expect(task2?.order).toBe(0);
      expect(task1?.order).toBe(1);
    });
  });

  describe("subtasks", () => {
    it("should add subtask to task", () => {
      useTaskStore.setState({
        tasks: [
          {
            id: "task-1",
            title: "Test",
            status: "planned",
            priority: "normal",
            tags: [],
            subtasks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Task,
        ],
        tags: [],
      });

      useTaskStore
        .getState()
        .addSubtask("task-1", { title: "Subtask 1", completed: false });

      const task = useTaskStore.getState().tasks[0];
      expect(task.subtasks).toHaveLength(1);
      expect(task.subtasks[0].title).toBe("Subtask 1");
    });

    it("should update subtask", () => {
      useTaskStore.setState({
        tasks: [
          {
            id: "task-1",
            title: "Test",
            status: "planned",
            priority: "normal",
            tags: [],
            subtasks: [
              {
                id: "subtask-1",
                title: "Original",
                completed: false,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Task,
        ],
        tags: [],
      });

      useTaskStore
        .getState()
        .updateSubtask("task-1", "subtask-1", { completed: true });

      const task = useTaskStore.getState().tasks[0];
      expect(task.subtasks[0].completed).toBe(true);
    });

    it("should delete subtask", () => {
      useTaskStore.setState({
        tasks: [
          {
            id: "task-1",
            title: "Test",
            status: "planned",
            priority: "normal",
            tags: [],
            subtasks: [
              {
                id: "subtask-1",
                title: "Subtask",
                completed: false,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Task,
        ],
        tags: [],
      });

      useTaskStore.getState().deleteSubtask("task-1", "subtask-1");

      const task = useTaskStore.getState().tasks[0];
      expect(task.subtasks).toHaveLength(0);
    });
  });

  describe("tags", () => {
    it("should add tag", () => {
      useTaskStore.getState().addTag({
        id: "tag-1",
        name: "Work",
        color: "#ff0000",
      });

      expect(useTaskStore.getState().tags).toHaveLength(1);
      expect(useTaskStore.getState().tags[0].name).toBe("Work");
    });

    it("should update tag", () => {
      useTaskStore.setState({
        tasks: [],
        tags: [{ id: "tag-1", name: "Work", color: "#ff0000" }],
      });

      useTaskStore.getState().updateTag("tag-1", { name: "Personal" });

      expect(useTaskStore.getState().tags[0].name).toBe("Personal");
    });

    it("should delete tag and remove from tasks", () => {
      useTaskStore.setState({
        tasks: [
          {
            id: "task-1",
            title: "Test",
            status: "planned",
            priority: "normal",
            tags: ["tag-1"],
            subtasks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          } as Task,
        ],
        tags: [{ id: "tag-1", name: "Work", color: "#ff0000" }],
      });

      useTaskStore.getState().deleteTag("tag-1");

      expect(useTaskStore.getState().tags).toHaveLength(0);
      expect(useTaskStore.getState().tasks[0].tags).toHaveLength(0);
    });
  });
});
