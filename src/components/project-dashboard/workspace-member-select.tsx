'use client';
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import useWorkspaceMember from '@/hooks/use-workspace-member';

type Props = {
  onValueChange: (value: string) => void;
  defaultValue: string | null;
};

function WorkspaceMemberSelect({ onValueChange, defaultValue }: Props) {
  const { setWorkSpaceMembers, workspaceMembers } = useWorkspaceMember();
  const [value, setValue] = useState(defaultValue ?? '');

  return (
    <div>
      <Select onValueChange={onValueChange} defaultValue={value}>
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
  );
}

export default WorkspaceMemberSelect;
