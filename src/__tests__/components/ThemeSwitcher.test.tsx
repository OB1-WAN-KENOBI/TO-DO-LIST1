import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeSwitcher } from "../../components/ThemeSwitcher";
import { useThemeStore } from "../../store/themeStore";

vi.mock("../../store/themeStore", () => ({
  useThemeStore: vi.fn(),
}));

describe("ThemeSwitcher", () => {
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render button for dark theme", () => {
    vi.mocked(useThemeStore).mockReturnValue({
      theme: "dark",
      toggleTheme: mockToggleTheme,
    } as unknown as ReturnType<typeof useThemeStore>);

    render(<ThemeSwitcher />);

    const button = screen.getByRole("button");
    // Uses i18n key which translates to "Switch to light theme"
    expect(button).toBeInTheDocument();
  });

  it("should render button for light theme", () => {
    vi.mocked(useThemeStore).mockReturnValue({
      theme: "light",
      toggleTheme: mockToggleTheme,
    } as unknown as ReturnType<typeof useThemeStore>);

    render(<ThemeSwitcher />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should call toggleTheme on click", () => {
    vi.mocked(useThemeStore).mockReturnValue({
      theme: "dark",
      toggleTheme: mockToggleTheme,
    } as unknown as ReturnType<typeof useThemeStore>);

    render(<ThemeSwitcher />);

    fireEvent.click(screen.getByRole("button"));

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
