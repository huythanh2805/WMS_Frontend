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
import { TaskContributeChart } from "./pie-chart";
import { CreateTaskDialog } from "./task/create-task-dialog";
import { useApi } from "@/hooks/use-api";
import { useWorkspaceStore } from "@/stores/workspace-store";

// Mock data (thay bằng fetch từ API sau)
const projectData = {
  id: "proj-1",
  name: "First PROJECT",
  avatar: "/avatar-f.png", // hoặc generate từ initials
  stats: {
    completed: { percent: 0, total: 0, done: 0 },
    inProgress: { percent: 0, count: 0 },
    overdue: { percent: 0, count: 0 },
    members: { percent: 100, count: 1 },
  },
  recentActivity: [
    { icon: "codwave", text: 'Codwave created project "First PROJECT"', time: "less than a minute ago" },
  ],
};

interface ProjectDashboardProps {
  projectId: string;
}

function ProjectDashboardUI({ projectId }: ProjectDashboardProps) {

  const [isCreateTaskModelOpen, setIsCreateTaskModelOpen] = React.useState(false);
  const data = projectData;
  const handleOnTaskModelOpen = (open: boolean) => {
    setIsCreateTaskModelOpen(open);
  };

  return (
    <div className="flex flex-col h-full space-y-6 p-6 pt-0 bg-background">
      {/* Header: Project name + New Task + Settings */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-md border">
            <AvatarImage src={data.avatar} alt={data.name} />
            <AvatarFallback className="rounded-md bg-primary text-primary-foreground text-xl font-bold">
              {data.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{data.name}</h1>
            <p className="text-sm text-muted-foreground">Manage project tasks and activities</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => handleOnTaskModelOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
          <CreateTaskDialog projectId={projectId} open={isCreateTaskModelOpen} onOpenChange={handleOnTaskModelOpen} />
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tasks Completed"
          value={`${data.stats.completed.percent}%`}
          subValue={`${data.stats.completed.done}/${data.stats.completed.total} tasks`}
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          color="green"
          percent={data.stats.completed.percent}
        />
        <StatCard
          title="In Progress"
          value={`${data.stats.inProgress.percent}%`}
          subValue={`${data.stats.inProgress.count} tasks ongoing`}
          icon={<Clock className="h-5 w-5 text-blue-500" />}
          color="blue"
          percent={data.stats.inProgress.percent}
        />
        <StatCard
          title="Overdue"
          value={`${data.stats.overdue.percent}%`}
          subValue={`${data.stats.overdue.count} tasks overdue`}
          icon={<AlertCircle className="h-5 w-5 text-red-500" />}
          color="red"
          percent={data.stats.overdue.percent}
        />
        <StatCard
          title="Team Members"
          value={`${data.stats.members.count} members`}
          subValue=""
          icon={<Users className="h-5 w-5 text-purple-500" />}
          color="purple"
          percent={data.stats.members.percent}
          isMember
        />
      </div>

      {/* Tabs: Overview | Timeline | Activity */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Task Distribution - Placeholder cho chart (dùng Recharts hoặc shadcn chart sau) */}
            <TaskContributeChart projectId={projectId} />

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">CW</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm">{item.text}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Comments - Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Comments</CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center bg-muted/30 rounded-md">
                <p className="text-muted-foreground">No comments yet</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timeline & Activity content - thêm sau nếu cần */}
        <TabsContent value="timeline">Timeline view placeholder</TabsContent>
        <TabsContent value="activity">Full activity log placeholder</TabsContent>
      </Tabs>
    </div>
  )
}

export default ProjectDashboardUI;

function StatCard({
  title,
  value,
  subValue,
  icon,
  color,
  percent,
  isMember = false,
}: {
  title: string;
  value: string;
  subValue: string;
  icon: React.ReactNode;
  color: string;
  percent: number;
  isMember?: boolean;
}) {
  return (
    <Card className="text-center">
      <CardContent className="pt-6 pb-4 space-y-3">
        <div className="mx-auto w-16 h-16 relative">
          {/* Circular progress background */}
          <div
            className={cn(
              "absolute inset-0 rounded-full border-8",
              `border-${color}-500/20`
            )}
          />
          {/* Circular progress fill - dùng conic-gradient */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(hsl(var(--${color}-foreground)) ${percent}%, transparent 0)`,
              mask: "radial-gradient(farthest-side, transparent calc(100% - 8px), black calc(100% - 8px))",
              WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 8px), black calc(100% - 8px))",
            }}
          />
          {/* Icon or count ở giữa */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isMember ? (
              <Avatar className="h-8 w-8">
                <AvatarFallback className={`bg-${color}-500/20 text-${color}-700`}>
                  {value.replace("%", "")}
                </AvatarFallback>
              </Avatar>
            ) : (
              icon
            )}
          </div>
        </div>

        <div>
          <p className="text-xl font-bold">{value}</p>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
        </div>
      </CardContent>
    </Card>
  );
}