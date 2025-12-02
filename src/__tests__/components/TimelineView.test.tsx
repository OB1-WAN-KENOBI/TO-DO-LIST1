import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TimelineView } from "../../components/TimelineView";
import { Task } from "../../types/task";

vi.mock("../../components/TaskItem", () => ({
  TaskItem: ({ task }: { task: Task }) => (
    <div data-testid={`task-${task.id}`}>{task.title}</div>
  ),
}));

describe("TimelineView", () => {
  const mockOnEditTask = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render timeline title", () => {
    render(<TimelineView tasks={[]} onEditTask={mockOnEditTask} />);

    expect(screen.getByText("Today's Timeline")).toBeInTheDocument();
  });

  it("should render hour slots", () => {
    render(<TimelineView tasks={[]} onEditTask={mockOnEditTask} />);

    // Should render 24 hour slots
    expect(screen.getByText("00:00")).toBeInTheDocument();
    expect(screen.getByText("12:00")).toBeInTheDocument();
    expect(screen.getByText("23:00")).toBeInTheDocument();
  });

  it("should render tasks in correct hour slots", () => {
    const now = new Date();
    now.setHours(10, 0, 0, 0);

    const mockTasks: Task[] = [
      {
        id: "task-1",
        title: "Morning Task",
        status: "planned",
        priority: "normal",
        tags: [],
        subtasks: [],
        startDate: now,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    render(<TimelineView tasks={mockTasks} onEditTask={mockOnEditTask} />);

    expect(screen.getByTestId("task-task-1")).toBeInTheDocument();
  });

  it("should not show tasks without startDate", () => {
    const mockTasks: Task[] = [
      {
        id: "task-1",
        title: "No Start Date Task",
        status: "planned",
        priority: "normal",
        tags: [],
        subtasks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    render(<TimelineView tasks={mockTasks} onEditTask={mockOnEditTask} />);

    expect(screen.queryByTestId("task-task-1")).not.toBeInTheDocument();
  });
});
