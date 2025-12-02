import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { KanbanColumn } from "../../components/KanbanColumn";
import { Task } from "../../types/task";

vi.mock("@dnd-kit/core", () => ({
  useDroppable: () => ({
    setNodeRef: vi.fn(),
    isOver: false,
  }),
}));

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  verticalListSortingStrategy: {},
}));

vi.mock("../../components/KanbanCard", () => ({
  KanbanCard: ({ task }: { task: Task }) => (
    <div data-testid={`card-${task.id}`}>{task.title}</div>
  ),
}));

describe("KanbanColumn", () => {
  const mockOnEditTask = vi.fn();

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
      priority: "high",
      tags: [],
      subtasks: [],
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render column title", () => {
    render(
      <KanbanColumn
        status="planned"
        tasks={mockTasks}
        onEditTask={mockOnEditTask}
      />
    );

    // Uses i18n key "kanban.columnTitles.planned"
    expect(screen.getByText("Planned")).toBeInTheDocument();
  });

  it("should render task count", () => {
    render(
      <KanbanColumn
        status="planned"
        tasks={mockTasks}
        onEditTask={mockOnEditTask}
      />
    );

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should render all tasks", () => {
    render(
      <KanbanColumn
        status="planned"
        tasks={mockTasks}
        onEditTask={mockOnEditTask}
      />
    );

    expect(screen.getByTestId("card-task-1")).toBeInTheDocument();
    expect(screen.getByTestId("card-task-2")).toBeInTheDocument();
  });

  it("should render empty state when no tasks", () => {
    render(
      <KanbanColumn status="planned" tasks={[]} onEditTask={mockOnEditTask} />
    );

    // Uses i18n key "kanban.noTasks"
    expect(screen.getByText(/no tasks/i)).toBeInTheDocument();
  });

  it("should not render when isHidden is true", () => {
    const { container } = render(
      <KanbanColumn
        status="cancelled"
        tasks={mockTasks}
        onEditTask={mockOnEditTask}
        isHidden={true}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
