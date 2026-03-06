'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventDropArg, EventInput } from '@fullcalendar/core';

interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate: string; // yyyy-mm-dd
}

export default function TaskCalender() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'TEST TASK',
      description: 'Description',
      assigneeId: 'Codewave',
      priority: 'MEDIUM',
      dueDate: '2026-03-21',
    },
    {
      id: '2',
      title: 'TEST TASK',
      description: 'Description',
      assigneeId: 'Codewave',
      priority: 'MEDIUM',
      dueDate: '2026-03-21',
    },
  ]);

  const handleEventDrop = (info: EventDropArg) => {
    const date = info.event.start;
    if (!date) return;

    const localDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    const formatted = localDate.toLocaleDateString('sv-SE');
    // sv-SE => format yyyy-mm-dd chuẩn

    setTasks((prev) =>
      prev.map((task) =>
        task.id === info.event.id ? { ...task, dueDate: formatted } : task
      )
    );
  };

  const events: EventInput[] = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    date: task.dueDate,
  }));

  return (
    <div className="min-h-screen p-6 bg-background">
      <h1 className="text-3xl font-bold mb-6">Calendar</h1>

      <div className="bg-white rounded-xl shadow p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          events={events}
          eventDrop={handleEventDrop}
          height="auto"
          eventContent={(eventInfo) => {
            const task = tasks.find((t) => t.id === eventInfo.event.id);

            return (
              <div className="text-xs p-1 rounded bg-blue-600 text-white">
                <div className="font-semibold">{eventInfo.event.title}</div>
                {task && (
                  <div className="opacity-80">
                    {task.assigneeId} • {task.priority}
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
