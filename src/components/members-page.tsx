'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Mail, Eye, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import useWorkspaceMember from '@/hooks/use-workspace-member';
import { AvatarWithFallback } from './avatar-with-fallback';
import { WorkspaceMember } from '@/types';
import { AccessLevel } from '@/enums';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';


export default function WorkspaceMembersPage() {
  const { workspaceMembers, setWorkSpaceMembers, loading } = useWorkspaceMember()
  const [selectedMember, setSelectedMember] = useState<WorkspaceMember>();
  useEffect(() => {
    if (workspaceMembers) setSelectedMember(workspaceMembers[0])
  }, [workspaceMembers])
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
                  {workspaceMembers && workspaceMembers.map((member) => (
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
                      <AvatarWithFallback avatar={selectedMember?.user?.image} />
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

                    {
                      selectedMember.accessLevel !== AccessLevel.OWNER &&
                      (<Button variant="destructive" size="sm" className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Remove User
                      </Button>)
                    }
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
                        <div className='px-2.5'>Access</div>
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
                          selectedMember.projectAccess.map((project) => (
                            <div
                              key={project.id}
                              className="px-6 py-4 grid grid-cols-[minmax(200px,3fr)_minmax(120px,1fr)_minmax(100px,auto)] items-center hover:bg-muted/30 transition-colors"
                            >
                              {/* Project name */}
                              <div className="font-medium text-foreground truncate">
                                {project?.project?.name}
                              </div>

                              {/* Access level */}
                              <div>
                                <span
                                  className={cn(
                                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                    project.accessLevel === "OWNER"
                                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                                      : project.accessLevel === AccessLevel.MEMBER
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                        : project.accessLevel === AccessLevel.VIEWER
                                          ? "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                                          : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                  )}
                                >
                                  {project.accessLevel}
                                </span>
                              </div>

                              {/* Chức năng - ô input hoặc nút */}
                              <div className="flex justify-end items-center gap-2">
                                {/* Ví dụ: input để thay đổi access level */}
                                <Select
                                  defaultValue={project.accessLevel}
                                  onValueChange={(value) => {
                                    if (value === "NONE") {
                                      // Xử lý remove khỏi project
                                      console.log("Remove user from project:", project.id);
                                      // Gọi API remove hoặc mutate
                                    } else {
                                      // Xử lý thay đổi access level
                                      console.log("Change access level to:", value, "for project:", project.id);
                                      // Gọi API update ProjectAccess
                                    }
                                  }}
                                >
                                  <SelectTrigger className="h-8 w-[140px] text-sm">
                                    <SelectValue placeholder="Select access" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value={AccessLevel.OWNER}>Owner</SelectItem>
                                    <SelectItem value={AccessLevel.MEMBER}>Member</SelectItem>
                                    <SelectItem value={AccessLevel.VIEWER}>Viewer</SelectItem>
                                    <SelectItem value="NONE" className="text-destructive font-medium">
                                      Remove
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
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                        Assign Project
                      </button>
                    </div>
                  </div>

                  {/* Có thể thêm các field edit role, permissions ở đây sau */}
                </CardContent>

                <CardContent className="flex justify-end pt-2">
                  <Button className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
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
