import { Project } from '.';

type TaskStatusProgress = {
  count: number;
  percent: number;
  total: number;
};
export type ProjectOverview = {
  taskCompleted: TaskStatusProgress;
  taskInProgress: TaskStatusProgress;
  taskOverdue: TaskStatusProgress;
  taskNotStarted: TaskStatusProgress;
  members: TaskStatusProgress;
  project: Project;
};
