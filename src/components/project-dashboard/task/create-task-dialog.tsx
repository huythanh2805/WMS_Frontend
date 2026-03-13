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
import { useApi } from '@/hooks/use-api';
import React from 'react';
import { Task } from '@/types';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

type FormValues = z.infer<typeof taskSchame>;

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  callback?: (value: Task) => void;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  projectId,
  callback,
}: EditTaskDialogProps) {
  const { loading, request } = useApi<Task>();
  const form = useForm<FormValues>({
    resolver: zodResolver(taskSchame),
    defaultValues: {
      title: '',
      assigneeId: '',
      priority: 'MEDIUM',
      startDate: new Date(),
      dueDate: new Date(),
      status: 'TODO',
      description: '',
    },
  });

  async function onSubmit(values: FormValues) {
    console.log('Form submitted:', { projectId, ...values });
    if (!loading) {
      await request(
        {
          url: API_ENDPOINTS.TASK,
          method: 'post',
          data: { projectId, ...values },
        },
        {
          onSuccess: (data) => {
            if (callback) callback(data.data);
            form.reset();
          },
        }
      );
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px] max-h-[92vh] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
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
        />
      </DialogContent>
    </Dialog>
  );
}
