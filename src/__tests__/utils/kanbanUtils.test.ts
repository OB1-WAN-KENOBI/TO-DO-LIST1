import { describe, it, expect } from "vitest";
import {
  KANBAN_COLUMNS,
  mapToKanbanStatus,
  kanbanToTaskStatus,
  getVisibleColumns,
} from "../../utils/kanbanUtils";

describe("kanbanUtils", () => {
  describe("KANBAN_COLUMNS", () => {
    it("should have 5 columns", () => {
      expect(KANBAN_COLUMNS).toHaveLength(5);
    });

    it("should have correct column statuses", () => {
      const statuses = KANBAN_COLUMNS.map((col) => col.status);
      expect(statuses).toEqual([
        "backlog",
        "planned",
        "in-progress",
        "completed",
        "cancelled",
      ]);
    });

    it("should have cancelled column hidden", () => {
      const cancelledColumn = KANBAN_COLUMNS.find(
        (col) => col.status === "cancelled"
      );
      expect(cancelledColumn?.hidden).toBe(true);
    });
  });

  describe("mapToKanbanStatus", () => {
    it("should map backlog to backlog", () => {
      expect(mapToKanbanStatus("backlog")).toBe("backlog");
    });

    it("should map planned to planned", () => {
      expect(mapToKanbanStatus("planned")).toBe("planned");
    });

    it("should map in-progress to in-progress", () => {
      expect(mapToKanbanStatus("in-progress")).toBe("in-progress");
    });

    it("should map completed to completed", () => {
      expect(mapToKanbanStatus("completed")).toBe("completed");
    });

    it("should map cancelled to cancelled", () => {
      expect(mapToKanbanStatus("cancelled")).toBe("cancelled");
    });
  });

  describe("kanbanToTaskStatus", () => {
    it("should map backlog to backlog", () => {
      expect(kanbanToTaskStatus("backlog")).toBe("backlog");
    });

    it("should map planned to planned", () => {
      expect(kanbanToTaskStatus("planned")).toBe("planned");
    });

    it("should map in-progress to in-progress", () => {
      expect(kanbanToTaskStatus("in-progress")).toBe("in-progress");
    });

    it("should map completed to completed", () => {
      expect(kanbanToTaskStatus("completed")).toBe("completed");
    });

    it("should map cancelled to cancelled", () => {
      expect(kanbanToTaskStatus("cancelled")).toBe("cancelled");
    });
  });

  describe("getVisibleColumns", () => {
    it("should return all columns when hideArchived is false", () => {
      const columns = getVisibleColumns(false);
      expect(columns).toHaveLength(5);
    });

    it("should hide cancelled column when hideArchived is true", () => {
      const columns = getVisibleColumns(true);
      expect(columns).toHaveLength(4);
      expect(columns.find((col) => col.status === "cancelled")).toBeUndefined();
    });
  });
});
