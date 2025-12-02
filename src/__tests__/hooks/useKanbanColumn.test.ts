import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useKanbanColumn } from "../../hooks/useKanbanColumn";
import { Task } from "../../types/task";

describe("useKanbanColumn", () => {
  const mockTasks: Task[] = [
    {
      id: "task-1",
      title: "Task 1",
      status: "planned",
      priority: "normal",
      tags: [],
      subtasks: [],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "task-2",
      title: "Task 2",
      status: "planned",
      priority: "normal",
      tags: [],
      subtasks: [],
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it("should sort tasks by order", () => {
    const { result } = renderHook(() =>
      useKanbanColumn({
        tasks: mockTasks,
        status: "planned",
      })
    );

    expect(result.current.sortedTasks[0].id).toBe("task-2");
    expect(result.current.sortedTasks[1].id).toBe("task-1");
  });

  it("should return task ids", () => {
    const { result } = renderHook(() =>
      useKanbanColumn({
        tasks: mockTasks,
        status: "planned",
      })
    );

    expect(result.current.taskIds).toEqual(["task-2", "task-1"]);
  });

  describe("getTaskProps", () => {
    it("should return isOver false when not hovering", () => {
      const { result } = renderHook(() =>
        useKanbanColumn({
          tasks: mockTasks,
          status: "planned",
          activeId: null,
          overId: null,
        })
      );

      const props = result.current.getTaskProps(mockTasks[0], 0);
      expect(props.isOver).toBe(false);
    });

    it("should return isOver true when hovering over task", () => {
      const { result } = renderHook(() =>
        useKanbanColumn({
          tasks: mockTasks,
          status: "planned",
          activeId: "task-1",
          overId: "task-2",
        })
      );

      const props = result.current.getTaskProps(mockTasks[1], 1);
      expect(props.isOver).toBe(true);
    });

    it("should not show isOver when overId equals status", () => {
      const { result } = renderHook(() =>
        useKanbanColumn({
          tasks: mockTasks,
          status: "planned",
          activeId: "task-1",
          overId: "planned",
        })
      );

      const props = result.current.getTaskProps(mockTasks[0], 0);
      expect(props.isOver).toBe(false);
    });

    it("should calculate insertBefore correctly for drag from another column", () => {
      const { result } = renderHook(() =>
        useKanbanColumn({
          tasks: mockTasks,
          status: "planned",
          activeId: "task-external",
          overId: "task-2",
        })
      );

      const props = result.current.getTaskProps(mockTasks[1], 0);
      expect(props.insertBefore).toBe(true);
    });
  });
});
