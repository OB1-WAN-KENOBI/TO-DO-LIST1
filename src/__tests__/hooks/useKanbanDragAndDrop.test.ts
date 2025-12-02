import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useKanbanDragAndDrop } from "../../hooks/useKanbanDragAndDrop";
import { useTaskStore } from "../../store/taskStore";
import { Task } from "../../types/task";

vi.mock("../../store/taskStore", () => ({
  useTaskStore: vi.fn(),
}));

describe("useKanbanDragAndDrop", () => {
  const mockUpdateTask = vi.fn();
  const mockReorderTasks = vi.fn();
  const mockSetStatus = vi.fn();

  const mockTasks: Task[] = [
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
    },
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
    },
    {
      id: "task-3",
      title: "Task 3",
      status: "in-progress",
      priority: "normal",
      tags: [],
      subtasks: [],
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTaskStore).mockReturnValue({
      updateTask: mockUpdateTask,
      reorderTasks: mockReorderTasks,
      setStatus: mockSetStatus,
    } as unknown as ReturnType<typeof useTaskStore>);
  });

  it("should initialize with null activeId and overId", () => {
    const { result } = renderHook(() =>
      useKanbanDragAndDrop({
        tasks: mockTasks,
      })
    );

    expect(result.current.activeId).toBeNull();
    expect(result.current.overId).toBeNull();
    expect(result.current.activeTask).toBeNull();
  });

  it("should set activeId on drag start", () => {
    const { result } = renderHook(() =>
      useKanbanDragAndDrop({
        tasks: mockTasks,
      })
    );

    act(() => {
      result.current.handleDragStart({
        active: { id: "task-1" },
      } as Parameters<typeof result.current.handleDragStart>[0]);
    });

    expect(result.current.activeId).toBe("task-1");
    expect(result.current.activeTask).toBe(mockTasks[0]);
  });

  it("should set overId on drag over", () => {
    const { result } = renderHook(() =>
      useKanbanDragAndDrop({
        tasks: mockTasks,
      })
    );

    act(() => {
      result.current.handleDragOver({
        active: { id: "task-1" },
        over: { id: "task-2" },
      } as Parameters<typeof result.current.handleDragOver>[0]);
    });

    expect(result.current.overId).toBe("task-2");
  });

  it("should clear overId when no over target", () => {
    const { result } = renderHook(() =>
      useKanbanDragAndDrop({
        tasks: mockTasks,
      })
    );

    act(() => {
      result.current.handleDragOver({
        active: { id: "task-1" },
        over: { id: "task-2" },
      } as Parameters<typeof result.current.handleDragOver>[0]);
    });

    act(() => {
      result.current.handleDragOver({
        active: { id: "task-1" },
        over: null,
      } as Parameters<typeof result.current.handleDragOver>[0]);
    });

    expect(result.current.overId).toBeNull();
  });

  it("should reset state on drag end without over", () => {
    const { result } = renderHook(() =>
      useKanbanDragAndDrop({
        tasks: mockTasks,
      })
    );

    act(() => {
      result.current.handleDragStart({
        active: { id: "task-1" },
      } as Parameters<typeof result.current.handleDragStart>[0]);
    });

    act(() => {
      result.current.handleDragEnd({
        active: { id: "task-1", data: { current: {} } },
        over: null,
      } as Parameters<typeof result.current.handleDragEnd>[0]);
    });

    expect(result.current.activeId).toBeNull();
    expect(result.current.overId).toBeNull();
  });
});
