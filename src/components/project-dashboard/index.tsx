// components/project-dashboard.tsx
"use client";

import * as React from "react";
import { Plus, Settings, Users, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/libs/utils";
import ProjectMainUI from "./project-main-ui";


interface ProjectDashboardProps {
  projectId: string;
  // Có thể pass thêm data từ parent hoặc fetch ở đây
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
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <ProjectMainUI projectId={projectId} />
        </TabsContent>

        {/* Timeline & Activity content - thêm sau nếu cần */}
        <TabsContent value="table">Full activity log placeholder</TabsContent>
        <TabsContent value="kanban">Kanban view placeholder</TabsContent>
        <TabsContent value="calendar">Calendar view placeholder</TabsContent>
        <TabsContent value="timeline">Timeline view placeholder</TabsContent>
      </Tabs>
    </div>
  );
}