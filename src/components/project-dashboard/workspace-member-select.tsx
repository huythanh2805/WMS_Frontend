"use client"
import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { FormControl } from '../ui/form'
import { useWorkspaceStore } from '@/stores/workspace-store'
import { useApi } from '@/hooks/use-api'
import { WorkspaceMember } from '@/types'

type Props = {
    onValueChange: (value: string) => void,
    defaultValue: string | null
}

function WorkspaceMemberSelect({onValueChange, defaultValue}: Props) {
    const { workspaceId } = useWorkspaceStore();
    const { loading, request } = useApi();
    const [workspaceMembers, setWorkSpaceMembers] = useState<
        WorkspaceMember[] | null
    >(null);
    const [value, setValue] = useState(defaultValue ?? "")


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
    return (
        <div>
            <Select
                onValueChange={onValueChange}
                defaultValue={value}
            >
                    <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                <SelectContent>
                    {workspaceMembers &&
                        workspaceMembers.map((member) => (
                            <SelectItem key={member.id} value={member.userId}>
                                {member?.user?.name}
                            </SelectItem>
                        ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default WorkspaceMemberSelect