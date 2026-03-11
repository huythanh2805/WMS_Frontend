'use client';

import { useEffect, useRef } from 'react';
import Gantt from 'frappe-gantt';
import 'frappe-gantt/dist/frappe-gantt.css';
import useTask from '@/hooks/use-task';
import { Task } from '@/types';
interface GanttTask extends Task {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  dependencies?: string;
  custom_class?: string;
}
type Props = {
  projectId: string;
};
const toISOStringWithoutShift = (date: Date) => {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  const newDate = local.toISOString();
  return new Date(newDate);
};
export default function TaskTimeline({ projectId }: Props) {
  const ganttRef = useRef<HTMLDivElement | null>(null);
  const { tasks, updateTask } = useTask({ projectId });
  useEffect(() => {
    if (!tasks || tasks.length == 0) return;
    if (!ganttRef.current) return;
    const grantTasks = tasks.map((item) => {
      return {
        ...item,
        name: item.title,
        start: item.startDate,
        end: item.dueDate,
        progress: Math.floor(Math.random() * 100) + 1,
      };
    });
    const gantt = new Gantt(ganttRef.current, grantTasks, {
      view_mode: 'Day',
      date_format: 'YYYY-MM-DD',
      on_date_change: (task: GanttTask, start: any, end: any) => {
        // CALL API update DB here
        console.log({ start: start.toLocaleDateString('sv-SE') });
        updateTask({
          ...task,
          startDate: toISOStringWithoutShift(start),
          dueDate: toISOStringWithoutShift(end),
        });
      },
    });

    return () => {
      gantt?.clear();
    };
  }, [tasks]);

  return (
    <div className="p-6 overflow-hidden">
      <h1 className="text-3xl font-bold mb-6">Timeline</h1>
      <div ref={ganttRef} />
    </div>
  );
}
