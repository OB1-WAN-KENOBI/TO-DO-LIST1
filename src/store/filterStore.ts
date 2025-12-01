import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { FilterState, ViewMode, SortBy } from "../types/filter";
import { TaskStatus, Priority } from "../types/task";

interface FilterStore extends FilterState {
  setViewMode: (mode: ViewMode) => void;
  setDateFilter: (filter: FilterState["dateFilter"]) => void;
  setStatusFilter: (filter: TaskStatus[] | "all") => void;
  setTagFilter: (filter: string[] | "all") => void;
  setPriorityFilter: (filter: Priority[] | "all") => void;
  setSortBy: (sortBy: SortBy) => void;
  setSortOrder: (order: "asc" | "desc") => void;
  setSearchQuery: (query: string) => void;
  setHideArchived: (hide: boolean) => void;
  resetFilters: () => void;
}

const defaultState: FilterState = {
  viewMode: "list",
  dateFilter: "all",
  statusFilter: "all",
  tagFilter: "all",
  priorityFilter: "all",
  sortBy: "created",
  sortOrder: "desc",
  searchQuery: "",
  hideArchived: true,
};

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      ...defaultState,

      setViewMode: (mode) => set({ viewMode: mode }),

      setDateFilter: (filter) => set({ dateFilter: filter }),

      setStatusFilter: (filter) => set({ statusFilter: filter }),

      setTagFilter: (filter) => set({ tagFilter: filter }),

      setPriorityFilter: (filter) => set({ priorityFilter: filter }),

      setSortBy: (sortBy) => set({ sortBy }),

      setSortOrder: (order) => set({ sortOrder: order }),

      setSearchQuery: (query) => set({ searchQuery: query }),

      setHideArchived: (hide) => set({ hideArchived: hide }),

      resetFilters: () => set(defaultState),
    }),
    {
      name: "todo-filter-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
