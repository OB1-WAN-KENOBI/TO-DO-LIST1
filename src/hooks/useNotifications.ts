import { useEffect, useRef } from "react";
import { Task } from "../types/task";
import { formatTaskDate, formatTaskTime } from "../utils/dateUtils";

interface NotificationOptions {
  enabled: boolean;
  reminderMinutes: number[];
}

export const useNotifications = (
  tasks: Task[],
  options: NotificationOptions = {
    enabled: true,
    reminderMinutes: [15, 60, 1440],
  }
) => {
  const notificationPermissionRef = useRef<NotificationPermission | null>(null);
  const scheduledNotificationsRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return;
    }

    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        notificationPermissionRef.current = permission;
      });
    } else {
      notificationPermissionRef.current = Notification.permission;
    }
  }, []);

  useEffect(() => {
    if (!options.enabled || notificationPermissionRef.current !== "granted") {
      return;
    }

    const now = new Date();
    const scheduled = new Map<string, number>();

    tasks.forEach((task) => {
      if (
        !task.deadline ||
        task.status === "completed" ||
        task.status === "cancelled"
      ) {
        return;
      }

      // Ensure deadline is a Date object
      const deadline =
        task.deadline instanceof Date ? task.deadline : new Date(task.deadline);

      // Skip if date is invalid
      if (isNaN(deadline.getTime())) {
        return;
      }

      options.reminderMinutes.forEach((minutes) => {
        const reminderTime = new Date(deadline.getTime() - minutes * 60 * 1000);

        if (reminderTime > now) {
          const notificationId = `${task.id}-${minutes}`;
          const existingTimeout =
            scheduledNotificationsRef.current.get(notificationId);

          if (existingTimeout) {
            clearTimeout(existingTimeout);
          }

          const timeoutId = window.setTimeout(() => {
            new Notification(`Task Reminder: ${task.title}`, {
              body: `Due ${formatTaskDate(deadline)} at ${formatTaskTime(
                deadline
              )}`,
              icon: "/favicon.ico",
              tag: notificationId,
              requireInteraction: false,
            });
          }, reminderTime.getTime() - now.getTime());

          scheduled.set(notificationId, timeoutId);
        }
      });
    });

    scheduledNotificationsRef.current.forEach((timeoutId, id) => {
      if (!scheduled.has(id)) {
        clearTimeout(timeoutId);
      }
    });

    scheduledNotificationsRef.current = scheduled;

    return () => {
      scheduledNotificationsRef.current.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      scheduledNotificationsRef.current.clear();
    };
  }, [tasks, options.enabled, options.reminderMinutes]);
};
