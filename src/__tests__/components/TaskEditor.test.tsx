import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TaskEditor } from "../../components/TaskEditor";
import { useTaskStore } from "../../store/taskStore";
import { Task } from "../../types/task";

vi.mock("../../store/taskStore", () => ({
  useTaskStore: vi.fn(),
}));

describe("TaskEditor", () => {
  const mockAddTask = vi.fn();
  const mockUpdateTask = vi.fn();
  const mockOnClose = vi.fn();

  const mockTask: Task = {
    id: "task-1",
    title: "Existing Task",
    description: "Existing Description",
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
      addTask: mockAddTask,
      updateTask: mockUpdateTask,
      tags: [{ id: "tag-1", name: "Work", color: "#ff0000" }],
      addSubtask: vi.fn(),
      updateSubtask: vi.fn(),
      deleteSubtask: vi.fn(),
    } as unknown as ReturnType<typeof useTaskStore>);
  });

  it("should not render when closed", () => {
    const { container } = render(
      <TaskEditor task={null} isOpen={false} onClose={mockOnClose} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render when open", () => {
    render(<TaskEditor task={null} isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText("New Task")).toBeInTheDocument();
  });

  it("should show edit mode when task provided", () => {
    render(<TaskEditor task={mockTask} isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText("Edit Task")).toBeInTheDocument();
  });

  it("should populate form with task data in edit mode", () => {
    render(<TaskEditor task={mockTask} isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByDisplayValue("Existing Task")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Existing Description")
    ).toBeInTheDocument();
  });

  it("should have title input", () => {
    render(<TaskEditor task={null} isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
  });

  it("should have description textarea", () => {
    render(<TaskEditor task={null} isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it("should have priority select", () => {
    render(<TaskEditor task={null} isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
  });

  it("should have status select", () => {
    render(<TaskEditor task={null} isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
  });

  it("should call onClose when cancel button clicked", () => {
    render(<TaskEditor task={null} isOpen={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should have create button for new task", () => {
    render(<TaskEditor task={null} isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  it("should have update button for existing task", () => {
    render(<TaskEditor task={mockTask} isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText("Update")).toBeInTheDocument();
  });
});
