'use client';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from 'recharts';
import { ProjectOverview } from '@/types/custome-type';

// Chart config (dùng theme variables của shadcn để màu đẹp theo light/dark mode)
const chartConfig = {
  Completed: {
    label: 'Completed',
    color: 'var(--chart-1)',
  },
  'In Progress': {
    label: 'In Progress',
    color: 'var(--chart-2)',
  },
  Overdue: {
    label: 'Overdue',
    color: 'var(--chart-3)',
  },
  'Not Started': {
    label: 'Not Started',
    color: 'var(--chart-4)',
  },
} satisfies ChartConfig;
interface ProjectDashboardProps {
  projectOverview: ProjectOverview | null;
}
export function TaskContributeChart({
  projectOverview,
}: ProjectDashboardProps) {
  const data = React.useMemo(() => {
    return {
      taskDistribution: [
        {
          name: 'Completed',
          value: projectOverview?.taskCompleted?.count ?? 0,
          fill: 'var(--chart-1)',
        },
        {
          name: 'In Progress',
          value: projectOverview?.taskInProgress?.count ?? 0,
          fill: 'var(--chart-4)',
        },
        {
          name: 'Overdue',
          value: projectOverview?.taskOverdue?.count ?? 0,
          fill: 'var(--chart-3)',
        },
        {
          name: 'Not Started',
          value: projectOverview?.taskNotStarted?.count ?? 0,
          fill: 'var(--chart-2)',
        },
      ],
    };
  }, [projectOverview]);
  return (
    <div>
      {/* Task Distribution - Pie Chart thật */}
      <Card className="col-span-1 lg:col-span-1">
        <CardHeader>
          <CardTitle>Task Distribution</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.taskDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50} // làm donut nếu muốn, hoặc 0 cho pie đầy
                  label
                  paddingAngle={2}
                >
                  {data.taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Legend
                  content={({ payload }) => (
                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                      {payload?.map((entry, index) => (
                        <div
                          key={`legend-${index}`}
                          className="flex items-center gap-2"
                        >
                          <div
                            className={`h-3 w-3 rounded-full ${entry.color}`}
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-sm">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Showing total task count for the project
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
