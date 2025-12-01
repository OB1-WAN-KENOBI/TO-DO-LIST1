import { useFilterStore } from "../../store/filterStore";
import { TaskStatus, Priority } from "../../types/task";
import styles from "./FilterPanel.module.scss";

export const FilterPanel = () => {
  const {
    dateFilter,
    statusFilter,
    tagFilter,
    priorityFilter,
    sortBy,
    sortOrder,
    hideArchived,
    setDateFilter,
    setStatusFilter,
    setPriorityFilter,
    setSortBy,
    setSortOrder,
    setHideArchived,
    resetFilters,
  } = useFilterStore();

  const statusOptions: TaskStatus[] = [
    "planned",
    "in-progress",
    "completed",
    "cancelled",
  ];
  const priorityOptions: Priority[] = ["low", "normal", "high"];
  const dateOptions = [
    "all",
    "today",
    "tomorrow",
    "week",
    "month",
    "overdue",
  ] as const;
  const sortOptions = [
    "created",
    "deadline",
    "priority",
    "status",
    "title",
  ] as const;

  return (
    <div className={styles.filterPanel}>
      <div className={styles.section}>
        <label className={styles.label}>Date Filter</label>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as typeof dateFilter)}
          className={styles.select}
        >
          {dateOptions.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Status</label>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={statusFilter === "all"}
              onChange={(e) => setStatusFilter(e.target.checked ? "all" : [])}
            />
            All
          </label>
          {statusOptions.map((status) => (
            <label key={status} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={
                  statusFilter !== "all" && statusFilter.includes(status)
                }
                onChange={(e) => {
                  if (statusFilter === "all") {
                    setStatusFilter([status]);
                  } else {
                    const newFilter = e.target.checked
                      ? [...statusFilter, status]
                      : statusFilter.filter((s) => s !== status);
                    setStatusFilter(newFilter.length > 0 ? newFilter : "all");
                  }
                }}
              />
              {status}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Priority</label>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={priorityFilter === "all"}
              onChange={(e) => setPriorityFilter(e.target.checked ? "all" : [])}
            />
            All
          </label>
          {priorityOptions.map((priority) => (
            <label key={priority} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={
                  priorityFilter !== "all" && priorityFilter.includes(priority)
                }
                onChange={(e) => {
                  if (priorityFilter === "all") {
                    setPriorityFilter([priority]);
                  } else {
                    const newFilter = e.target.checked
                      ? [...priorityFilter, priority]
                      : priorityFilter.filter((p) => p !== priority);
                    setPriorityFilter(newFilter.length > 0 ? newFilter : "all");
                  }
                }}
              />
              {priority}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className={styles.select}
        >
          {sortOptions.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className={styles.sortButton}
        >
          {sortOrder === "asc" ? "↑" : "↓"}
        </button>
      </div>

      <div className={styles.section}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={hideArchived}
            onChange={(e) => setHideArchived(e.target.checked)}
          />
          Hide Archived
        </label>
      </div>

      <button onClick={resetFilters} className={styles.resetButton}>
        Reset Filters
      </button>
    </div>
  );
};
