import React, { useState } from 'react'
import { useApi } from './use-api';
import { Task } from '@/types';

type Props = {
    projectId: string
}

function useTask({projectId}: Props) {
    const {loading, request} = useApi()
    const [tasks, setTasks] = useState<Task[]>([])
    // Fetch all task
    const fetchTasks = async () => {
        if (!loading && projectId) {
          const res = await request({
            url: `/task/project/${projectId}`,
            method: 'get',
          });
          const result = res?.data?.items;
          setTasks(result);
        }
      };
      React.useEffect(() => {
        fetchTasks();
      }, [projectId]);
      // Update
    const updateTask = async (data: Partial<Task>, callback?: () => void) => {
      if(!loading && data.id) {
        await request({
         url: "/task/" + data.id,
         method: "patch",
         data: data
        }, {
          onSuccess: () => {
            if(callback) callback()
          }
        })
      }
    }
  return {
    tasks,
    setTasks,
    fetchTasks,
    updateTask
  }
}

export default useTask