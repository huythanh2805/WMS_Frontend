'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useApi } from '@/hooks/use-api';
import { useWorkspaceStore } from '@/stores/workspace-store';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

const formSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  members: z.array(z.string()).refine((value) => value.length > 0, {
    message: 'At least one member must have access',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeWorkSpaceId: string | null;
  fetchProjects: () => void;
}

export function CreateProjectDialog({
  open,
  onOpenChange,
  activeWorkSpaceId,
  fetchProjects,
}: CreateProjectDialogProps) {
  const { loading, request } = useApi();
  const {workspaceId} = useWorkspaceStore()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'First PROJECT',
      description: '',
      members: ['codwave'],
    },
  });

  function onSubmit(values: FormValues) {
    if (!loading && activeWorkSpaceId) {
      request(
        {
          url: API_ENDPOINTS.PROJECT_BY_WORKSPACE_ID(workspaceId as string),
          method: 'post',
          data: { ...values, workspaceId: activeWorkSpaceId },
        },
        {
          onSuccess: (data) => {
            console.log('Create Success', data);
            fetchProjects();
          },
        }
      );
    }
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[425px]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Create a new workspace project for your team.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 py-4"
          >
            {/* Project Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First PROJECT" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter workspace description"
                      className="resize-none min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project Access */}
            <div className="space-y-3">
              <FormLabel>Project Access</FormLabel>
              <p className="text-sm text-muted-foreground">
                Select which workspace members should have access to this
                project.
              </p>

              <div className="space-y-3 pt-2">
                <FormField
                  control={form.control}
                  name="members"
                  render={() => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={form.watch('members').includes('codwave')}
                          onCheckedChange={(checked) => {
                            const current = form.getValues('members') || [];
                            if (checked) {
                              form.setValue('members', [...current, 'codwave']);
                            } else {
                              form.setValue(
                                'members',
                                current.filter((m) => m !== 'codwave')
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <label
                          htmlFor="members-codwave"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Codwave (Owner)
                        </label>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Nếu sau này có nhiều member thì thêm ở đây */}
              {/* Ví dụ: thêm member khác bằng cách map từ list users */}
            </div>

            <DialogFooter className="gap-2 sm:gap-0 space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Project</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
