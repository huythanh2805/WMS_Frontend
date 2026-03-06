import { create } from 'zustand';

type WorkspaceStore = {
  workspaceId: string | null;
  setWorkspaceId: (id: string) => void;
  clearWorkspaceId: () => void;
};

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaceId: null,

  setWorkspaceId: (id) =>
    set({
      workspaceId: id,
    }),

  clearWorkspaceId: () =>
    set({
      workspaceId: null,
    }),
}));
