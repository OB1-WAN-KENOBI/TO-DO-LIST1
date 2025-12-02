import { useState, useRef, useEffect, useId, memo } from "react";
import { CaretDown } from "phosphor-react";
import styles from "./CustomSelect.module.scss";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export const CustomSelect = memo(
  ({
    options,
    value,
    onChange,
    placeholder = "Select...",
    label,
  }: CustomSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const selectRef = useRef<HTMLDivElement>(null);
    const listboxRef = useRef<HTMLDivElement>(null);
    const baseId = useId();
    const listboxId = `${baseId}-listbox`;

    const selectedOption = options.find((opt) => opt.value === value);
    const selectedIndex = options.findIndex((opt) => opt.value === value);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setFocusedIndex(-1);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
      if (isOpen) {
        setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      }
    }, [isOpen, selectedIndex]);

    const handleSelect = (optionValue: string) => {
      onChange(optionValue);
      setIsOpen(false);
      setFocusedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          if (isOpen && focusedIndex >= 0) {
            handleSelect(options[focusedIndex].value);
          } else {
            setIsOpen(!isOpen);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
        case "ArrowDown":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setFocusedIndex((prev) =>
              prev < options.length - 1 ? prev + 1 : 0
            );
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setFocusedIndex((prev) =>
              prev > 0 ? prev - 1 : options.length - 1
            );
          }
          break;
        case "Home":
          if (isOpen) {
            e.preventDefault();
            setFocusedIndex(0);
          }
          break;
        case "End":
          if (isOpen) {
            e.preventDefault();
            setFocusedIndex(options.length - 1);
          }
          break;
      }
    };

    const getOptionId = (index: number) => `${baseId}-option-${index}`;

    return (
      <div className={styles.customSelect} ref={selectRef}>
        <div
          className={`${styles.trigger} ${isOpen ? styles.open : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-activedescendant={
            isOpen && focusedIndex >= 0 ? getOptionId(focusedIndex) : undefined
          }
          aria-label={label}
        >
          <span className={styles.value}>
            {selectedOption?.label || placeholder}
          </span>
          <CaretDown
            size={16}
            weight="bold"
            className={`${styles.icon} ${isOpen ? styles.rotated : ""}`}
          />
        </div>

        {isOpen && (
          <div
            className={styles.dropdown}
            role="listbox"
            id={listboxId}
            ref={listboxRef}
            aria-label={label}
          >
            {options.map((option, index) => (
              <div
                key={option.value}
                id={getOptionId(index)}
                className={`${styles.option} ${
                  option.value === value ? styles.selected : ""
                } ${focusedIndex === index ? styles.focused : ""}`}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setFocusedIndex(index)}
                role="option"
                aria-selected={option.value === value}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);
