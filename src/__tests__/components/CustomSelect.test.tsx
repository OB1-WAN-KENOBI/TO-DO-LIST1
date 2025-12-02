import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomSelect } from "../../components/CustomSelect";

describe("CustomSelect", () => {
  const defaultProps = {
    options: [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ],
    value: "option1",
    onChange: vi.fn(),
  };

  it("should render with selected value", () => {
    render(<CustomSelect {...defaultProps} />);

    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("should render placeholder when no value", () => {
    render(<CustomSelect {...defaultProps} value="" placeholder="Select..." />);

    expect(screen.getByText("Select...")).toBeInTheDocument();
  });

  it("should open dropdown on click", async () => {
    const user = userEvent.setup();
    render(<CustomSelect {...defaultProps} />);

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("should call onChange when option is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CustomSelect {...defaultProps} onChange={onChange} />);

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);

    const option2 = screen.getByText("Option 2");
    await user.click(option2);

    expect(onChange).toHaveBeenCalledWith("option2");
  });

  it("should close dropdown after selection", async () => {
    const user = userEvent.setup();
    render(<CustomSelect {...defaultProps} />);

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    await user.click(screen.getByText("Option 2"));

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("should close dropdown on Escape key", async () => {
    const user = userEvent.setup();
    render(<CustomSelect {...defaultProps} />);

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("should navigate with arrow keys", async () => {
    const user = userEvent.setup();
    render(<CustomSelect {...defaultProps} />);

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it("should have correct aria attributes", () => {
    render(<CustomSelect {...defaultProps} label="Test Label" />);

    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).toHaveAttribute("aria-label", "Test Label");
  });

  it("should mark selected option with aria-selected", async () => {
    const user = userEvent.setup();
    render(<CustomSelect {...defaultProps} />);

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);

    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(options[1]).toHaveAttribute("aria-selected", "false");
  });
});
