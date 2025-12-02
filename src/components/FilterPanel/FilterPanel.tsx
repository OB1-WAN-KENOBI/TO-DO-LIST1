import { useTranslation } from "react-i18next";
import { useFilterStore } from "../../store/filterStore";
import { TaskStatus, Priority } from "../../types/task";
import { CustomSelect } from "../CustomSelect";
import styles from "./FilterPanel.module.scss";

export const FilterPanel = () => {
  const { t } = useTranslation();
  const {
    dateFilter,
    statusFilter,
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
        <label className={styles.label}>{t("filter.dateFilter")}</label>
        <CustomSelect
          value={dateFilter}
          onChange={(value) => setDateFilter(value as typeof dateFilter)}
          options={dateOptions.map((option) => ({
            value: option,
            label: t(`filter.dateOptions.${option}`),
          }))}
          label={t("filter.dateFilter")}
        />
      </div>

      <div className={styles.section}>
        <label className={styles.label}>{t("filter.status")}</label>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={statusFilter === "all"}
              onChange={(e) => setStatusFilter(e.target.checked ? "all" : [])}
            />
            {t("filter.all")}
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
              {t(`filter.statusOptions.${status}`)}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>{t("filter.priority")}</label>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={priorityFilter === "all"}
              onChange={(e) => setPriorityFilter(e.target.checked ? "all" : [])}
            />
            {t("filter.all")}
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
              {t(`filter.priorityOptions.${priority}`)}
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>{t("filter.sortBy")}</label>
        <CustomSelect
          value={sortBy}
          onChange={(value) => setSortBy(value as typeof sortBy)}
          options={sortOptions.map((option) => ({
            value: option,
            label: t(`filter.sortOptions.${option}`),
          }))}
          label={t("filter.sortBy")}
        />
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className={styles.sortButton}
          aria-label={
            sortOrder === "asc" ? t("filter.sortAsc") : t("filter.sortDesc")
          }
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
          {t("filter.hideArchived")}
        </label>
      </div>

      <button onClick={resetFilters} className={styles.resetButton}>
        {t("filter.resetFilters")}
      </button>
    </div>
  );
};
