import { Workspace } from '@/types';
import { create } from 'zustand';

interface WorkspaceStore {
  workspaceId: string | null;
  setWorkspaceId: (id: string) => void;
  clearWorkspaceId: () => void;
  workspace: Workspace | null;
  workspaces: Workspace[] | null;

  setWorkspace: (workspace: Workspace | null) => void;
  setWorkspaces: (workspaces: Workspace[] | null) => void;

  updateWorkspace: (id: string, data: Partial<Workspace>) => void;
  removeWorkspace: (id: string) => void;
}
export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaceId: null,
  workspace: null,
  workspaces: null,

  setWorkspaceId: (id) => set({ workspaceId: id }),

  clearWorkspaceId: () => set({ workspaceId: null }),

  setWorkspace: (workspace) => set({ workspace }),

  setWorkspaces: (workspaces) => set({ workspaces }),

  updateWorkspace: (id, data) =>
    set((state) => ({
      workspaces:
        state.workspaces?.map((w) => (w.id === id ? { ...w, ...data } : w)) ??
        null,
      workspace:
        state.workspace?.id === id
          ? { ...state.workspace, ...data }
          : state.workspace,
    })),

  removeWorkspace: (id) =>
    set((state) => ({
      workspaces: state.workspaces?.filter((w) => w.id !== id) ?? null,
      workspace: state.workspace?.id === id ? null : state.workspace,
    })),
}));
