import { Moon, Sun } from "phosphor-react";
import { useThemeStore } from "../../store/themeStore";
import styles from "./ThemeSwitcher.module.scss";

export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      className={styles.themeSwitcher}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? (
        <Sun size={20} weight="light" />
      ) : (
        <Moon size={20} weight="light" />
      )}
    </button>
  );
};
