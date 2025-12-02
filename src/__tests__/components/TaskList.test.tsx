import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TaskList } from "../../components/TaskList";
import { useFilterStore } from "../../store/filterStore";
import { Task } from "../../types/task";

vi.mock("../../store/filterStore", () => ({
  useFilterStore: vi.fn(),
}));

vi.mock("../../components/TaskItem", () => ({
  TaskItem: ({ task }: { task: Task }) => (
    <div data-testid={`task-${task.id}`}>{task.title}</div>
  ),
}));

describe("TaskList", () => {
  const mockOnEditTask = vi.fn();

  const mockTasks: Task[] = [
    {
      id: "task-1",
      title: "Task 1",
      status: "planned",
      priority: "high",
      tags: [],
      subtasks: [],
      createdAt: new Date("2025-01-01"),
      updatedAt: new Date("2025-01-01"),
    },
    {
      id: "task-2",
      title: "Task 2",
      status: "in-progress",
      priority: "normal",
      tags: [],
      subtasks: [],
      createdAt: new Date("2025-01-02"),
      updatedAt: new Date("2025-01-02"),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useFilterStore).mockReturnValue({
      searchQuery: "",
      statusFilter: "all",
      tagFilter: "all",
      priorityFilter: "all",
      dateFilter: "all",
      sortBy: "created",
      sortOrder: "desc",
    } as unknown as ReturnType<typeof useFilterStore>);
  });

  it("should render all tasks in later group (no deadline)", () => {
    render(<TaskList tasks={mockTasks} onEditTask={mockOnEditTask} />);

    // Tasks without deadline go to "Later" group
    expect(screen.getByText("Later")).toBeInTheDocument();
    expect(screen.getByTestId("task-task-1")).toBeInTheDocument();
    expect(screen.getByTestId("task-task-2")).toBeInTheDocument();
  });

  it("should render empty state when no tasks", () => {
    render(<TaskList tasks={[]} onEditTask={mockOnEditTask} />);

    expect(screen.getByText(/no tasks/i)).toBeInTheDocument();
  });

  it("should filter tasks by search query", () => {
    vi.mocked(useFilterStore).mockReturnValue({
      searchQuery: "Task 1",
      statusFilter: "all",
      tagFilter: "all",
      priorityFilter: "all",
      dateFilter: "all",
      sortBy: "created",
      sortOrder: "desc",
    } as unknown as ReturnType<typeof useFilterStore>);

    render(<TaskList tasks={mockTasks} onEditTask={mockOnEditTask} />);

    expect(screen.getByTestId("task-task-1")).toBeInTheDocument();
    expect(screen.queryByTestId("task-task-2")).not.toBeInTheDocument();
  });

  it("should filter tasks by status", () => {
    vi.mocked(useFilterStore).mockReturnValue({
      searchQuery: "",
      statusFilter: ["planned"],
      tagFilter: "all",
      priorityFilter: "all",
      dateFilter: "all",
      sortBy: "created",
      sortOrder: "desc",
    } as unknown as ReturnType<typeof useFilterStore>);

    render(<TaskList tasks={mockTasks} onEditTask={mockOnEditTask} />);

    expect(screen.getByTestId("task-task-1")).toBeInTheDocument();
    expect(screen.queryByTestId("task-task-2")).not.toBeInTheDocument();
  });

  it("should filter tasks by priority", () => {
    vi.mocked(useFilterStore).mockReturnValue({
      searchQuery: "",
      statusFilter: "all",
      tagFilter: "all",
      priorityFilter: ["high"],
      dateFilter: "all",
      sortBy: "created",
      sortOrder: "desc",
    } as unknown as ReturnType<typeof useFilterStore>);

    render(<TaskList tasks={mockTasks} onEditTask={mockOnEditTask} />);

    expect(screen.getByTestId("task-task-1")).toBeInTheDocument();
    expect(screen.queryByTestId("task-task-2")).not.toBeInTheDocument();
  });
});
