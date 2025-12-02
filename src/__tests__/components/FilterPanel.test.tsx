import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FilterPanel } from "../../components/FilterPanel";
import { useFilterStore } from "../../store/filterStore";

vi.mock("../../store/filterStore", () => ({
  useFilterStore: vi.fn(),
}));

describe("FilterPanel", () => {
  const mockSetDateFilter = vi.fn();
  const mockSetStatusFilter = vi.fn();
  const mockSetPriorityFilter = vi.fn();
  const mockSetSortBy = vi.fn();
  const mockSetSortOrder = vi.fn();
  const mockSetHideArchived = vi.fn();
  const mockResetFilters = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useFilterStore).mockReturnValue({
      dateFilter: "all",
      statusFilter: "all",
      tagFilter: "all",
      priorityFilter: "all",
      sortBy: "created",
      sortOrder: "desc",
      hideArchived: true,
      setDateFilter: mockSetDateFilter,
      setStatusFilter: mockSetStatusFilter,
      setPriorityFilter: mockSetPriorityFilter,
      setSortBy: mockSetSortBy,
      setSortOrder: mockSetSortOrder,
      setHideArchived: mockSetHideArchived,
      resetFilters: mockResetFilters,
    } as unknown as ReturnType<typeof useFilterStore>);
  });

  it("should render date filter section", () => {
    render(<FilterPanel />);

    // Uses i18n key "filter.dateFilter"
    expect(screen.getByText("Date Filter")).toBeInTheDocument();
  });

  it("should render status filter section", () => {
    render(<FilterPanel />);

    // Uses i18n key "filter.status"
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("should render priority filter section", () => {
    render(<FilterPanel />);

    // Uses i18n key "filter.priority"
    expect(screen.getByText("Priority")).toBeInTheDocument();
  });

  it("should render sort section", () => {
    render(<FilterPanel />);

    // Uses i18n key "filter.sortBy"
    expect(screen.getByText("Sort By")).toBeInTheDocument();
  });

  it("should toggle sort order on button click", () => {
    render(<FilterPanel />);

    // Find sort button by aria-label
    const sortButton = screen.getByRole("button", { name: /sort/i });
    fireEvent.click(sortButton);

    expect(mockSetSortOrder).toHaveBeenCalledWith("asc");
  });

  it("should render hide archived checkbox", () => {
    render(<FilterPanel />);

    // Uses i18n key "filter.hideArchived"
    expect(screen.getByText("Hide Archived")).toBeInTheDocument();
  });

  it("should call setHideArchived on checkbox change", () => {
    render(<FilterPanel />);

    const checkbox = screen.getByRole("checkbox", { name: /hide archived/i });
    fireEvent.click(checkbox);

    expect(mockSetHideArchived).toHaveBeenCalledWith(false);
  });

  it("should render reset button", () => {
    render(<FilterPanel />);

    // Uses i18n key "filter.resetFilters"
    expect(screen.getByText("Reset Filters")).toBeInTheDocument();
  });

  it("should call resetFilters on reset button click", () => {
    render(<FilterPanel />);

    fireEvent.click(screen.getByText("Reset Filters"));

    expect(mockResetFilters).toHaveBeenCalledTimes(1);
  });
});
