import { AccessLevel, TaskPriority, TaskStatus } from '@/instants';
import { User } from './user';

export type Workspace = {
  id: string;
  name: string;
  description: string;
  inviteCode: string;
  inviteAt: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};
export type Project = {
  id: string;
  name: string;
  description: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
};
export type WorkspaceMember = {
  id: string;
  userId: string;
  user: User;
  workspaceId: string;
  accessLevel: AccessLevel;
  createdAt: string;
  updatedAt: string;
};
export type Task = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  position: number;
  startDate: string;
  dueDate: string;
  assigneeId: string;
  assignedTo: User;
  projectId: string;
  createdAt: string;
  updatedAt: string;
};
