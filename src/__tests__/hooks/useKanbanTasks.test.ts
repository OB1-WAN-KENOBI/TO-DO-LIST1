import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useKanbanTasks } from "../../hooks/useKanbanTasks";
import { useFilterStore } from "../../store/filterStore";
import { Task } from "../../types/task";

vi.mock("../../store/filterStore", () => ({
  useFilterStore: vi.fn(),
}));

describe("useKanbanTasks", () => {
  const mockTasks: Task[] = [
    {
      id: "task-1",
      title: "Task 1",
      description: "Description 1",
      status: "planned",
      priority: "high",
      tags: ["tag-1"],
      subtasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "task-2",
      title: "Task 2",
      description: "Description 2",
      status: "in-progress",
      priority: "normal",
      tags: ["tag-2"],
      subtasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "task-3",
      title: "Task 3",
      status: "completed",
      priority: "low",
      tags: [],
      subtasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    vi.mocked(useFilterStore).mockReturnValue({
      searchQuery: "",
      statusFilter: "all",
      tagFilter: "all",
      priorityFilter: "all",
      hideArchived: true,
    } as ReturnType<typeof useFilterStore>);
  });

  it("should return all tasks when no filters applied", () => {
    const { result } = renderHook(() => useKanbanTasks(mockTasks));

    expect(result.current.filteredTasks).toHaveLength(3);
  });

  it("should filter tasks by search query", () => {
    vi.mocked(useFilterStore).mockReturnValue({
      searchQuery: "Task 1",
      statusFilter: "all",
      tagFilter: "all",
      priorityFilter: "all",
      hideArchived: true,
    } as ReturnType<typeof useFilterStore>);

    const { result } = renderHook(() => useKanbanTasks(mockTasks));

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].title).toBe("Task 1");
  });

  it("should filter tasks by status", () => {
    vi.mocked(useFilterStore).mockReturnValue({
      searchQuery: "",
      statusFilter: ["planned"],
      tagFilter: "all",
      priorityFilter: "all",
      hideArchived: true,
    } as ReturnType<typeof useFilterStore>);

    const { result } = renderHook(() => useKanbanTasks(mockTasks));

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].status).toBe("planned");
  });

  it("should filter tasks by priority", () => {
    vi.mocked(useFilterStore).mockReturnValue({
      searchQuery: "",
      statusFilter: "all",
      tagFilter: "all",
      priorityFilter: ["high"],
      hideArchived: true,
    } as ReturnType<typeof useFilterStore>);

    const { result } = renderHook(() => useKanbanTasks(mockTasks));

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].priority).toBe("high");
  });

  it("should filter tasks by tags", () => {
    vi.mocked(useFilterStore).mockReturnValue({
      searchQuery: "",
      statusFilter: "all",
      tagFilter: ["tag-1"],
      priorityFilter: "all",
      hideArchived: true,
    } as ReturnType<typeof useFilterStore>);

    const { result } = renderHook(() => useKanbanTasks(mockTasks));

    expect(result.current.filteredTasks).toHaveLength(1);
    expect(result.current.filteredTasks[0].tags).toContain("tag-1");
  });

  it("should group tasks by kanban status", () => {
    const { result } = renderHook(() => useKanbanTasks(mockTasks));

    expect(result.current.tasksByStatus.planned).toHaveLength(1);
    expect(result.current.tasksByStatus["in-progress"]).toHaveLength(1);
    expect(result.current.tasksByStatus.completed).toHaveLength(1);
    expect(result.current.tasksByStatus.backlog).toHaveLength(0);
  });
});
