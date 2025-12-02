import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useKanbanCard } from "../../hooks/useKanbanCard";
import { Task } from "../../types/task";
import { subDays, addDays } from "date-fns";

describe("useKanbanCard", () => {
  const createTask = (overrides?: Partial<Task>): Task => ({
    id: "task-1",
    title: "Test Task",
    status: "planned",
    priority: "normal",
    tags: [],
    subtasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  describe("overdue", () => {
    it("should return false when no deadline", () => {
      const task = createTask();
      const { result } = renderHook(() => useKanbanCard({ task }));

      expect(result.current.overdue).toBe(false);
    });

    it("should return false for future deadline", () => {
      const task = createTask({ deadline: addDays(new Date(), 5) });
      const { result } = renderHook(() => useKanbanCard({ task }));

      expect(result.current.overdue).toBe(false);
    });

    it("should return true for past deadline", () => {
      const task = createTask({ deadline: subDays(new Date(), 2) });
      const { result } = renderHook(() => useKanbanCard({ task }));

      expect(result.current.overdue).toBe(true);
    });
  });

  describe("showInsertLine", () => {
    it("should return false when not over", () => {
      const task = createTask();
      const { result } = renderHook(() =>
        useKanbanCard({ task, isOver: false })
      );

      expect(result.current.showInsertLine).toBe(false);
    });

    it("should return true when over and not active", () => {
      const task = createTask();
      const { result } = renderHook(() =>
        useKanbanCard({ task, isOver: true, activeId: "other-task" })
      );

      expect(result.current.showInsertLine).toBe(true);
    });

    it("should return false when over but is active task", () => {
      const task = createTask();
      const { result } = renderHook(() =>
        useKanbanCard({ task, isOver: true, activeId: "task-1" })
      );

      expect(result.current.showInsertLine).toBe(false);
    });
  });

  describe("getPriorityClass", () => {
    it("should return correct class for low priority", () => {
      const task = createTask();
      const { result } = renderHook(() => useKanbanCard({ task }));

      expect(result.current.getPriorityClass("low")).toBe("priority-low");
    });

    it("should return correct class for normal priority", () => {
      const task = createTask();
      const { result } = renderHook(() => useKanbanCard({ task }));

      expect(result.current.getPriorityClass("normal")).toBe("priority-normal");
    });

    it("should return correct class for high priority", () => {
      const task = createTask();
      const { result } = renderHook(() => useKanbanCard({ task }));

      expect(result.current.getPriorityClass("high")).toBe("priority-high");
    });
  });

  describe("cardClassName", () => {
    it("should return empty array when no special states", () => {
      const task = createTask();
      const { result } = renderHook(() => useKanbanCard({ task }));

      expect(result.current.cardClassName).toEqual([]);
    });

    it("should include overdue class when task is overdue", () => {
      const task = createTask({ deadline: subDays(new Date(), 2) });
      const { result } = renderHook(() => useKanbanCard({ task }));

      expect(result.current.cardClassName).toContain("overdue");
    });

    it("should include isOver class when hovering", () => {
      const task = createTask();
      const { result } = renderHook(() =>
        useKanbanCard({ task, isOver: true, activeId: "other-task" })
      );

      expect(result.current.cardClassName).toContain("isOver");
    });
  });
});
