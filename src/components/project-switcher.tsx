'use client';

import * as React from 'react';
import { ChevronsUpDown, Plus } from 'lucide-react';

import { cn } from '@/libs/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type Project = {
  id: string;
  name: string;
  color?: string; // optional: để tint icon hoặc avatar
  isActive?: boolean;
};

interface ProjectSwitcherProps {
  currentProjectId?: string | null;
  projects: Project[];
  onProjectChange?: (projectId: string) => void;
  onCreateNew?: () => void;
  className?: string;
}

export function ProjectSwitcher({
  currentProjectId,
  projects = [],
  onProjectChange,
  onCreateNew,
  className,
}: ProjectSwitcherProps) {
  const currentProject =
    projects.find((p) => p.id === currentProjectId) || projects[0];

  return (
    <div className={cn('space-y-1', className)}>
      {/* Header giống như ảnh: PROJECTS + nút + */}
      <div className="flex items-center justify-between px-3 py-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          PROJECTS
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onCreateNew}
          title="Tạo project mới"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Dropdown selector */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start gap-2 border-dashed text-left font-normal h-9 px-3 ring-0 outline-0 shadow-none',
              'hover:bg-accent/50',
              'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none',
              'focus:ring-0 focus:ring-offset-0 focus:outline-none'
            )}
          >
            <Avatar className="h-5 w-5 shrink-0 rounded-md">
              <AvatarFallback
                className={cn(
                  'rounded-md text-xs font-medium',
                  currentProject?.color
                    ? `bg-${currentProject.color}-500/20 text-${currentProject.color}-700`
                    : 'bg-primary/10 text-primary'
                )}
              >
                {currentProject
                  ? currentProject.name.slice(0, 2).toUpperCase()
                  : 'P'}
              </AvatarFallback>
            </Avatar>

            <span className="truncate font-medium">
              {currentProject?.name || 'Chọn project'}
            </span>

            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-[220px] p-1">
          <DropdownMenuLabel className="px-2 py-1 text-xs font-medium text-muted-foreground">
            Dự án của bạn
          </DropdownMenuLabel>

          {projects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              className={cn(
                'flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm',
                currentProject?.id === project.id && 'bg-accent'
              )}
              onSelect={() => onProjectChange?.(project.id)}
            >
              <Avatar className="h-6 w-6 rounded-md">
                <AvatarFallback
                  className={cn(
                    'rounded-md text-xs',
                    project.color
                      ? `bg-${project.color}-500/20 text-${project.color}-700`
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {project.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{project.name}</span>
              {currentProject?.id === project.id && (
                <span className="ml-auto text-xs text-muted-foreground">
                  Hiện tại
                </span>
              )}
            </DropdownMenuItem>
          ))}

          {projects.length === 0 && (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">
              Chưa có project nào
            </div>
          )}

          <DropdownMenuSeparator className="my-1" />

          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm text-primary"
            onSelect={onCreateNew}
          >
            <Plus className="h-4 w-4" />
            <span>Tạo project mới</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
