// src/components/RemoveAlrtDialog.tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface RemoveAlrtDialogProps<T> {
  subject: T;
  getId: (subject: T) => string;
  getName?: (subject: T) => string;

  onConfirm: (id: string) => void;

  title?: string;
  description?: React.ReactNode | string;

  confirmText?: string;
  cancelText?: string;

  trigger?: React.ReactNode;
}

export function RemoveAlrtDialog<T>({
  subject,
  getId,
  getName,
  onConfirm,
  title = 'Xác nhận xóa',
  description,
  confirmText = 'Xóa',
  cancelText = 'Hủy',
  trigger,
}: RemoveAlrtDialogProps<T>) {
  const name = getName ? getName(subject) : 'mục này';

  const finalDescription =
    description ??
    `Bạn có chắc chắn muốn xóa ${name}? Hành động này không thể hoàn tác.`;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="destructive" size="sm" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>

          <AlertDialogDescription>
            {description ?? `Bạn có chắc chắn muốn xóa ${name}?`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>

          <AlertDialogAction
            onClick={() => onConfirm(getId(subject))}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
