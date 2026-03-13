import React, { useState } from 'react';
import { useApi } from './use-api';
import { WorkspaceMember } from '@/types';
import { useWorkspaceStore } from '@/stores/workspace-store';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

function useWorkspaceMember() {
  const { workspaceId } = useWorkspaceStore();
  const { loading, request } = useApi();
  const [workspaceMembers, setWorkSpaceMembers] = useState<
    WorkspaceMember[] | null
  >(null);

  const fetchWorkspaceMembers = async () => {
    if (!loading && workspaceId) {
      const res = await request({
        url: API_ENDPOINTS.WORKSPACE_MEMBER_BY_WORKSPACE_ID(workspaceId),
        method: 'get',
      });
      const result: WorkspaceMember[] = res?.data?.items;
      setWorkSpaceMembers(result);
    }
  };
  React.useEffect(() => {
    fetchWorkspaceMembers();
  }, [workspaceId]);
  return {
    workspaceMembers,
    setWorkSpaceMembers,
    loading,
  };
}

export default useWorkspaceMember;
