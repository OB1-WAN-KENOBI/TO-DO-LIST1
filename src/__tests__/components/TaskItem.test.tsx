import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskItem } from "../../components/TaskItem";
import { useTaskStore } from "../../store/taskStore";
import { Task } from "../../types/task";

vi.mock("../../store/taskStore", () => ({
  useTaskStore: vi.fn(),
}));

describe("TaskItem", () => {
  const mockToggleStatus = vi.fn();
  const mockDeleteTask = vi.fn();
  const mockOnEdit = vi.fn();

  const mockTask: Task = {
    id: "task-1",
    title: "Test Task",
    description: "Test Description",
    status: "planned",
    priority: "normal",
    tags: [],
    subtasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTaskStore).mockReturnValue({
      toggleStatus: mockToggleStatus,
      deleteTask: mockDeleteTask,
      tags: [],
    } as unknown as ReturnType<typeof useTaskStore>);
  });

  it("should render task title", () => {
    render(<TaskItem task={mockTask} onEdit={mockOnEdit} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("should render task description", () => {
    render(<TaskItem task={mockTask} onEdit={mockOnEdit} />);

    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("should render toggle button", () => {
    render(<TaskItem task={mockTask} onEdit={mockOnEdit} />);

    // The checkbox is a button with aria-label
    expect(
      screen.getByRole("button", { name: /mark as/i })
    ).toBeInTheDocument();
  });

  it("should call toggleStatus on toggle button click", () => {
    render(<TaskItem task={mockTask} onEdit={mockOnEdit} />);

    fireEvent.click(screen.getByRole("button", { name: /mark as/i }));

    expect(mockToggleStatus).toHaveBeenCalledWith("task-1");
  });

  it("should call onEdit when edit button clicked", () => {
    render(<TaskItem task={mockTask} onEdit={mockOnEdit} />);

    const editButton = screen.getByRole("button", { name: /edit/i });
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it("should call deleteTask when delete button clicked", () => {
    render(<TaskItem task={mockTask} onEdit={mockOnEdit} />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockDeleteTask).toHaveBeenCalledWith("task-1");
  });

  it("should show priority badge", () => {
    const highPriorityTask = { ...mockTask, priority: "high" as const };
    render(<TaskItem task={highPriorityTask} onEdit={mockOnEdit} />);

    // Uses i18n key "common.priority.high"
    expect(screen.getByText("High")).toBeInTheDocument();
  });
});
