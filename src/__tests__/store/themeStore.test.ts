import { describe, it, expect, beforeEach, vi } from "vitest";
import { useThemeStore } from "../../store/themeStore";

describe("themeStore", () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: "dark" });
    vi.clearAllMocks();
  });

  describe("theme", () => {
    it("should have default theme as dark", () => {
      expect(useThemeStore.getState().theme).toBe("dark");
    });
  });

  describe("setTheme", () => {
    it("should set theme to light", () => {
      useThemeStore.getState().setTheme("light");
      expect(useThemeStore.getState().theme).toBe("light");
    });

    it("should set theme to dark", () => {
      useThemeStore.setState({ theme: "light" });
      useThemeStore.getState().setTheme("dark");
      expect(useThemeStore.getState().theme).toBe("dark");
    });

    it("should set data-theme attribute on document", () => {
      useThemeStore.getState().setTheme("light");
      expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    });
  });

  describe("toggleTheme", () => {
    it("should toggle from dark to light", () => {
      useThemeStore.setState({ theme: "dark" });
      useThemeStore.getState().toggleTheme();
      expect(useThemeStore.getState().theme).toBe("light");
    });

    it("should toggle from light to dark", () => {
      useThemeStore.setState({ theme: "light" });
      useThemeStore.getState().toggleTheme();
      expect(useThemeStore.getState().theme).toBe("dark");
    });

    it("should set data-theme attribute when toggling", () => {
      useThemeStore.setState({ theme: "dark" });
      useThemeStore.getState().toggleTheme();
      expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    });
  });
});
