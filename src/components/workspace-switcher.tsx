"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Building2 } from "lucide-react";

import { cn } from "@/libs/utils";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Workspace = {
    id: string;
    name: string;
    slug?: string;
    logo?: string;
    isPersonal?: boolean;
};

interface WorkspaceSwitcherProps {
    currentWorkspaceId?: string | null;
    workspaces: Workspace[];
    onWorkspaceChange?: (workspaceId: string) => void;
    onCreateNew?: () => void,
    className?: string;
}

export function WorkspaceSwitcher({
    currentWorkspaceId,
    workspaces = [],
    onWorkspaceChange,
    onCreateNew,
    className,
}: WorkspaceSwitcherProps) {
    const currentWorkspace = workspaces.find((ws) => ws.id === currentWorkspaceId) || workspaces[0];

    const personalWorkspaces = workspaces.filter((ws) => ws.isPersonal);
    const teamWorkspaces = workspaces.filter((ws) => !ws.isPersonal);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    role="combobox"
                    aria-expanded={false}
                    className={cn(
                        "w-full justify-between gap-2 border-dashed text-left font-normal ",
                        "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none",
                        "focus:ring-0 focus:ring-offset-0 focus:outline-none",
                        className
                    )}
                >
                    <div className="flex items-center gap-2 truncate">
                        {currentWorkspace?.logo ? (
                            <Avatar className="h-5 w-5 shrink-0">
                                <AvatarImage src={currentWorkspace.logo} alt={currentWorkspace.name} />
                                <AvatarFallback>
                                    <Building2 className="h-3.5 w-3.5" />
                                </AvatarFallback>
                            </Avatar>
                        ) : (
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        )}

                        <span className="truncate font-medium">
                            {currentWorkspace?.name || "Chọn workspace"}
                        </span>
                    </div>

                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-[240px] p-1">
                {/* Personal workspace */}
                {personalWorkspaces.length > 0 && (
                    <>
                        <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                            Cá nhân
                        </DropdownMenuLabel>

                        {
                            personalWorkspaces.map(workspace => (
                                <DropdownMenuItem
                                    key={workspace.id}
                                    className={cn(
                                        "flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm",
                                        currentWorkspace?.id === workspace.id && "bg-accent"
                                    )}
                                    onSelect={() => onWorkspaceChange?.(workspace.id)}
                                >
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={workspace.logo} />
                                        <AvatarFallback className="text-xs">
                                            {workspace.name.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{workspace.name}</span>
                                    {currentWorkspace?.id === workspace.id && (
                                        <span className="ml-auto text-xs text-muted-foreground">Hiện tại</span>
                                    )}
                                </DropdownMenuItem>
                            ))
                        }

                        <DropdownMenuSeparator className="my-1" />
                    </>
                )}

                {/* Team workspaces */}
                {teamWorkspaces.length > 0 && (
                    <>
                        <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                            Team / Công ty
                        </DropdownMenuLabel>

                        {teamWorkspaces.map((ws) => (
                            <DropdownMenuItem
                                key={ws.id}
                                className={cn(
                                    "flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm",
                                    currentWorkspace?.id === ws.id && "bg-accent"
                                )}
                                onSelect={() => onWorkspaceChange?.(ws.id)}
                            >
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={ws.logo} />
                                    <AvatarFallback className="text-xs">
                                        {ws.name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{ws.name}</span>
                                {currentWorkspace?.id === ws.id && (
                                    <span className="ml-auto text-xs text-muted-foreground">Hiện tại</span>
                                )}
                            </DropdownMenuItem>
                        ))}

                        <DropdownMenuSeparator className="my-1" />
                    </>
                )}

                {/* Nút tạo workspace mới */}
                <DropdownMenuItem onClick={onCreateNew} className="flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm text-primary">
                    <Plus className="h-4 w-4" />
                    <span>Tạo workspace mới</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}