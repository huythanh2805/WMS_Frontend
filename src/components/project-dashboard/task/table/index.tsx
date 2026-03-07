'use client';
import { DataTable } from '@/components/data-table';
import { useApi } from '@/hooks/use-api';
import React, { useState } from 'react';
import { TaskColumn, taskColumns } from './task-column';
import { EditTaskDialog } from '../edit-task-dialog';
import { Task } from '@/types';
import { DeleteTaskDialog } from '../delete-task-dialog';
import { useRouter } from 'next/navigation';

type Props = {
  projectId: string;
};

function TaskTable({ projectId }: Props) {
  const router = useRouter()
  const { loading, request } = useApi();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setisDeleteDialogOpen] = useState<boolean>(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskColumn[] | null>(null);

  const fetchTasks = async () => {
    if (!loading && projectId) {
      const res = await request({
        url: `/task/project/${projectId}`,
        method: 'get',
      });
      const result: TaskColumn[] = res?.data?.items;
      setTasks(result);
    }
  };
  React.useEffect(() => {
    fetchTasks();
  }, [projectId]);
  // Functions which has passed to collumns through meta props
  const onOpenUpdateDialogChange = (open: boolean, taskId?: string) => {
    setIsUpdateDialogOpen(open);
    if (taskId) {
      setTaskId(taskId);
    }
  };
  const onOpenDeleteDialogChange = (open: boolean, taskId?: string) => {
    setisDeleteDialogOpen(open);
    if (taskId) {
      setTaskId(taskId);
    }
  };
  // Callback when update successfully
  const onUpdateTaskSuccess = (value: Task) => {
    setTasks(tasks => {
      if (!tasks) return tasks

      return tasks.map(task =>
        task.id === value.id ? { ...task, ...value } : task
      )
    })
  }
  const onDeleteTaskSuccess = (taskId: string) => {
    setTasks(tasks => {
      if (!tasks) return tasks

      return tasks.filter(task =>
        task.id !== taskId
      )
    })
  }
  const handleClickDetail = (taskId: string) => {
    router.push(`/dashboard/${projectId}/task/${taskId}`)
  };
  return (
    <div>
      {!loading && tasks !== null && (
        <DataTable<TaskColumn>
          key={tasks.length}
          columns={taskColumns} data={tasks}
          meta={{ onOpenUpdateDialogChange, onOpenDeleteDialogChange }}
          onClickDetail={handleClickDetail}
        />
      )}
      <EditTaskDialog
        onOpenChange={onOpenUpdateDialogChange}
        open={isUpdateDialogOpen}
        taskId={taskId}
        callBack={onUpdateTaskSuccess}
      />
      <DeleteTaskDialog
        open={isDeleteDialogOpen}
        onOpenChange={onOpenDeleteDialogChange}
        taskId={taskId}
        callBack={onDeleteTaskSuccess}
      // taskTitle={}
      />
    </div>
  );
}

export default TaskTable;
