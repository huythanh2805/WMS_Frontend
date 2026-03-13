'use client';
import { DataTable } from '@/components/data-table';
import { useApi } from '@/hooks/use-api';
import React, { useState } from 'react';
import { Task } from '@/types';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/constants/api-endpoints';
import { TaskColumn, taskColumns } from './project-dashboard/task/table/task-column';
import { useUserStore } from '@/stores/user-store';

function MyTasksTable() {
  const router = useRouter();
  const { loading, request } = useApi();
  const {user} = useUserStore()
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setisDeleteDialogOpen] = useState<boolean>(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskColumn[] | null>(null);

  const fetchTasks = async () => {
    if(!user?.id) return
      const res = await request({
        url: API_ENDPOINTS.TASK_BY_USER_ID(user?.id),
        method: 'get',
      });
      const result: TaskColumn[] = res?.data?.items;
      setTasks(result);
  };
  React.useEffect(() => {
    fetchTasks();
  }, [user?.id]);
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
    setTasks((tasks) => {
      if (!tasks) return tasks;

      return tasks.map((task) =>
        task.id === value.id ? { ...task, ...value } : task
      );
    });
  };
  const onDeleteTaskSuccess = (taskId: string) => {
    setTasks((tasks) => {
      if (!tasks) return tasks;

      return tasks.filter((task) => task.id !== taskId);
    });
  };
  if(tasks === undefined) return <div className='w-full h-full flex items-center justify-center'>No Tasks found...</div>
 console.log({tasks})
  return (
    <div>
      {!loading && tasks !== null &&  (
        <DataTable<TaskColumn>
          key={tasks?.length}
          columns={taskColumns}
          data={tasks}
          meta={{ onOpenUpdateDialogChange, onOpenDeleteDialogChange }}
        />
      )}
      {/* <EditTaskDialog
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
      /> */}
    </div>
  );
}

export default MyTasksTable;
