import { useTranslation } from "react-i18next";
import { Plus, List, Calendar, Clock, SquaresFour } from "phosphor-react";
import { useFilterStore } from "../../store/filterStore";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { LanguageSwitcher } from "../LanguageSwitcher";
import styles from "./Header.module.scss";

interface HeaderProps {
  onAddTask: () => void;
}

export const Header = ({ onAddTask }: HeaderProps) => {
  const { t } = useTranslation();
  const { viewMode, setViewMode, searchQuery, setSearchQuery } =
    useFilterStore();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t("header.title")}</h1>

        <div className={styles.controls}>
          <div className={styles.search}>
            <input
              type="text"
              placeholder={t("header.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.viewSwitcher}>
            <button
              className={`${styles.viewButton} ${
                viewMode === "list" ? styles.active : ""
              }`}
              onClick={() => setViewMode("list")}
              aria-label={t("header.listView")}
            >
              <List size={20} weight="light" />
            </button>
            <button
              className={`${styles.viewButton} ${
                viewMode === "kanban" ? styles.active : ""
              }`}
              onClick={() => setViewMode("kanban")}
              aria-label={t("header.kanbanView")}
            >
              <SquaresFour size={20} weight="light" />
            </button>
            <button
              className={`${styles.viewButton} ${
                viewMode.startsWith("calendar") ? styles.active : ""
              }`}
              onClick={() => setViewMode("calendar-day")}
              aria-label={t("header.calendarView")}
            >
              <Calendar size={20} weight="light" />
            </button>
            <button
              className={`${styles.viewButton} ${
                viewMode === "timeline" ? styles.active : ""
              }`}
              onClick={() => setViewMode("timeline")}
              aria-label={t("header.timelineView")}
            >
              <Clock size={20} weight="light" />
            </button>
          </div>

          <button onClick={onAddTask} className={styles.addButton}>
            <Plus size={20} weight="light" />
            {t("header.addTask")}
          </button>

          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};
