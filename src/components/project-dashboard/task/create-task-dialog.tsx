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
}

export function CreateTaskDialog({ open, onOpenChange }: EditTaskDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(taskSchame),
  });

  function onSubmit(values: FormValues) {
    console.log("Form submitted:", values);
    toast.success("Task created", {
      description: `Task "${values.taskName}" has been created.`,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[92vh] overflow-y-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Create a new task here. Click Create Task when you're done.
          </DialogDescription>
        </DialogHeader>

        <TaskForm form={form} onSubmit={onSubmit} onOpenChange={onOpenChange} type="create" />
      </DialogContent>
    </Dialog>
  );
}