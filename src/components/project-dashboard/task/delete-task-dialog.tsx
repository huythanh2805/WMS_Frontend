'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import { useApi } from '@/hooks/use-api';
import { Task } from '@/types';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

interface DeleteTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string | null;
  callBack?: (id: string) => void;
  taskTitle?: string;
}

export function DeleteTaskDialog({
  open,
  onOpenChange,
  taskId,
  callBack,
  taskTitle = 'nhiệm vụ này',
}: DeleteTaskDialogProps) {
  const { loading: isDeleting, request } = useApi<Task>();
  const handleDelete = async () => {
    if (!taskId) return;
    await request(
      {
        url: API_ENDPOINTS.TASK_BY_ID(taskId),
        method: 'delete',
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          if (callBack) callBack(taskId);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Xác nhận xóa
          </DialogTitle>
          <DialogDescription className="pt-2">
            Bạn thực sự muốn xóa{' '}
            <span className="font-medium text-foreground">{taskTitle}</span>
            ?<br />
            Hành động này{' '}
            <span className="font-semibold text-destructive">
              không thể hoàn tác
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="space-x-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Hủy
          </Button>

          <Button
            className="cursor-pointer"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || !taskId}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang xóa...
              </>
            ) : (
              'Xóa nhiệm vụ'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
