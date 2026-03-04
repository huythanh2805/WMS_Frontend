import { cn } from "@/libs/utils";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Badge } from "../ui/badge";
import { Task, TaskCard } from "./task-kanban";

export default function KanbanColumn({
    column,
    tasks,
}: {
    column: { id: string; title: string; color: string };
    tasks: Task[];
}) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
    });

    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4 px-1">
                <div className={cn("w-3 h-3 rounded-full", column.color)} />
                <h2 className="font-semibold text-lg">{column.title}</h2>
                <Badge variant="secondary" className="ml-auto text-xs">
                    {tasks.length}
                </Badge>
            </div>

            <SortableContext
                id={column.id}
                items={tasks.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
            >
                <div
                    ref={setNodeRef}
                    className={cn(
                        "space-y-3 min-h-[400px] rounded-xl p-3 bg-muted/30 border border-dashed transition-colors",
                        isOver && "bg-primary/10 border-primary"
                    )}
                >
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}

                    {tasks.length === 0 && (
                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic border-2 border-dashed rounded-lg">
                            Drop tasks here
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}