import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  MeasuringStrategy,
} from "@dnd-kit/core";
import { Task } from "../../types/task";
import { useFilterStore } from "../../store/filterStore";
import { KanbanColumn } from "../KanbanColumn";
import { KanbanCard } from "../KanbanCard";
import { useKanbanTasks } from "../../hooks/useKanbanTasks";
import { useKanbanDragAndDrop } from "../../hooks/useKanbanDragAndDrop";
import { getVisibleColumns } from "../../utils/kanbanUtils";
import styles from "./KanbanView.module.scss";

interface KanbanViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export const KanbanView = ({ tasks, onEditTask }: KanbanViewProps) => {
  const { hideArchived } = useFilterStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const { tasksByStatus } = useKanbanTasks(tasks);

  const {
    activeId,
    overId,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useKanbanDragAndDrop({
    tasks,
  });

  return (
    <div className={styles.kanbanView}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.columns}>
          {getVisibleColumns(hideArchived).map((column) => (
            <KanbanColumn
              key={column.status}
              status={column.status}
              tasks={tasksByStatus[column.status]}
              onEditTask={onEditTask}
              isHidden={false}
              activeId={activeId}
              overId={overId}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <div style={{ opacity: 0.8 }}>
              <KanbanCard task={activeTask} onEdit={onEditTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
