"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { taskSchame } from "@/libs/task-schame";
import TaskForm from "./task-form";



type FormValues = z.infer<typeof taskSchame>;

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // initialData?: Partial<FormValues>; // nếu muốn edit từ data có sẵn
}

export function EditTaskDialog({ open, onOpenChange }: EditTaskDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(taskSchame),
    defaultValues: {
      taskName: "TEST TASK",
      assignee: "Codewave",
      priority: "Medium",
      startDate: new Date("2025-02-19"),
      dueDate: new Date("2025-02-22"),
      status: "IN PROGRESS",
      description: "Description",
    },
  });

  function onSubmit(values: FormValues) {
    console.log("Form submitted:", values);
    toast.success("Task updated", {
      description: `Task "${values.taskName}" has been updated.`,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[92vh] overflow-y-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to the task here. Click Update Task when you're done.
          </DialogDescription>
        </DialogHeader>

        <TaskForm form={form} onSubmit={onSubmit} onOpenChange={onOpenChange} type="edit" />
      </DialogContent>
    </Dialog>
  );
}