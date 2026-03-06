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
import { useApi } from "@/hooks/use-api";
import { useWorkspaceStore } from "@/stores/workspace-store";
import React, { useState } from "react";
import { WorkspaceMember } from "@/types";



type FormValues = z.infer<typeof taskSchame>;

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string
}

export function CreateTaskDialog({ open, onOpenChange, projectId }: EditTaskDialogProps) {
  const { workspaceId } = useWorkspaceStore()
  const { loading, request } = useApi()
  const [workspaceMembers, setWorkSpaceMembers] = useState<WorkspaceMember[] | null>(null)
  const form = useForm<FormValues>({
    resolver: zodResolver(taskSchame),
    defaultValues: {
      title: "",
      assigneeId: "",
      priority: "MEDIUM",
      startDate: new Date(),
      dueDate: new Date(),
      status: "TODO",
      description: "",
    },
  });

  async function onSubmit(values: FormValues) {
    console.log("Form submitted:", { projectId, ...values });
    if (!loading) {
      await request({
        url: `/task`,
        method: 'post',
        data: { projectId, ...values }
      },
        {
          onSuccess: () => form.reset()
        }
      )
    }
    onOpenChange(false);
  }

  const fetchWorkspaceMembers = async () => {
    if (!loading && workspaceId) {
      const res = await request({
        url: `/workspace-member/${workspaceId}`,
        method: 'get'
      })
      const result: WorkspaceMember[] = res?.data?.items
      setWorkSpaceMembers(result)
    }
  }
  React.useEffect(() => {
    fetchWorkspaceMembers()
  }, [workspaceId])


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[92vh] overflow-y-auto" onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Create a new task here. Click Create Task when you're done.
          </DialogDescription>
        </DialogHeader>

        <TaskForm
          type="create"
          form={form}
          onSubmit={onSubmit}
          onOpenChange={onOpenChange}
          workspaceMembers={workspaceMembers}
        />
      </DialogContent>
    </Dialog>
  );
}