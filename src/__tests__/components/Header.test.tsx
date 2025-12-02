import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "../../components/Header";
import { useFilterStore } from "../../store/filterStore";

vi.mock("../../store/filterStore", () => ({
  useFilterStore: vi.fn(),
}));

vi.mock("../../components/ThemeSwitcher", () => ({
  ThemeSwitcher: () => <button>Theme</button>,
}));

vi.mock("../../components/LanguageSwitcher", () => ({
  LanguageSwitcher: () => <button>Lang</button>,
}));

describe("Header", () => {
  const mockSetViewMode = vi.fn();
  const mockSetSearchQuery = vi.fn();
  const mockOnAddTask = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useFilterStore).mockReturnValue({
      viewMode: "list",
      searchQuery: "",
      setViewMode: mockSetViewMode,
      setSearchQuery: mockSetSearchQuery,
    } as unknown as ReturnType<typeof useFilterStore>);
  });

  it("should render title", () => {
    render(<Header onAddTask={mockOnAddTask} />);

    // Uses i18n key "header.title"
    expect(screen.getByText("Todo Planner")).toBeInTheDocument();
  });

  it("should render search input", () => {
    render(<Header onAddTask={mockOnAddTask} />);

    // Uses i18n key "header.search"
    expect(screen.getByPlaceholderText("Search tasks...")).toBeInTheDocument();
  });

  it("should call setSearchQuery on input change", async () => {
    const user = userEvent.setup();
    render(<Header onAddTask={mockOnAddTask} />);

    const input = screen.getByPlaceholderText("Search tasks...");
    await user.type(input, "test");

    expect(mockSetSearchQuery).toHaveBeenCalled();
  });

  it("should render view mode buttons", () => {
    render(<Header onAddTask={mockOnAddTask} />);

    // Uses i18n keys
    expect(
      screen.getByRole("button", { name: /list view/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /kanban view/i })
    ).toBeInTheDocument();
  });

  it("should call setViewMode when view button clicked", () => {
    render(<Header onAddTask={mockOnAddTask} />);

    fireEvent.click(screen.getByRole("button", { name: /kanban view/i }));

    expect(mockSetViewMode).toHaveBeenCalledWith("kanban");
  });

  it("should render Add Task button", () => {
    render(<Header onAddTask={mockOnAddTask} />);

    // Uses i18n key "header.addTask"
    expect(screen.getByText(/add task/i)).toBeInTheDocument();
  });

  it("should call onAddTask when Add Task button clicked", () => {
    render(<Header onAddTask={mockOnAddTask} />);

    fireEvent.click(screen.getByText(/add task/i));

    expect(mockOnAddTask).toHaveBeenCalledTimes(1);
  });
});
