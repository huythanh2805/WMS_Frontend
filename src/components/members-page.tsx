"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, User, Mail, Eye, Save } from "lucide-react";
import { cn } from "@/libs/utils";

// Fake data - sau này fetch từ API
const members = [
  {
    id: "akwasi",
    name: "Akwasi Asante",
    email: "akwasi@example.com",
    role: "OWNER",
    projects: 0,
    avatar: "/avatars/akwasi.jpg", // thay bằng URL thật hoặc placeholder
    fallback: "AA",
  },
  {
    id: "codewave",
    name: "Codwave",
    email: "codewavewithasante@gmail.com",
    role: "VIEWER",
    projects: 0,
    avatar: "/avatars/codewave.jpg",
    fallback: "C",
  },
];

type Member = (typeof members)[number];

export default function WorkspaceMembersPage() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(members[1]); // mặc định chọn Codwave

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Workspace Members</h1>

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
                  {members.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => setSelectedMember(member)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors hover:bg-accent",
                        selectedMember?.id === member.id && "border-primary bg-accent/50"
                      )}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.fallback}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium truncate">{member.name}</p>
                          <Badge
                            variant={member.role === "OWNER" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {member.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {member.projects} project{member.projects !== 1 ? "s" : ""}
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
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                        <AvatarFallback className="text-xl">{selectedMember.fallback}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-2xl">{selectedMember.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {selectedMember.role}
                          </Badge>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {selectedMember.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button variant="destructive" size="sm" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Remove User
                    </Button>
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Assigned Projects</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-muted px-4 py-3 font-medium grid grid-cols-[3fr_1fr] text-sm">
                        <div>Project</div>
                        <div>Access</div>
                      </div>
                      <div className="divide-y">
                        {/* Nếu có project thật thì map ở đây */}
                        <div className="px-4 py-6 text-center text-muted-foreground">
                          No projects assigned yet
                        </div>
                      </div>
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