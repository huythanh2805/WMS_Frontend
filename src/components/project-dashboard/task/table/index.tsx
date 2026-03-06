'use client';
import { DataTable } from '@/components/data-table';
import { useApi } from '@/hooks/use-api';
import React, { useState } from 'react';
import { TaskColumn, taskColumns } from './task-column';

type Props = {
  projectId: string;
};

function TaskTable({ projectId }: Props) {
  const { loading, request } = useApi();
  const [tasks, setTasks] = useState<TaskColumn[] | null>(null);

  const fetchTasks = async () => {
    if (!loading && projectId) {
      const res = await request({
        url: `/task/${projectId}`,
        method: 'get',
      });
      const result: TaskColumn[] = res?.data?.items;
      setTasks(result);
    }
  };
  React.useEffect(() => {
    fetchTasks();
  }, [projectId]);

  return (
    <div>
      {!loading && tasks !== null && (
        <DataTable<TaskColumn> columns={taskColumns} data={tasks} />
      )}
    </div>
  );
}

export default TaskTable;
