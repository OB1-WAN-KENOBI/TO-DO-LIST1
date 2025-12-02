import { describe, it, expect, beforeEach } from "vitest";
import { useFilterStore } from "../../store/filterStore";

describe("filterStore", () => {
  beforeEach(() => {
    useFilterStore.getState().resetFilters();
  });

  describe("viewMode", () => {
    it("should have default viewMode as list", () => {
      expect(useFilterStore.getState().viewMode).toBe("list");
    });

    it("should set viewMode", () => {
      useFilterStore.getState().setViewMode("kanban");
      expect(useFilterStore.getState().viewMode).toBe("kanban");
    });
  });

  describe("dateFilter", () => {
    it("should have default dateFilter as all", () => {
      expect(useFilterStore.getState().dateFilter).toBe("all");
    });

    it("should set dateFilter", () => {
      useFilterStore.getState().setDateFilter("today");
      expect(useFilterStore.getState().dateFilter).toBe("today");
    });
  });

  describe("statusFilter", () => {
    it("should have default statusFilter as all", () => {
      expect(useFilterStore.getState().statusFilter).toBe("all");
    });

    it("should set statusFilter to array", () => {
      useFilterStore.getState().setStatusFilter(["planned", "in-progress"]);
      expect(useFilterStore.getState().statusFilter).toEqual([
        "planned",
        "in-progress",
      ]);
    });

    it("should set statusFilter to all", () => {
      useFilterStore.getState().setStatusFilter(["planned"]);
      useFilterStore.getState().setStatusFilter("all");
      expect(useFilterStore.getState().statusFilter).toBe("all");
    });
  });

  describe("tagFilter", () => {
    it("should have default tagFilter as all", () => {
      expect(useFilterStore.getState().tagFilter).toBe("all");
    });

    it("should set tagFilter to array", () => {
      useFilterStore.getState().setTagFilter(["tag-1", "tag-2"]);
      expect(useFilterStore.getState().tagFilter).toEqual(["tag-1", "tag-2"]);
    });
  });

  describe("priorityFilter", () => {
    it("should have default priorityFilter as all", () => {
      expect(useFilterStore.getState().priorityFilter).toBe("all");
    });

    it("should set priorityFilter to array", () => {
      useFilterStore.getState().setPriorityFilter(["high", "normal"]);
      expect(useFilterStore.getState().priorityFilter).toEqual([
        "high",
        "normal",
      ]);
    });
  });

  describe("sorting", () => {
    it("should have default sortBy as created", () => {
      expect(useFilterStore.getState().sortBy).toBe("created");
    });

    it("should have default sortOrder as desc", () => {
      expect(useFilterStore.getState().sortOrder).toBe("desc");
    });

    it("should set sortBy", () => {
      useFilterStore.getState().setSortBy("deadline");
      expect(useFilterStore.getState().sortBy).toBe("deadline");
    });

    it("should set sortOrder", () => {
      useFilterStore.getState().setSortOrder("asc");
      expect(useFilterStore.getState().sortOrder).toBe("asc");
    });
  });

  describe("searchQuery", () => {
    it("should have default searchQuery as empty string", () => {
      expect(useFilterStore.getState().searchQuery).toBe("");
    });

    it("should set searchQuery", () => {
      useFilterStore.getState().setSearchQuery("test query");
      expect(useFilterStore.getState().searchQuery).toBe("test query");
    });
  });

  describe("hideArchived", () => {
    it("should have default hideArchived as true", () => {
      expect(useFilterStore.getState().hideArchived).toBe(true);
    });

    it("should set hideArchived", () => {
      useFilterStore.getState().setHideArchived(false);
      expect(useFilterStore.getState().hideArchived).toBe(false);
    });
  });

  describe("resetFilters", () => {
    it("should reset all filters to default values", () => {
      // Change all values
      useFilterStore.getState().setViewMode("kanban");
      useFilterStore.getState().setDateFilter("today");
      useFilterStore.getState().setStatusFilter(["planned"]);
      useFilterStore.getState().setTagFilter(["tag-1"]);
      useFilterStore.getState().setPriorityFilter(["high"]);
      useFilterStore.getState().setSortBy("deadline");
      useFilterStore.getState().setSortOrder("asc");
      useFilterStore.getState().setSearchQuery("test");
      useFilterStore.getState().setHideArchived(false);

      // Reset
      useFilterStore.getState().resetFilters();

      // Check all default values
      const state = useFilterStore.getState();
      expect(state.viewMode).toBe("list");
      expect(state.dateFilter).toBe("all");
      expect(state.statusFilter).toBe("all");
      expect(state.tagFilter).toBe("all");
      expect(state.priorityFilter).toBe("all");
      expect(state.sortBy).toBe("created");
      expect(state.sortOrder).toBe("desc");
      expect(state.searchQuery).toBe("");
      expect(state.hideArchived).toBe(true);
    });
  });
});
