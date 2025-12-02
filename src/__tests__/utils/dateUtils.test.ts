import { describe, it, expect } from "vitest";
import {
  isOverdue,
  getTaskDateGroup,
  formatTaskDate,
  formatTaskTime,
  getNextRepeatDate,
} from "../../utils/dateUtils";
import { Task } from "../../types/task";
import { addDays, subDays } from "date-fns";

describe("dateUtils", () => {
  describe("isOverdue", () => {
    it("should return false for null deadline", () => {
      expect(isOverdue(null)).toBe(false);
    });

    it("should return false for undefined deadline", () => {
      expect(isOverdue(undefined)).toBe(false);
    });

    it("should return false for today", () => {
      expect(isOverdue(new Date())).toBe(false);
    });

    it("should return false for future date", () => {
      expect(isOverdue(addDays(new Date(), 1))).toBe(false);
    });

    it("should return true for past date", () => {
      expect(isOverdue(subDays(new Date(), 2))).toBe(true);
    });
  });

  describe("getTaskDateGroup", () => {
    const createTask = (deadline: Date | null): Task => ({
      id: "test",
      title: "Test",
      status: "planned",
      priority: "normal",
      tags: [],
      subtasks: [],
      deadline,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    it("should return later for task without deadline", () => {
      expect(getTaskDateGroup(createTask(null))).toBe("later");
    });

    it("should return today for task due today", () => {
      expect(getTaskDateGroup(createTask(new Date()))).toBe("today");
    });

    it("should return tomorrow for task due tomorrow", () => {
      expect(getTaskDateGroup(createTask(addDays(new Date(), 1)))).toBe(
        "tomorrow"
      );
    });

    it("should return overdue for past deadline", () => {
      expect(getTaskDateGroup(createTask(subDays(new Date(), 2)))).toBe(
        "overdue"
      );
    });
  });

  describe("formatTaskDate", () => {
    it("should return empty string for null", () => {
      expect(formatTaskDate(null)).toBe("");
    });

    it("should return empty string for undefined", () => {
      expect(formatTaskDate(undefined)).toBe("");
    });

    it("should return Today for today", () => {
      expect(formatTaskDate(new Date())).toBe("Today");
    });

    it("should return Tomorrow for tomorrow", () => {
      expect(formatTaskDate(addDays(new Date(), 1))).toBe("Tomorrow");
    });

    it("should return formatted date for other dates", () => {
      const date = new Date(2025, 5, 15); // June 15, 2025
      expect(formatTaskDate(date)).toBe("Jun 15, 2025");
    });
  });

  describe("formatTaskTime", () => {
    it("should return empty string for null", () => {
      expect(formatTaskTime(null)).toBe("");
    });

    it("should return empty string for undefined", () => {
      expect(formatTaskTime(undefined)).toBe("");
    });

    it("should return formatted time", () => {
      const date = new Date(2025, 0, 1, 14, 30);
      expect(formatTaskTime(date)).toBe("14:30");
    });
  });

  describe("getNextRepeatDate", () => {
    const createTask = (
      repeatType: "daily" | "weekly" | "monthly" | "custom" | "none",
      interval?: number
    ): Task => ({
      id: "test",
      title: "Test",
      status: "planned",
      priority: "normal",
      tags: [],
      subtasks: [],
      deadline: new Date(2025, 0, 1),
      repeatRule: {
        type: repeatType,
        interval,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    it("should return null for task without repeat rule", () => {
      const task: Task = {
        id: "test",
        title: "Test",
        status: "planned",
        priority: "normal",
        tags: [],
        subtasks: [],
        deadline: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(getNextRepeatDate(task)).toBe(null);
    });

    it("should return null for repeat type none", () => {
      expect(getNextRepeatDate(createTask("none"))).toBe(null);
    });

    it("should return next day for daily repeat", () => {
      const task = createTask("daily");
      const nextDate = getNextRepeatDate(task);
      expect(nextDate).toBeInstanceOf(Date);
      expect(nextDate?.getDate()).toBe(2);
    });

    it("should return next week for weekly repeat", () => {
      const task = createTask("weekly", 1);
      const nextDate = getNextRepeatDate(task);
      expect(nextDate).toBeInstanceOf(Date);
      expect(nextDate?.getDate()).toBe(8);
    });

    it("should return next month for monthly repeat", () => {
      const task = createTask("monthly", 1);
      const nextDate = getNextRepeatDate(task);
      expect(nextDate).toBeInstanceOf(Date);
      expect(nextDate?.getMonth()).toBe(1);
    });
  });
});
