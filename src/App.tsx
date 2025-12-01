import { useState, useEffect } from "react";
import { useTaskStore } from "./store/taskStore";
import { useFilterStore } from "./store/filterStore";
import { useThemeStore } from "./store/themeStore";
import { useNotifications } from "./hooks/useNotifications";
import { Header } from "./components/Header";
import { TaskList } from "./components/TaskList";
import { KanbanView } from "./components/KanbanView";
import { CalendarView } from "./components/CalendarView";
import { TimelineView } from "./components/TimelineView";
import { TaskEditor } from "./components/TaskEditor";
import { FilterPanel } from "./components/FilterPanel";
import { Task } from "./types/task";
import "./styles/global.scss";

function App() {
  const { tasks, initialize } = useTaskStore();
  const { viewMode } = useFilterStore();
  const { theme, setTheme } = useThemeStore();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  useNotifications(tasks, { enabled: true, reminderMinutes: [15, 60, 1440] });

  const handleAddTask = () => {
    setEditingTask(null);
    setIsEditorOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingTask(null);
  };

  const renderView = () => {
    switch (viewMode) {
      case "list":
        return <TaskList tasks={tasks} onEditTask={handleEditTask} />;
      case "kanban":
        return <KanbanView tasks={tasks} onEditTask={handleEditTask} />;
      case "calendar-day":
      case "calendar-week":
      case "calendar-month":
        return (
          <CalendarView
            tasks={tasks}
            onEditTask={handleEditTask}
            viewMode={viewMode}
          />
        );
      case "timeline":
        return <TimelineView tasks={tasks} onEditTask={handleEditTask} />;
      default:
        return <TaskList tasks={tasks} onEditTask={handleEditTask} />;
    }
  };

  return (
    <div className="app">
      <Header onAddTask={handleAddTask} />
      <div className="container">
        <div style={{ display: "flex", gap: "2rem", padding: "2rem 0" }}>
          <aside style={{ width: "300px", flexShrink: 0 }}>
            <FilterPanel />
          </aside>
          <main style={{ flex: 1 }}>{renderView()}</main>
        </div>
      </div>
      <TaskEditor
        task={editingTask}
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
      />
    </div>
  );
}

export default App;
