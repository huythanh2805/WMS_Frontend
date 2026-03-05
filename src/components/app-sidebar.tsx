"use client"

import * as React from "react"
import {
  IconDatabase,
  IconHelp,
  IconInnerShadowTop,
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
import { CreateWorkSpaceDialog } from "./create-workspace-dialog"
import { useApi } from "@/hooks/use-api"
import { Project, Workspace } from "@/types"
import { useUserStore } from "@/stores/userStore"
import { Skeleton } from "./ui/skeleton"

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
// const mockWorkspaces = [
//   { id: "personal-1", name: "My Workspace", isPersonal: true },
//   { id: "team-1", name: "Công ty ABC", logo: "https://example.com/logo-abc.png" },
//   { id: "team-2", name: "Team Dev", logo: "/team-dev.png" },
// ];
// const mockProjects = [
//   { id: "proj-1", name: "First PROJECT", color: "blue" },
//   { id: "proj-2", name: "Website Redesign 2026", color: "purple" },
//   { id: "proj-3", name: "Mobile App v2", color: "green" },
// ];
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const { loading: isWorkSpaceLoading, request: workspaceRequest } = useApi()
  const { loading: isProjectLoading, request: projectRequest } = useApi()
  const { user } = useUserStore()
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([])
  const [activeWorkspaceID, setActiveWorkspaceID] = React.useState<string | null>(null)
  const [projects, setProjects] = React.useState<Project[]>([])
  const [activeProject, setActiveProject] = React.useState("proj-1");
  const [isCreateProjectModelOpen, setIsCreateProjectModalOpen] = React.useState(false);
  const [isCreateWorkspaceModelOpen, setIsCreateWorkspaceModalOpen] = React.useState(false);
  // Fetching workspaces
  const fetchWorkSpaces = async () => {
    const res = await workspaceRequest({
      url: "/workspace",
      method: "get"
    });
    const result: Workspace[] = res.data.items
    // Set active-workspace and add isPersonal field
    setActiveWorkspaceID(result[0].id)
    setWorkspaces(result.map(item =>
      item.ownerId == user?.id ? { ...item, isPersonal: true } : item
    ))
  }
  // Fetching projects
  const fetchProjects = async () => {
    const res = await projectRequest({
      url: `/project/${activeWorkspaceID}`,
      method: "get"
    });
    const result = res.data.items
    setProjects(result)
  }
  React.useEffect(() => {
    fetchWorkSpaces()
  }, [])
  React.useEffect(() => {
    if (activeWorkspaceID) {
      fetchProjects()
    }
  }, [activeWorkspaceID])
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
        {
          isWorkSpaceLoading ?
            <Skeleton className="h-8 w-full bg-gray-200" />
            :
            <WorkspaceSwitcher
              currentWorkspaceId={activeWorkspaceID}
              workspaces={workspaces}
              onWorkspaceChange={(id) => {
                setActiveWorkspaceID(id);
                console.log("Chuyển sang workspace:", id);
              }}
              onCreateNew={() => handleOnWorkspaceModelOpen(true)}
            />
        }
        {/* Create Workspace dialog */}
        <CreateWorkSpaceDialog
          fetchWorkSpace={fetchWorkSpaces}
          open={isCreateWorkspaceModelOpen}
          onOpenChange={handleOnWorkspaceModelOpen} />

        <NavDocuments items={data.documents} />
        {
          isWorkSpaceLoading || isProjectLoading ?
            <Skeleton className="h-16 w-full bg-gray-200" />
            :
            <ProjectSwitcher
              currentProjectId={activeProject}
              projects={projects}
              onProjectChange={(id) => {
                setActiveProject(id);
                router.push(`/dashboard/${id}`);
              }}
              onCreateNew={() => handleOnProjectModelOpen(true)}
            />
        }
        {/* Create Project dialog */}
        <CreateProjectDialog
          activeWorkSpaceId={activeWorkspaceID}
          fetchProjects={fetchProjects}
          open={isCreateProjectModelOpen}
          onOpenChange={handleOnProjectModelOpen} />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
