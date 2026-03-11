'use client';

import * as React from 'react';
import { Save, Copy, RotateCcw, UserPlus, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useWorkspaceStore } from '@/stores/workspace-store';
import { useApi } from '@/hooks/use-api';
import { Invitation } from '@/types';
import { debounce } from 'lodash';
import { toast } from 'sonner';
import { Skeleton } from './ui/skeleton';
import { RemoveAlrtDialog } from './remove-alert.dialog';
import useWorkspace from '@/hooks/use-workspace';
import { useRouter } from 'next/navigation';
export function WorkspaceSettings() {
  const router = useRouter();
  const { workspaceId } = useWorkspaceStore();
  const {
    workspace,
    deleteWorkSpaceById,
    updateWorkSpaceById,
    fetchWorkSpaceById,
  } = useWorkspace();
  const [invitedEmail, setInvitedEmail] = React.useState<string>('');
  const { request, loading } = useApi<Invitation>();
  const [name, setName] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const inviteLink =
    'https://daily-tm.vercel.app/workspace-invite/e1e122a-fcc0-4704-a655-7a783de70c57/join/xxihUn';

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('Link copied!');
  };

  const handleReset = () => {
    // logic reset link
  };
  const handleInvitation = async () => {
    await request(
      {
        url: '/invitation/send',
        method: 'post',
        data: {
          email: invitedEmail.trim(),
          workspaceId,
        },
      },
      {
        onSuccess: () => {
          setInvitedEmail('');
        },
      }
    );
  };
  const handleInvite = React.useCallback(
    debounce(() => {
      handleInvitation();
    }, 300),
    [invitedEmail]
  );
  // Delete workspace
  const handleDeleteWorkspace = async (workspaceId: string) => {
    await deleteWorkSpaceById(workspaceId);
    router.replace('/dashboard');
    window.location.reload();
  };
  // Update workspace
  const handleUpdateWorkspace = async () => {
    if (!workspaceId) return;
    await updateWorkSpaceById(workspaceId, { name, description });
  };
  // Fetch current workspace
  const onInitFetchWorkspace = async () => {
    if (!workspaceId) return null;
    const data = await fetchWorkSpaceById(workspaceId);
    if (!data) return;
    setName(data?.name);
    setDescription(data?.description);
  };
  React.useEffect(() => {
    onInitFetchWorkspace();
  }, [workspaceId]);
  return (
    <div className="mx-auto max-w-3xl space-y-10 py-10 px-4 sm:px-6 lg:px-8">
      {/* Section 1: General Settings */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-medium tracking-tight flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            Workspace Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your workspace settings and preferences
          </p>
        </div>

        <Card className="border-none shadow-none bg-transparent p-0">
          <CardContent className="p-0 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Workspace Name
              </Label>
              <Input
                id="name"
                className="h-10 bg-background"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter workspace description"
                className="min-h-[80px] resize-none bg-background"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleUpdateWorkspace}
                size="sm"
                className="h-9 px-6"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-12" />

      {/* Section 2: Invite Members */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-medium">Invite Members</h3>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Add new members to your workspace
            </p>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              1 member only you
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {workspaceId ? (
            <div className="flex gap-2">
              <Input
                placeholder="Enter email address"
                className="h-10 flex-1 bg-background"
                value={invitedEmail}
                onChange={(e) => setInvitedEmail(e.target.value)}
              />
              <Button
                onClick={() => handleInvite()}
                variant="outline"
                size="sm"
                className="h-10 px-5"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Invite
              </Button>
            </div>
          ) : (
            <Skeleton className="h-10 w-full" />
          )}

          <div className="space-y-2">
            <Label className="text-sm font-medium">Invite Link</Label>
            <div className="flex items-center gap-2">
              <Input
                value={inviteLink}
                readOnly
                className="h-10 bg-muted/50 font-mono text-sm"
              />
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Separator className="my-12" />

      {/* Section 3: Danger Zone */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">
            Irreversible actions for your workspace
          </p>
        </div>

        <Alert
          variant="destructive"
          className="border-destructive/30 bg-destructive/5"
        >
          <AlertTitle className="text-base font-medium">
            Delete Workspace
          </AlertTitle>
          <AlertDescription className="text-sm mt-1">
            This action cannot be undone. All data will be permanently deleted.
          </AlertDescription>
          <div className="mt-4 col-start-2 flex w-full justify-end">
            {workspace && (
              <RemoveAlrtDialog
                subject={workspace}
                getId={(workspace) => workspace.id}
                getName={(workspace) => workspace.name}
                title="Xóa Workspace"
                description={
                  <>
                    Bạn có chắc muốn xóa{' '}
                    <span className="font-semibold">{workspace.name}</span>{' '}
                    không?
                  </>
                }
                confirmText="Xóa Workspace"
                onConfirm={handleDeleteWorkspace}
              />
            )}
          </div>
        </Alert>
      </section>
    </div>
  );
}
