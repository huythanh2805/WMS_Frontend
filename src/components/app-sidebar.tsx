'use client';

import * as React from 'react';
import {
  IconDatabase,
  IconHelp,
  IconInnerShadowTop,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';

import { NavDocuments } from '@/components/nav-documents';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { WorkspaceSwitcher } from './workspace-switcher';
import { ProjectSwitcher } from './project-switcher';
import { useParams, useRouter } from 'next/navigation';
import { CreateProjectDialog } from './project-dashboard/create-project';
import { CreateWorkSpaceDialog } from './create-workspace-dialog';
import { FindAllResponse, useApi } from '@/hooks/use-api';
import { Project, Workspace } from '@/types';
import { useUserStore } from '@/stores/user-store';
import { Skeleton } from './ui/skeleton';
import { useWorkspaceStore } from '@/stores/workspace-store';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navSecondary: [
    {
      title: 'Settings',
      url: '/dashboard/settings',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp,
    },
    {
      title: 'Search',
      url: '#',
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: 'Home',
      url: '/dashboard',
      icon: IconDatabase,
    },
    {
      name: 'My tasks',
      url: '/dashboard/tasks',
      icon: IconReport,
    },
    {
      name: 'Members',
      url: '/dashboard/members',
      icon: IconUsers,
    },
    {
      name: 'Settings',
      url: '/dashboard/settings',
      icon: IconSettings,
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const params = useParams()
  const projectId = params.projectId as string
  const { user, isLoading } = useUserStore();
  const { setWorkspaceId } = useWorkspaceStore();
  const { loading: isWorkSpaceLoading, request: workspaceRequest } = useApi();
  const { loading: isProjectLoading, request: projectRequest } = useApi<FindAllResponse<Project>>();
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([]);
  const [activeWorkspaceID, setActiveWorkspaceID] = React.useState<
    string | null
  >(null);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [activeProjectID, setActiveProjectID] = React.useState<string | null >(
    null
  );
  const [isCreateProjectModelOpen, setIsCreateProjectModalOpen] =
    React.useState(false);
  const [isCreateWorkspaceModelOpen, setIsCreateWorkspaceModalOpen] =
    React.useState(false);
  // Fetching workspaces
  const fetchWorkSpaces = async () => {
    const res = await workspaceRequest({
      url: '/workspace',
      method: 'get',
    });
    const result: Workspace[] = res?.data?.items;
    if(!result) return 
    // Set active-workspace and add isPersonal field
    setActiveWorkspaceID(result[0]?.id);
    setWorkspaces(
      result.map((item) =>
        item.ownerId == user?.id ? { ...item, isPersonal: true } : item
      )
    );
  };
  React.useEffect(() => {
    fetchWorkSpaces();
  }, [user]);
  // Fetching projects
  const fetchProjects = async () => {
    const res = await projectRequest({
      url: `/project/${activeWorkspaceID}`,
      method: 'get',
    });
    const projects = res?.data?.items;
    if(!projects) return
    // set projects and activeProjectId
    const activeProject = projects.find((p) => p.id === projectId) || projects[0]
    setActiveProjectID(activeProject?.id || "");
    setProjects(projects);
  };
  React.useEffect(() => {
    if (activeWorkspaceID) {
      fetchProjects();
      setWorkspaceId(activeWorkspaceID);
    }
  }, [activeWorkspaceID, user]);
  const handleOnProjectModelOpen = (isOpen: boolean) => {
    setIsCreateProjectModalOpen(isOpen);
  };
  const handleOnWorkspaceModelOpen = (isOpen: boolean) => {
    setIsCreateWorkspaceModalOpen(isOpen);
  };
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
          currentWorkspaceId={activeWorkspaceID}
          workspaces={workspaces}
          onWorkspaceChange={(id) => {
            setActiveWorkspaceID(id);
            console.log('Chuyển sang workspace:', id);
          }}
          onCreateNew={() => handleOnWorkspaceModelOpen(true)}
        />

        {/* Create Workspace dialog */}
        <CreateWorkSpaceDialog
          fetchWorkSpace={fetchWorkSpaces}
          open={isCreateWorkspaceModelOpen}
          onOpenChange={handleOnWorkspaceModelOpen}
        />

        <NavDocuments items={data.documents} />
        <ProjectSwitcher
          currentProjectId={activeProjectID}
          projects={projects}
          onProjectChange={(id) => {
            setActiveProjectID(id);
            router.push(`/dashboard/${id}`);
          }}
          onCreateNew={() => handleOnProjectModelOpen(true)}
        />

        {/* Create Project dialog */}
        <CreateProjectDialog
          activeWorkSpaceId={activeWorkspaceID}
          fetchProjects={fetchProjects}
          open={isCreateProjectModelOpen}
          onOpenChange={handleOnProjectModelOpen}
        />

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {
          <NavUser user={user}/>
        }
      </SidebarFooter>
    </Sidebar>
  );
}
