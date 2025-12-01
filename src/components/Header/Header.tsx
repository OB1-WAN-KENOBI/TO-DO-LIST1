import { Plus, List, Calendar, Clock, SquaresFour } from "phosphor-react";
import { useFilterStore } from "../../store/filterStore";
import { ThemeSwitcher } from "../ThemeSwitcher";
import styles from "./Header.module.scss";

interface HeaderProps {
  onAddTask: () => void;
}

export const Header = ({ onAddTask }: HeaderProps) => {
  const { viewMode, setViewMode, searchQuery, setSearchQuery } =
    useFilterStore();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <h1 className={styles.title}>Todo Planner</h1>

        <div className={styles.controls}>
          <div className={styles.search}>
            <input
              type="text"
              placeholder="Search tasks..."
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
              aria-label="List view"
            >
              <List size={20} weight="light" />
            </button>
            <button
              className={`${styles.viewButton} ${
                viewMode === "kanban" ? styles.active : ""
              }`}
              onClick={() => setViewMode("kanban")}
              aria-label="Kanban view"
            >
              <SquaresFour size={20} weight="light" />
            </button>
            <button
              className={`${styles.viewButton} ${
                viewMode.startsWith("calendar") ? styles.active : ""
              }`}
              onClick={() => setViewMode("calendar-day")}
              aria-label="Calendar view"
            >
              <Calendar size={20} weight="light" />
            </button>
            <button
              className={`${styles.viewButton} ${
                viewMode === "timeline" ? styles.active : ""
              }`}
              onClick={() => setViewMode("timeline")}
              aria-label="Timeline view"
            >
              <Clock size={20} weight="light" />
            </button>
          </div>

          <button onClick={onAddTask} className={styles.addButton}>
            <Plus size={20} weight="light" />
            Add Task
          </button>

          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
};
