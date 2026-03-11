'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import useWorkspace from '@/hooks/use-workspace';
import { Project, ProjectAccess } from '@/types';
import { useApi } from '@/hooks/use-api';

interface AssignProjectButtonProps {
  memberName: string | null;
  memberId: string;
  callbackify?: (value: ProjectAccess) => void;
}
export function AssignProjectDialog({
  memberName,
  memberId,
  callbackify,
}: AssignProjectButtonProps) {
  const [open, setOpen] = useState(false);
  const { request } = useApi<ProjectAccess>();
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { workspace } = useWorkspace();
  const handleAssign = async () => {
    if (!selectedProject) return;

    await request(
      {
        url: '/project-access/',
        method: 'post',
        data: {
          workspaceMemberId: memberId,
          projectId: selectedProject.id,
        },
      },
      {
        onSuccess: (data) => {
          if (callbackify) callbackify(data.data);
        },
      }
    );

    // Reset và đóng dialog
    setSelectedProject(null);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Assign Project
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Project</DialogTitle>
          <DialogDescription>
            Chọn project để gán cho <strong>{memberName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCombobox}
                className="w-full justify-between"
              >
                {selectedProject ? selectedProject.name : 'Chọn project...'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Tìm project..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy project nào.</CommandEmpty>
                  <CommandGroup>
                    {workspace?.projects.map((project) => (
                      <CommandItem
                        key={project.id}
                        value={project.name}
                        onSelect={() => {
                          setSelectedProject(
                            selectedProject?.id === project.id ? null : project
                          );
                          setOpenCombobox(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedProject?.id === project.id
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        {project.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedProject}
            className={cn(!selectedProject && 'opacity-70 cursor-not-allowed')}
          >
            Gán project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
