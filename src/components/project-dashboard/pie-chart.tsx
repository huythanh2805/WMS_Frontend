"use client";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts";

// ... (giữ nguyên các import và mock data cũ)

const projectData = {
  // ... giữ nguyên
  taskDistribution: [
    { name: "Completed", value: 45, fill: "hsl(var(--chart-1))" }, // xanh lá
    { name: "In Progress", value: 30, fill: "hsl(var(--chart-2))" }, // xanh dương
    { name: "Overdue", value: 15, fill: "hsl(var(--chart-3))" }, // đỏ
    { name: "Not Started", value: 10, fill: "hsl(var(--chart-4))" }, // xám
  ],
};

// Chart config (dùng theme variables của shadcn để màu đẹp theo light/dark mode)
const chartConfig = {
  Completed: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
  "In Progress": {
    label: "In Progress",
    color: "hsl(var(--chart-2))",
  },
  Overdue: {
    label: "Overdue",
    color: "hsl(var(--chart-3))",
  },
  "Not Started": {
    label: "Not Started",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;
interface ProjectDashboardProps {
  projectId: string;
}
export function TaskContributeChart({ projectId }: ProjectDashboardProps) {
  const data = projectData;

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
                        <div key={`legend-${index}`} className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
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