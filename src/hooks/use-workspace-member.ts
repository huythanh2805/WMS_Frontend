import React, { useState } from 'react'
import { useApi } from './use-api';
import { WorkspaceMember } from '@/types';
import { useWorkspaceStore } from '@/stores/workspace-store';


function useWorkspaceMember() {
      const { workspaceId } = useWorkspaceStore();
         const { loading, request } = useApi();
         const [workspaceMembers, setWorkSpaceMembers] = useState<
             WorkspaceMember[] | null
         >(null);
     
         const fetchWorkspaceMembers = async () => {
             if (!loading && workspaceId) {
                 const res = await request({
                     url: `/workspace-member/${workspaceId}`,
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
    loading
  }
}

export default useWorkspaceMember