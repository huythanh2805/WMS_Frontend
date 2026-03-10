'use client';

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectDashboardUI from './project-dashboard-ui';
import TaskKanban from './task-kanban';
import TaskCalender from './task-calender';
import TaskTimeline from './task-timeline';
import TaskTable from './task/table';

interface ProjectDashboardProps {
  projectId: string;
}

export function ProjectDashboard({ projectId }: ProjectDashboardProps) {
  return (
    <div className="flex flex-col h-full space-y-6 p-6 bg-background">
      {/* Tabs: Dashboard | Table | Kanban | Calender | Timeline */}
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="timeline">TaskTimeline</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <ProjectDashboardUI projectId={projectId} />
        </TabsContent>
        <TabsContent value="kanban" className="space-y-6">
          <TaskKanban projectId={projectId} />
        </TabsContent>
        <TabsContent value="calendar">
          <TaskCalender projectId={projectId} />
        </TabsContent>
        <TabsContent value="timeline">
          <TaskTimeline projectId={projectId} />
        </TabsContent>
        <TabsContent value="table">
          <TaskTable projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
