import { AccessLevel, FileType, InvitationStatus, TaskPriority, TaskStatus } from '@/enums';
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
  projectAccess: ProjectAccess[]
  createdAt: string;
  updatedAt: string;
};
export type ProjectAccess = {
  id: string;
  workspaceMemberId: string;
  WorkspaceMember: WorkspaceMember,
  projectId: string;
  project: Project;
  accessLevel: AccessLevel;
  createdAt: Date;
  updatedAt: Date;
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
  taskId: string,
  updatedById: string,
  updatedBy?: User,
  createdAt: Date
  updatedAt: Date
}
export type Activity = {
  id: string;
  type: string;
  description: string;
  projectId: string;
  userId: string;
  project: Project,
  createdAt: Date;
  user: User,
}
export type Invitation = {
  id: string;
  email: string;
  token: string;
  workspaceId: string;
  invitedById: string;
  accessLevel: AccessLevel;
  status: InvitationStatus;
  expiresAt: Date;
  createdAt: Date;
  workspace: Workspace;
  invitedBy: User
};