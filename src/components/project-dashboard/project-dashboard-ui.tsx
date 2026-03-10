// components/project-dashboard.tsx
'use client';

import {
  Plus,
  Settings,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { TaskContributeChart } from './pie-chart';
import { CreateTaskDialog } from './task/create-task-dialog';
import RecentActivities from './recent-activities';
import { useApi } from '@/hooks/use-api';
import { useEffect, useState } from 'react';
import { useWorkspaceStore } from '@/stores/workspace-store';
import { ProjectOverview } from '@/types/custome-type';
import { RecentComments } from './recent-comments';
import { AvatarWithFallback } from '../avatar-with-fallback';
import { Task } from '@/types';
import { TaskStatus } from '@/enums';

interface ProjectDashboardProps {
  projectId: string;
}

function ProjectDashboardUI({ projectId }: ProjectDashboardProps) {
  const [isCreateTaskModelOpen, setIsCreateTaskModelOpen] = useState(false);
  const { workspaceId } = useWorkspaceStore()
  const { loading, request } = useApi<ProjectOverview>()
  const [projectOverview, setProjectOverview] = useState<ProjectOverview | null>(null)
  // Fetching project overview
  const fetchProjectOverview = async () => {
    await request({
      url: `/project/overview/${workspaceId}/${projectId}`,
      method: 'get',
    }, {
      onSuccess: (data) => {
        setProjectOverview(data.data)
      }
    });
  };
  useEffect(() => {
    if (!projectId || !workspaceId) return;
    fetchProjectOverview();
  }, [projectId, workspaceId]);

  const handleOnTaskModelOpen = (open: boolean) => {
    setIsCreateTaskModelOpen(open);
  };
  // After create new task => update UI
  const onCreateTaskSuccess = (task: Task) => {
    setProjectOverview((prev) => {
      if (!prev) return prev;
      const newOverview = { ...prev };
      const now = new Date();
      // If task overdue
      if (
        task.dueDate &&
        new Date(task.dueDate) < now &&
        task.status !== TaskStatus.COMPLETED
      ) {
        newOverview.taskOverdue.count += 1;
      } else {
        // if task is not overdue => check status
        switch (task.status) {
          case TaskStatus.COMPLETED:
            newOverview.taskCompleted.count += 1;
            break;

          case TaskStatus.IN_PROGRESS:
          case TaskStatus.IN_REVIEW:
            newOverview.taskInProgress.count += 1;
            break;

          case TaskStatus.TODO:
          case TaskStatus.BACKLOG:
            newOverview.taskNotStarted.count += 1;
            break;
        }
      }

      const total =
        newOverview.taskCompleted.count +
        newOverview.taskInProgress.count +
        newOverview.taskOverdue.count +
        newOverview.taskNotStarted.count;

      const calcPercent = (count: number) =>
        total === 0 ? 0 : Math.round((count / total) * 100);

      newOverview.taskCompleted.total = total;
      newOverview.taskInProgress.total = total;
      newOverview.taskOverdue.total = total;
      newOverview.taskNotStarted.total = total;

      newOverview.taskCompleted.percent = calcPercent(newOverview.taskCompleted.count);
      newOverview.taskInProgress.percent = calcPercent(newOverview.taskInProgress.count);
      newOverview.taskOverdue.percent = calcPercent(newOverview.taskOverdue.count);
      newOverview.taskNotStarted.percent = calcPercent(newOverview.taskNotStarted.count);

      return newOverview;
    });


  }
  return (
    <div className="flex flex-col h-full space-y-6 p-6 pt-0 bg-background">
      {/* Header: Project name + New Task + Settings */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AvatarWithFallback
            name={projectOverview?.project.name}
            className='h-12 w-12 '
            fallbackClassName='text-lg'
          />
          <div>
            <h1 className="text-2xl font-bold">{projectOverview?.project?.name}</h1>
            <p className="text-sm text-muted-foreground">
              Manage project tasks and activities
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => handleOnTaskModelOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
          <CreateTaskDialog
            projectId={projectId}
            open={isCreateTaskModelOpen}
            onOpenChange={handleOnTaskModelOpen}
            callback={onCreateTaskSuccess}
          />
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Tasks Completed"
          value={`${projectOverview?.taskCompleted.percent ?? 0}%`}
          subValue={`${projectOverview?.taskCompleted.count ?? 0}/${projectOverview?.taskCompleted.total ?? 0} tasks`}
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          color="green"
          percent={projectOverview?.taskCompleted?.percent ?? 0}
        />
        <StatCard
          title="In Progress"
          value={`${projectOverview?.taskInProgress?.percent ?? 0}%`}
          subValue={`${projectOverview?.taskInProgress.count ?? 0} tasks ongoing`}
          icon={<Clock className="h-5 w-5 text-blue-500" />}
          color="blue"
          percent={projectOverview?.taskInProgress?.percent ?? 0}
        />
        <StatCard
          title="Overdue"
          value={`${projectOverview?.taskOverdue?.percent ?? 0}%`}
          subValue={`${projectOverview?.taskOverdue?.count ?? 0} tasks overdue`}
          icon={<AlertCircle className="h-5 w-5 text-red-500" />}
          color="red"
          percent={projectOverview?.taskOverdue?.percent ?? 0}
        />
        <StatCard
          title="Team Members"
          value={`${projectOverview?.members?.count ?? 0} members`}
          subValue=""
          icon={<Users className="h-5 w-5 text-purple-500" />}
          color="purple"
          percent={projectOverview?.members?.percent ?? 0}
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
            <TaskContributeChart projectOverview={projectOverview} />

            {/* Recent Activity */}
            <RecentActivities projectId={projectId} />

            {/* Recent Comments - Placeholder */}
            <RecentComments projectId={projectId} />
          </div>
        </TabsContent>

        {/* Timeline & Activity content - thêm sau nếu cần */}
        <TabsContent value="timeline">Timeline view placeholder</TabsContent>
        <TabsContent value="activity">
          Full activity log placeholder
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProjectDashboardUI;

function StatCard({
  title,
  value,
  subValue,
  icon,
  color,
  percent = 0,
  isMember = false,
}: {
  title: string;
  value: string;
  subValue: string;
  icon: React.ReactNode;
  color: string;
  percent: number | null;
  isMember?: boolean;
}) {
  return (
    <Card className="text-center">
      <CardContent className="pt-6 pb-4 space-y-3">
        <div className="mx-auto w-16 h-16 relative">
          {/* Circular progress background */}
          <div
            className={cn(
              'absolute inset-0 rounded-full border-8',
              `border-${color}-500/20`
            )}
          />
          {/* Circular progress fill - dùng conic-gradient */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(hsl(var(--${color}-foreground)) ${percent}%, transparent 0)`,
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 8px), black calc(100% - 8px))',
              WebkitMask:
                'radial-gradient(farthest-side, transparent calc(100% - 8px), black calc(100% - 8px))',
            }}
          />
          {/* Icon or count ở giữa */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isMember ? (
              <Avatar className="h-8 w-8">
                <AvatarFallback
                  className={`bg-${color}-500/20 text-${color}-700`}
                >
                  {value.replace('%', '')}
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
          {subValue && (
            <p className="text-xs text-muted-foreground mt-1">{subValue}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
