'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { taskSchame } from '@/lib/task-schame';
import TaskForm from './task-form';
import { useEffect } from 'react';
import { useApi } from '@/hooks/use-api';
import { Task } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

type FormValues = z.infer<typeof taskSchame>;

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string | null;
  callBack?: (value: Task) => void;
}

export function EditTaskDialog({
  open,
  onOpenChange,
  taskId,
  callBack,
}: EditTaskDialogProps) {
  const { loading, request } = useApi();
  const { loading: isFetchTaskLoading, request: isFetchTaskRequest } = useApi();
  const form = useForm<FormValues>({
    resolver: zodResolver(taskSchame),
    defaultValues: {
      title: '',
      assigneeId: '',
      priority: '',
      startDate: new Date(),
      dueDate: new Date(),
      status: '',
      description: '',
    },
  });

  async function onSubmit(values: FormValues) {
    await request(
      {
        url: `/task/${taskId}`,
        method: 'patch',
        data: { ...values },
      },
      {
        onSuccess: (data) => {
          if (callBack) callBack(data.data);
        },
      }
    );
    onOpenChange(false);
  }

  // Fetching task to edit
  const fetchTaskById = async () => {
    await isFetchTaskRequest(
      {
        url: `/task/${taskId}`,
        method: 'get',
      },
      {
        onSuccess: (data) => {
          const result = data?.data;
          form.reset({
            title: result.title,
            assigneeId: result.assigneeId,
            priority: result.priority,
            startDate: new Date(result.startDate),
            dueDate: new Date(result.dueDate),
            status: result.status,
            description: result.description,
          });
        },
      }
    );
  };
  useEffect(() => {
    if (!taskId) return;
    fetchTaskById();
  }, [taskId]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] max-h-[92vh] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to the task here. Click Update Task when you're done.
          </DialogDescription>
        </DialogHeader>
        {!isFetchTaskLoading ? (
          <TaskForm
            form={form}
            onSubmit={onSubmit}
            onOpenChange={onOpenChange}
            type="edit"
          />
        ) : (
          <Skeleton className="w-full h-[85vh]" />
        )}
      </DialogContent>
    </Dialog>
  );
}
