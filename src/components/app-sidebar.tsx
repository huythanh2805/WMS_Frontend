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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconDashboard,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: IconListDetails,
    },
    {
      title: "Analytics",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Projects",
      url: "#",
      icon: IconFolder,
    },
    {
      title: "Team",
      url: "#",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
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
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
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
  const fetchWorkSpace = async () => {
    const res = await axiosAuth.get("/workspace");
    console.log("Workspaces từ API:", res.data);
  }
  React.useEffect(() => {
    fetchWorkSpace()
  })
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
        />
        <NavDocuments items={data.documents} />
        <ProjectSwitcher
          currentProjectId={activeProject}
          projects={mockProjects}
          onProjectChange={(id) => {
            setActiveProject(id);
            router.push(`/dashboard/${id}`);
          }}
          onCreateNew={() => alert("Mở modal tạo project mới")}
        />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
