"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { WorkspaceSwitcher } from "./workspace-switcher"
import { ProjectSwitcher } from "./project-switcher"
import axiosAuth from "@/axios/instant"
import { useRouter } from "next/navigation"
import { CreateProjectDialog } from "./project-dashboard/create-project"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Home",
      url: "/dashboard",
      icon: IconDatabase,
    },
    {
      name: "My tasks",
      url: "/dashboard/tasks",
      icon: IconReport,
    },
    {
      name: "Members",
      url: "/dashboard/members",
      icon: IconUsers,
    },
    {
      name: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
  ],
}
const mockWorkspaces = [
  { id: "personal-1", name: "My Workspace", isPersonal: true },
  { id: "team-1", name: "Công ty ABC", logo: "https://example.com/logo-abc.png" },
  { id: "team-2", name: "Team Dev", logo: "/team-dev.png" },
];
const mockProjects = [
  { id: "proj-1", name: "First PROJECT", color: "blue" },
  { id: "proj-2", name: "Website Redesign 2026", color: "purple" },
  { id: "proj-3", name: "Mobile App v2", color: "green" },
];
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const [activeWs, setActiveWs] = React.useState("personal-1");
  const [activeProject, setActiveProject] = React.useState("proj-1");
  const [isCreateProjectModelOpen, setIsCreateProjectModalOpen] = React.useState(false);
  const [isCreateWorkspaceModelOpen, setIsCreateWorkspaceModalOpen] = React.useState(false);
  const fetchWorkSpace = async () => {
    const res = await axiosAuth.get("/workspace");
    console.log("Workspaces từ API:", res.data);
  }
  React.useEffect(() => {
    fetchWorkSpace()
  })
  const handleOnProjectModelOpen = (isOpen: boolean) => {
    setIsCreateProjectModalOpen(isOpen);
  }
  const handleOnWorkspaceModelOpen = (isOpen: boolean) => {
    setIsCreateWorkspaceModalOpen(isOpen);
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <WorkspaceSwitcher
          currentWorkspaceId={activeWs}
          workspaces={mockWorkspaces}
          onWorkspaceChange={(id) => {
            setActiveWs(id);
            console.log("Chuyển sang workspace:", id);
            // → gọi router.push hoặc set context ở đây
          }}
          onCreateNew={() => handleOnWorkspaceModelOpen(true)}
        />
        {/* Create Workspace dialog */}
        <CreateProjectDialog open={isCreateWorkspaceModelOpen} onOpenChange={handleOnWorkspaceModelOpen} />

        <NavDocuments items={data.documents} />
        <ProjectSwitcher
          currentProjectId={activeProject}
          projects={mockProjects}
          onProjectChange={(id) => {
            setActiveProject(id);
            router.push(`/dashboard/${id}`);
          }}
          onCreateNew={() => handleOnProjectModelOpen(true)}
        />
        {/* Create Project dialog */}
        <CreateProjectDialog open={isCreateProjectModelOpen} onOpenChange={handleOnProjectModelOpen} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
