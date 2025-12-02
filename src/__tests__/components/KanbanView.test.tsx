import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { KanbanView } from "../../components/KanbanView";
import { useFilterStore } from "../../store/filterStore";
import { Task } from "../../types/task";
import React from "react";

vi.mock("../../store/filterStore", () => ({
  useFilterStore: vi.fn(),
}));

vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DragOverlay: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  closestCorners: vi.fn(),
  PointerSensor: vi.fn(),
  useSensor: vi.fn(),
  useSensors: vi.fn(() => []),
  MeasuringStrategy: { Always: "always" },
}));

vi.mock("../../components/KanbanColumn", () => ({
  KanbanColumn: ({
    status,
    isHidden,
  }: {
    status: string;
    isHidden?: boolean;
  }) =>
    isHidden ? null : <div data-testid={`column-${status}`}>{status}</div>,
}));

describe("KanbanView", () => {
  const mockOnEditTask = vi.fn();

  const mockTasks: Task[] = [
    {
      id: "task-1",
      title: "Task 1",
      status: "planned",
      priority: "normal",
      tags: [],
      subtasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "task-2",
      title: "Task 2",
      status: "in-progress",
      priority: "high",
      tags: [],
      subtasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useFilterStore).mockReturnValue({
      searchQuery: "",
      statusFilter: "all",
      tagFilter: "all",
      priorityFilter: "all",
      hideArchived: true,
    } as unknown as ReturnType<typeof useFilterStore>);
  });

  it("should render kanban columns", () => {
    render(<KanbanView tasks={mockTasks} onEditTask={mockOnEditTask} />);

    expect(screen.getByTestId("column-backlog")).toBeInTheDocument();
    expect(screen.getByTestId("column-planned")).toBeInTheDocument();
    expect(screen.getByTestId("column-in-progress")).toBeInTheDocument();
    expect(screen.getByTestId("column-completed")).toBeInTheDocument();
  });

  it("should hide archive column when hideArchived is true", () => {
    render(<KanbanView tasks={mockTasks} onEditTask={mockOnEditTask} />);

    // Cancelled column should be hidden when hideArchived is true
    expect(screen.queryByTestId("column-cancelled")).not.toBeInTheDocument();
  });

  it("should show archive column when hideArchived is false", () => {
    vi.mocked(useFilterStore).mockReturnValue({
      searchQuery: "",
      statusFilter: "all",
      tagFilter: "all",
      priorityFilter: "all",
      hideArchived: false,
    } as unknown as ReturnType<typeof useFilterStore>);

    render(<KanbanView tasks={mockTasks} onEditTask={mockOnEditTask} />);

    expect(screen.getByTestId("column-cancelled")).toBeInTheDocument();
  });
});
