import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Initialize i18n for tests
i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      translation: {
        header: {
          title: "Todo Planner",
          searchPlaceholder: "Search tasks...",
          addTask: "Add Task",
          listView: "List view",
          kanbanView: "Kanban view",
          calendarView: "Calendar view",
          timelineView: "Timeline view",
          switchToLightTheme: "Switch to light theme",
          switchToDarkTheme: "Switch to dark theme",
        },
        filter: {
          dateFilter: "Date Filter",
          status: "Status",
          priority: "Priority",
          sortBy: "Sort By",
          hideArchived: "Hide Archived",
          resetFilters: "Reset Filters",
          all: "All",
          sortAsc: "Sort ascending",
          sortDesc: "Sort descending",
          dateOptions: {
            all: "All",
            today: "Today",
            tomorrow: "Tomorrow",
            week: "This Week",
            month: "This Month",
            overdue: "Overdue",
          },
          statusOptions: {
            backlog: "Backlog",
            planned: "Planned",
            "in-progress": "In Progress",
            completed: "Completed",
            cancelled: "Cancelled",
          },
          priorityOptions: {
            low: "Low",
            normal: "Normal",
            high: "High",
          },
          sortOptions: {
            created: "Created",
            deadline: "Deadline",
            priority: "Priority",
            status: "Status",
            title: "Title",
          },
        },
        kanban: {
          columnTitles: {
            backlog: "Backlog",
            planned: "Planned",
            "in-progress": "In Progress",
            completed: "Done",
            cancelled: "Archived",
          },
          noTasks: "No tasks",
        },
        taskEditor: {
          newTask: "New Task",
          editTask: "Edit Task",
          title: "Title",
          enterTitle: "Enter task title",
          description: "Description",
          enterDescription: "Enter description",
          deadline: "Deadline",
          startDate: "Start Date",
          notes: "Notes",
          additionalNotes: "Additional notes",
          subtasks: "Subtasks",
          tags: "Tags",
          enterTags: "Enter tags (comma separated)",
          labels: "Labels",
          enterLabels: "Enter labels (comma separated)",
          status: "Status",
          priority: "Priority",
          repeat: "Repeat",
          interval: "Interval",
          create: "Create",
          update: "Update",
          cancel: "Cancel",
        },
        taskItem: {
          editTask: "Edit task",
          deleteTask: "Delete task",
          markComplete: "Mark as complete",
          markIncomplete: "Mark as incomplete",
          confirmDelete: "Are you sure you want to delete this task?",
        },
        taskList: {
          noTasksFound: "No tasks found",
          overdue: "Overdue",
          today: "Today",
          tomorrow: "Tomorrow",
          thisWeek: "This Week",
          later: "Later",
        },
        timeline: {
          todayTimeline: "Today's Timeline",
        },
        calendar: {
          today: "Today",
          prev: "Prev",
          next: "Next",
        },
        common: {
          noTasks: "No tasks",
          loading: "Loading...",
          error: "Something went wrong",
          tryAgain: "Try again",
          due: "Due",
          start: "Start",
          subtasks: "Subtasks",
          status: {
            backlog: "Backlog",
            planned: "Planned",
            "in-progress": "In Progress",
            completed: "Completed",
            cancelled: "Cancelled",
          },
          priority: {
            low: "Low",
            normal: "Normal",
            high: "High",
          },
          repeatType: {
            none: "No repeat",
            daily: "Daily",
            weekly: "Weekly",
            monthly: "Monthly",
            custom: "Custom",
          },
        },
        errorBoundary: {
          title: "Something went wrong",
          message: "An unexpected error occurred",
          tryAgain: "Try Again",
        },
        language: {
          switchToEnglish: "Switch to English",
          switchToRussian: "Switch to Russian",
        },
      },
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock window.confirm
window.confirm = vi.fn(() => true);
