import { useTranslation } from "react-i18next";
import { Moon, Sun } from "phosphor-react";
import { useThemeStore } from "../../store/themeStore";
import styles from "./ThemeSwitcher.module.scss";

export const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      className={styles.themeSwitcher}
      onClick={toggleTheme}
      aria-label={
        theme === "dark"
          ? t("header.switchToLightTheme")
          : t("header.switchToDarkTheme")
      }
    >
      {theme === "dark" ? (
        <Sun size={20} weight="light" />
      ) : (
        <Moon size={20} weight="light" />
      )}
    </button>
  );
};
