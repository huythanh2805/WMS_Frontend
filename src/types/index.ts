import { AccessLevel, FileType, TaskPriority, TaskStatus } from '@/instants';
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
  startDate: Date;
  dueDate: Date;
  assigneeId: string;
  assignedTo: User;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  project: Project;
  attachments:Comment[],
  documentation:   Documentation;
  comments:   Comment[];
};
export type File = {
  id: string
  name: string,
  size: number,
  url: string
  taskId?: string | null
  projectId?: string | null
  type: FileType
  createdAt: Date
}
export type Comment = {
  id: string
  content: string
  projectId: string
  userId: string
  taskId: string
  createdAt: Date
  updatedAt: Date
  user: User
}
export type Documentation = {
  id: string
  content: string
  projectId: string
  taskId: string
  updatedBy?: string | null
  createdAt: Date
  updatedAt: Date
}