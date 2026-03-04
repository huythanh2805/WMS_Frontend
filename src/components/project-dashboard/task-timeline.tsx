"use client";

import { useEffect, useRef } from "react";
import Gantt from "frappe-gantt";
import "frappe-gantt/dist/frappe-gantt.css";
interface Task {
  id: string;
  name: string;
  start: string;
  end: string;
}
export default function TaskTimeline() {
  const ganttRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ganttRef.current) return;

    const tasks = [
      {
        id: "1",
        name: "TEST TASK",
        start: "2026-02-19",
        end: "2026-02-21",
        progress: 20,
      },
      {
        id: "2",
        name: "TEST TASK",
        start: "2026-03-20",
        end: "2026-03-22",
        progress: 20,
      },
    ];

    const gantt = new Gantt(ganttRef.current, tasks, {
      view_mode: "Day",
      date_format: "YYYY-MM-DD",
      on_date_change: (task: Task, start: any, end: any) => {
        console.log("New start:", start);
        console.log("New end:", end);

        // CALL API update DB here
      },
    });

    return () => {
      gantt?.clear();
    };
  }, []);

  return (
    <div className="p-6 overflow-hidden">
      <h1 className="text-3xl font-bold mb-6">Timeline</h1>
      <div ref={ganttRef} />
    </div>
  );
}