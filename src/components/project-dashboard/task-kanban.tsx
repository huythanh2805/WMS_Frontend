'use client';

import { useState } from 'react';
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
} from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/libs/utils';
import KanbanColumn from './task-kanban-column';

// Types
type Status =
  | 'TODO'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'BLOCKED'
  | 'BACKLOG'
  | 'IN_REVIEW';

export interface Task {
  id: string;
  title: string;
  description: string;
  project: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assigneeId: string;
  status: Status;
}

const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'TEST TASK',
    description: 'Description',
    project: 'First PROJECT',
    priority: 'MEDIUM',
    assigneeId: 'Codwave',
    status: 'TODO',
  },
  {
    id: 'task-2',
    title: 'TEST TASK 2',
    description: 'Description',
    project: 'First PROJECT',
    priority: 'MEDIUM',
    assigneeId: 'Codwave',
    status: 'TODO',
  },
  // Thêm task khác để test: { id: "task-2", title: "Task 2", ..., status: "TODO" },
];

const columns: { id: Status; title: string; color: string }[] = [
  { id: 'TODO', title: 'To Do', color: 'bg-blue-500' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-amber-500' },
  { id: 'COMPLETED', title: 'Completed', color: 'bg-emerald-500' },
  { id: 'BLOCKED', title: 'Blocked', color: 'bg-red-500' },
  { id: 'BACKLOG', title: 'Backlog', color: 'bg-purple-500' },
  { id: 'IN_REVIEW', title: 'In Review', color: 'bg-pink-500' },
];

export function TaskCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

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
            {task.project}
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

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) {
      // Drop tại chỗ hoặc over chính nó → không làm gì
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    setTasks((prevTasks) => {
      const activeIndex = prevTasks.findIndex((t) => t.id === activeId);
      if (activeIndex === -1) return prevTasks;

      const newTasks = [...prevTasks];
      const [movedTask] = newTasks.splice(activeIndex, 1);

      let targetStatus = movedTask.status;
      let insertAt = newTasks.length; // mặc định cuối list

      // 1. Nếu over là COLUMN ID → update status + append cuối column mới
      const overColumn = columns.find((c) => c.id === overId);
      if (overColumn) {
        targetStatus = overColumn.id;
      } else {
        // 2. Nếu over là TASK ID → lấy status của task đó + insert trước nó
        const overTaskIndex = newTasks.findIndex((t) => t.id === overId);
        if (overTaskIndex !== -1) {
          targetStatus = newTasks[overTaskIndex].status;
          insertAt = overTaskIndex; // insert trước task over
        }
      }

      // Update status nếu khác
      if (movedTask.status !== targetStatus) {
        movedTask.status = targetStatus;
      }

      // Chèn vào vị trí mới
      newTasks.splice(insertAt, 0, movedTask);

      return newTasks;
    });
  };

  const tasksByStatus = columns.reduce(
    (acc, col) => {
      acc[col.id] = tasks.filter((t) => t.status === col.id);
      return acc;
    },
    {} as Record<Status, Task[]>
  );

  return (
    <div className="h-full bg-background p-4 md:p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
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
