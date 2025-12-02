import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { KanbanCard } from "../../components/KanbanCard";
import { useTaskStore } from "../../store/taskStore";
import { Task } from "../../types/task";

vi.mock("../../store/taskStore", () => ({
  useTaskStore: vi.fn(),
}));

vi.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

vi.mock("@dnd-kit/utilities", () => ({
  CSS: {
    Transform: {
      toString: () => null,
    },
  },
}));

describe("KanbanCard", () => {
  const mockOnEdit = vi.fn();

  const mockTask: Task = {
    id: "task-1",
    title: "Test Task",
    description: "Test Description",
    status: "planned",
    priority: "normal",
    tags: ["tag-1"],
    subtasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTaskStore).mockReturnValue({
      tags: [{ id: "tag-1", name: "Work", color: "#ff0000" }],
    } as unknown as ReturnType<typeof useTaskStore>);
  });

  it("should render task title", () => {
    render(<KanbanCard task={mockTask} onEdit={mockOnEdit} />);

    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("should render task description", () => {
    render(<KanbanCard task={mockTask} onEdit={mockOnEdit} />);

    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("should render priority badge", () => {
    render(<KanbanCard task={mockTask} onEdit={mockOnEdit} />);

    // Uses i18n key "common.priority.normal"
    expect(screen.getByText("Normal")).toBeInTheDocument();
  });

  it("should render tags", () => {
    render(<KanbanCard task={mockTask} onEdit={mockOnEdit} />);

    expect(screen.getByText("Work")).toBeInTheDocument();
  });

  it("should call onEdit when title clicked", () => {
    render(<KanbanCard task={mockTask} onEdit={mockOnEdit} />);

    fireEvent.click(screen.getByText("Test Task"));

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it("should render subtasks count when present", () => {
    const taskWithSubtasks: Task = {
      ...mockTask,
      subtasks: [
        {
          id: "sub-1",
          title: "Subtask 1",
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "sub-2",
          title: "Subtask 2",
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    render(<KanbanCard task={taskWithSubtasks} onEdit={mockOnEdit} />);

    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });

  it("should apply high priority class", () => {
    const highPriorityTask = { ...mockTask, priority: "high" as const };
    render(<KanbanCard task={highPriorityTask} onEdit={mockOnEdit} />);

    // Uses i18n key "common.priority.high"
    expect(screen.getByText("High")).toBeInTheDocument();
  });
});
