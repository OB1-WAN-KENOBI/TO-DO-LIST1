import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  loadData,
  saveData,
  clearData,
  migrateLegacyData,
} from "../../utils/storage";
import { Task, Tag } from "../../types/task";

describe("storage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(null);
  });

  describe("loadData", () => {
    it("should return empty arrays when no data in storage", () => {
      const data = loadData();
      expect(data.tasks).toEqual([]);
      expect(data.tags).toEqual([]);
    });

    it("should parse tasks from storage", () => {
      const mockTasks = [
        {
          id: "task-1",
          title: "Test",
          status: "planned",
          priority: "normal",
          tags: [],
          subtasks: [],
          createdAt: "2025-01-01T00:00:00.000Z",
          updatedAt: "2025-01-01T00:00:00.000Z",
        },
      ];

      (localStorage.getItem as ReturnType<typeof vi.fn>).mockImplementation(
        (key: string) => {
          if (key === "todo-tasks") return JSON.stringify(mockTasks);
          return null;
        }
      );

      const data = loadData();
      expect(data.tasks).toHaveLength(1);
      expect(data.tasks[0].title).toBe("Test");
      expect(data.tasks[0].createdAt).toBeInstanceOf(Date);
    });

    it("should parse tags from storage", () => {
      const mockTags = [{ id: "tag-1", name: "Work", color: "#ff0000" }];

      (localStorage.getItem as ReturnType<typeof vi.fn>).mockImplementation(
        (key: string) => {
          if (key === "todo-tags") return JSON.stringify(mockTags);
          return null;
        }
      );

      const data = loadData();
      expect(data.tags).toHaveLength(1);
      expect(data.tags[0].name).toBe("Work");
    });

    it("should handle parse errors gracefully", () => {
      (localStorage.getItem as ReturnType<typeof vi.fn>).mockReturnValue(
        "invalid json"
      );

      const data = loadData();
      expect(data.tasks).toEqual([]);
      expect(data.tags).toEqual([]);
    });
  });

  describe("saveData", () => {
    it("should save tasks and tags to localStorage", () => {
      const data = {
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
        tags: [{ id: "tag-1", name: "Work", color: "#ff0000" }] as Tag[],
      };

      saveData(data);

      expect(localStorage.setItem).toHaveBeenCalledTimes(2);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "todo-tasks",
        expect.any(String)
      );
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "todo-tags",
        expect.any(String)
      );
    });
  });

  describe("clearData", () => {
    it("should remove tasks and tags from localStorage", () => {
      clearData();

      expect(localStorage.removeItem).toHaveBeenCalledTimes(2);
      expect(localStorage.removeItem).toHaveBeenCalledWith("todo-tasks");
      expect(localStorage.removeItem).toHaveBeenCalledWith("todo-tags");
    });
  });

  describe("migrateLegacyData", () => {
    it("should do nothing if no legacy data", () => {
      migrateLegacyData();
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });

    it("should migrate legacy tasks", () => {
      const legacyTasks = [
        { id: "1", text: "Old task", completed: false },
        { id: "2", text: "Done task", completed: true },
      ];

      (localStorage.getItem as ReturnType<typeof vi.fn>).mockImplementation(
        (key: string) => {
          if (key === "tasks") return JSON.stringify(legacyTasks);
          return null;
        }
      );

      migrateLegacyData();

      expect(localStorage.setItem).toHaveBeenCalled();
      expect(localStorage.removeItem).toHaveBeenCalledWith("tasks");
    });
  });
});
