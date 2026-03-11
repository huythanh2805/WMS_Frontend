import React, { useState } from 'react'
import { useApi } from './use-api';
import { Workspace } from '@/types';
import { useWorkspaceStore } from '@/stores/workspace-store';


function useWorkspace() {
      const { workspaceId } = useWorkspaceStore();
         const { loading, request } = useApi();
         const [workspace, setWorkspace] = useState< Workspace | null >(null);
         const [workspaces, setWorkspaces] = useState<
             Workspace[] | null
         >(null);
        // Delete workspace
        const deleteWorkSpace = async (workspaceId: string) => {
             if (!loading && workspaceId) {
                 const res = await request({
                     url: `/workspace.${workspaceId}`,
                     method: 'delete',
                 });
                 const result: Workspace = res?.data;
             }
         };
        //  fetch all workspace
         const fetchWorkspaces = async (callBackify?: () => void) => {
             if (!loading && workspaceId) {
                 const res = await request({
                     url: `/workspace`,
                     method: 'get',
                 });
                 const result: Workspace[] = res?.data?.items;
                 setWorkspaces(result);
                 if(callBackify)
                    callBackify()
             }
         };
         //  fetch workspace by id
         const fetchWorkSpaceById = async () => {
            if (!loading && workspaceId) {
                 const res = await request({
                     url: `/workspace/${workspaceId}`,
                     method: 'get',
                 });
                 const result: Workspace = res?.data
                 setWorkspace(result);
             }
         }
         React.useEffect(() => {
             fetchWorkSpaceById()
         }, [workspaceId]);
  return {
    workspaces,
    setWorkspaces,
    workspace,
    setWorkspace,
    loading,
    fetchWorkspaces
  }
}

export default useWorkspace