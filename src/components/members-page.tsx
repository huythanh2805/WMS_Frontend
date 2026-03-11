'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mail, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import useWorkspaceMember from '@/hooks/use-workspace-member';
import { AvatarWithFallback } from './avatar-with-fallback';
import { ProjectAccess, WorkspaceMember } from '@/types';
import { AccessLevel } from '@/enums';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useApi } from '@/hooks/use-api';
import { AssignProjectDialog } from './assign-project-dialog';
import { RemoveAlrtDialog } from './remove-alert.dialog';

export default function WorkspaceMembersPage() {
  const { request } = useApi<WorkspaceMember>();
  const { workspaceMembers, setWorkSpaceMembers, loading } =
    useWorkspaceMember();
  const [selectedMember, setSelectedMember] = useState<WorkspaceMember>();
  useEffect(() => {
    if (workspaceMembers && !selectedMember)
      setSelectedMember(workspaceMembers[0]);
  }, [workspaceMembers]);

  const handleChangeAccessLevel = async (
    projectAccessId: string,
    accessLevel: AccessLevel
  ) => {
    await request({
      url: '/project-access/' + projectAccessId,
      method: 'patch',
      data: {
        accessLevel,
      },
    });
  };
  // Delete workspace-member
  const handleDeleteWorkspaceMember = async (workspaceMemberId: string) => {
    await request(
      {
        url: '/workspace-member/' + workspaceMemberId,
        method: 'delete',
      },
      {
        onSuccess: (data) => {
          setWorkSpaceMembers((pre) => {
            if (!pre) return pre;
            return pre.filter((item) => item.id != data.data.id);
          });
          if (workspaceMembers) setSelectedMember(workspaceMembers[0]);
        },
      }
    );
  };
  // Callback after assigning project
  const onAssign = (projectAccess: ProjectAccess) => {
    setWorkSpaceMembers((prev) => {
      if (!prev) return prev;

      const updated = prev.map((workspaceMember) =>
        workspaceMember.id === projectAccess.workspaceMemberId
          ? {
              ...workspaceMember,
              projectAccess: [
                ...(workspaceMember.projectAccess ?? []),
                projectAccess,
              ],
            }
          : workspaceMember
      );

      const newSelected = updated.find(
        (m) => m.id === projectAccess.workspaceMemberId
      );

      setSelectedMember(newSelected);

      return updated;
    });
  };
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          Workspace Members
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left - Workspace Members List */}
          <Card className="lg:col-span-1 h-fit lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle>Workspace Members</CardTitle>
              <CardDescription>
                Manage your workspace members and their access levels.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-fit pr-4">
                <div className="space-y-3">
                  {workspaceMembers &&
                    workspaceMembers.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => setSelectedMember(member)}
                        className={cn(
                          'flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent',
                          selectedMember?.id === member.id &&
                            'border-primary bg-accent/50'
                        )}
                      >
                        <AvatarWithFallback avatar={member?.user?.image} />

                        <div className="flex-1 min-w?-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">
                              {member?.user?.name}
                            </p>
                            <Badge
                              variant={
                                member.accessLevel === AccessLevel.OWNER
                                  ? 'destructive'
                                  : 'secondary'
                              }
                              className="text-xs"
                            >
                              {member?.accessLevel}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {member?.projectAccess?.length} project
                            {member?.projectAccess?.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Right - Member Details */}
          <div className="lg:col-span-2">
            {selectedMember ? (
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <AvatarWithFallback
                        avatar={selectedMember?.user?.image}
                      />
                      <div>
                        <CardTitle className="text-2xl">
                          {selectedMember.user.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            {selectedMember.accessLevel}
                          </Badge>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {selectedMember.user.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {selectedMember.accessLevel !== AccessLevel.OWNER && (
                      <RemoveAlrtDialog
                        subject={selectedMember}
                        getId={(selectedMember) => selectedMember.id}
                        getName={(selectedMember) =>
                          selectedMember?.user?.name as any
                        }
                        title="Xóa thành viên"
                        description={`Bạn có chắc muốn xóa ${selectedMember.user.name} khỏi workspace?`}
                        confirmText="Xóa thành viên"
                        onConfirm={handleDeleteWorkspaceMember}
                      />
                    )}
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold tracking-tight">
                      Assigned Projects
                    </h3>

                    <div className="border rounded-xl overflow-hidden bg-card shadow-sm">
                      {/* Header */}
                      <div className="bg-muted/50 px-6 py-3 grid grid-cols-[minmax(200px,3fr)_minmax(120px,1fr)_minmax(100px,1fr)] text-sm font-medium text-muted-foreground border-b">
                        <div>Project</div>
                        <div className="px-2.5">Access</div>
                        <div className="text-center">Chức năng</div>
                      </div>

                      {/* Body */}
                      <div className="divide-y divide-border">
                        {/* Trường hợp chưa có project */}
                        {selectedMember.projectAccess.length === 0 ? (
                          <div className="px-6 py-12 text-center">
                            <p className="text-muted-foreground text-sm">
                              No projects assigned yet
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Invite or assign projects to this member
                            </p>
                          </div>
                        ) : (
                          /* Map projects thật ở đây */
                          selectedMember.projectAccess.map((projectAccess) => (
                            <div
                              key={projectAccess.id}
                              className="px-6 py-4 grid grid-cols-[minmax(200px,3fr)_minmax(120px,1fr)_minmax(100px,auto)] items-center hover:bg-muted/30 transition-colors"
                            >
                              {/* Project name */}
                              <div className="font-medium text-foreground truncate">
                                {projectAccess?.project?.name}
                              </div>

                              {/* Access level */}
                              <div>
                                <span
                                  className={cn(
                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                                    projectAccess.accessLevel === 'OWNER'
                                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                                      : projectAccess.accessLevel ===
                                          AccessLevel.MEMBER
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                        : projectAccess.accessLevel ===
                                            AccessLevel.VIEWER
                                          ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                                  )}
                                >
                                  {projectAccess.accessLevel}
                                </span>
                              </div>

                              {/* Chức năng - ô input hoặc nút */}
                              <div className="flex justify-end items-center gap-2">
                                {/* Ví dụ: input để thay đổi access level */}
                                <Select
                                  defaultValue={projectAccess.accessLevel}
                                  onValueChange={(value) =>
                                    handleChangeAccessLevel(
                                      projectAccess.id,
                                      value as AccessLevel
                                    )
                                  }
                                >
                                  <SelectTrigger className="h-8 w-[140px] text-sm">
                                    <SelectValue placeholder="Select access" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value={AccessLevel.OWNER}>
                                      Owner
                                    </SelectItem>
                                    <SelectItem value={AccessLevel.MEMBER}>
                                      Member
                                    </SelectItem>
                                    <SelectItem value={AccessLevel.VIEWER}>
                                      Viewer
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Optional: Nút Assign thêm project */}
                    <div className="flex justify-end">
                      <AssignProjectDialog
                        memberName={selectedMember?.user?.name || null}
                        memberId={selectedMember.id}
                        callbackify={onAssign}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-[400px] flex items-center justify-center text-muted-foreground">
                Select a member to view details
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
