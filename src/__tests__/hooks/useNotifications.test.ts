import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useNotifications } from "../../hooks/useNotifications";
import { Task } from "../../types/task";
import { addMinutes } from "date-fns";

describe("useNotifications", () => {
  const originalNotification = (
    globalThis as unknown as { Notification: typeof Notification }
  ).Notification;

  beforeEach(() => {
    vi.useFakeTimers();

    // Mock Notification API
    (globalThis as unknown as { Notification: unknown }).Notification = vi.fn();
    Object.defineProperty(
      (globalThis as unknown as { Notification: unknown }).Notification,
      "permission",
      {
        value: "granted",
        writable: true,
      }
    );
    Object.defineProperty(
      (globalThis as unknown as { Notification: unknown }).Notification,
      "requestPermission",
      {
        value: vi.fn().mockResolvedValue("granted"),
      }
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    (
      globalThis as unknown as { Notification: typeof Notification }
    ).Notification = originalNotification;
  });

  const createTask = (overrides?: Partial<Task>): Task => ({
    id: "task-1",
    title: "Test Task",
    status: "planned",
    priority: "normal",
    tags: [],
    subtasks: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  it("should not schedule notifications when disabled", () => {
    const tasks = [createTask({ deadline: addMinutes(new Date(), 30) })];

    renderHook(() =>
      useNotifications(tasks, { enabled: false, reminderMinutes: [15] })
    );

    expect(
      (globalThis as unknown as { Notification: unknown }).Notification
    ).not.toHaveBeenCalled();
  });

  it("should not schedule notifications for completed tasks", () => {
    const tasks = [
      createTask({
        status: "completed",
        deadline: addMinutes(new Date(), 30),
      }),
    ];

    renderHook(() =>
      useNotifications(tasks, { enabled: true, reminderMinutes: [15] })
    );

    vi.advanceTimersByTime(20 * 60 * 1000);

    expect(
      (globalThis as unknown as { Notification: unknown }).Notification
    ).not.toHaveBeenCalled();
  });

  it("should not schedule notifications for tasks without deadline", () => {
    const tasks = [createTask()];

    renderHook(() =>
      useNotifications(tasks, { enabled: true, reminderMinutes: [15] })
    );

    expect(
      (globalThis as unknown as { Notification: unknown }).Notification
    ).not.toHaveBeenCalled();
  });

  it("should schedule notification for task with future deadline", () => {
    const deadline = addMinutes(new Date(), 30);
    const tasks = [createTask({ deadline })];

    renderHook(() =>
      useNotifications(tasks, { enabled: true, reminderMinutes: [15] })
    );

    // Advance time to trigger the 15-minute reminder
    vi.advanceTimersByTime(16 * 60 * 1000);

    expect(
      (globalThis as unknown as { Notification: unknown }).Notification
    ).toHaveBeenCalledWith(
      "Task Reminder: Test Task",
      expect.objectContaining({
        tag: "task-1-15",
      })
    );
  });

  it("should clear notifications on unmount", () => {
    const deadline = addMinutes(new Date(), 30);
    const tasks = [createTask({ deadline })];

    const { unmount } = renderHook(() =>
      useNotifications(tasks, { enabled: true, reminderMinutes: [15] })
    );

    unmount();

    // Advance time after unmount
    vi.advanceTimersByTime(20 * 60 * 1000);

    // Notification should not be called because timers were cleared
    expect(
      (globalThis as unknown as { Notification: unknown }).Notification
    ).not.toHaveBeenCalled();
  });
});
