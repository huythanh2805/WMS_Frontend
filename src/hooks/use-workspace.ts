import { useApi } from './use-api';
import { Workspace } from '@/types';
import { useWorkspaceStore } from '@/stores/workspace-store';

function useWorkspace() {
  const { request, loading } = useApi();

  const {
    workspace,
    workspaces,
    setWorkspace,
    setWorkspaces,
    updateWorkspace,
    removeWorkspace,
  } = useWorkspaceStore();

  // delete
  const deleteWorkSpaceById = async (id: string) => {
    if (!loading && id) {
      await request({
        url: `/workspace/${id}`,
        method: 'delete',
      });

      removeWorkspace(id);
    }
  };

  // update
  const updateWorkSpaceById = async (id: string, data: Partial<Workspace>) => {
    if (!loading && id) {
      await request(
        {
          url: `/workspace/${id}`,
          method: 'patch',
          data,
        },
        {
          onSuccess: (data) => {
            updateWorkspace(id, data.data);
          },
        }
      );
    }
  };

  // fetch all
  const fetchWorkspaces = async () => {
    const res = await request({
      url: `/workspace`,
      method: 'get',
    });

    const result: Workspace[] = res?.data?.items;

    setWorkspaces(result);

    return result;
  };

  // fetch by id
  const fetchWorkSpaceById = async (id: string): Promise<Workspace | null> => {
    if (!loading && id) {
      const res = await request(
        {
          url: `/workspace/${id}`,
          method: 'get',
        },
        {
          onSuccess: (data) => {
            setWorkspace(data.data);
          },
        }
      );
      return res?.data;
    }
    return null;
  };

  return {
    workspace,
    workspaces,
    loading,
    fetchWorkspaces,
    fetchWorkSpaceById,
    deleteWorkSpaceById,
    updateWorkSpaceById,
  };
}

export default useWorkspace;
