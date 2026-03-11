'use client';

import { useMemo, useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import KanbanColumn from './task-kanban-column';
import { Task } from '@/types'; // Assume Task now includes position: number
import useTask from '@/hooks/use-task';
import { TaskStatus } from '@/enums';

const columns: { id: TaskStatus; title: string; color: string }[] = [
  { id: TaskStatus.TODO, title: 'To Do', color: 'bg-blue-500' },
  { id: TaskStatus.IN_PROGRESS, title: 'In Progress', color: 'bg-amber-500' },
  { id: TaskStatus.COMPLETED, title: 'Completed', color: 'bg-emerald-500' },
  { id: TaskStatus.BACKLOG, title: 'Backlog', color: 'bg-purple-500' },
  { id: TaskStatus.IN_REVIEW, title: 'In Review', color: 'bg-pink-500' },
];

export function TaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'TASK',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    boxShadow: isDragging ? '0 10px 30px rgba(0,0,0,0.2)' : 'none',
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'cursor-grab active:cursor-grabbing shadow hover:shadow-md transition-all',
        isDragging && 'ring-2 ring-primary/60 scale-105 z-50'
      )}
    >
      <CardContent className="p-4 space-y-3">
        <h3 className="font-medium">{task.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {task.description}
        </p>

        <div className="flex flex-wrap gap-2 text-xs">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-800 border-blue-200"
          >
            {task?.project?.name}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              task.priority === 'HIGH'
                ? 'bg-red-50 text-red-800 border-red-200'
                : task.priority === 'MEDIUM'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            )}
          >
            {task.priority}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs bg-blue-600 text-white">
              {task.assigneeId.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            {task.assigneeId}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

type Props = {
  projectId: string;
};

export default function TaskKanban({ projectId }: Props) {
  const { tasks, setTasks } = useTask({ projectId });
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const tasksByStatus = useMemo(() => {
    return columns.reduce(
      (acc, col) => {
        acc[col.id] = tasks.filter((t) => t.status === col.id);
        // .sort((a, b) => a.position - b.position);
        return acc;
      },
      {} as Record<TaskStatus, Task[]>
    );
  }, [tasks]);
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    if (!active.data.current) return;

    if (active.data.current.type === 'TASK') {
      setActiveTask(active.data.current.task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'TASK';
    const isOverTask = over.data.current?.type === 'TASK';
    if (!isActiveTask) return;
    // Dropping a task over another task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        const updatedTasks = [...tasks];

        // move task to the column of the target task
        updatedTasks[activeIndex] = {
          ...updatedTasks[activeIndex],
          status: updatedTasks[overIndex].status,
        };
        return arrayMove(updatedTasks, activeIndex, overIndex);
      });
    }

    const isOverColumn = over.data.current?.type === 'COLUMN';

    // Dropping a task over a column
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        const updatedTasks = [...tasks];
        updatedTasks[activeIndex] = {
          ...updatedTasks[activeIndex],
          status: over.data.current?.columnId,
        };

        return arrayMove(updatedTasks, activeIndex, activeIndex);
      });
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
  };
  return (
    <div className="h-full bg-background p-4 md:p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasksByStatus[column.id]}
            />
          ))}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeTask && <TaskCard task={activeTask} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
