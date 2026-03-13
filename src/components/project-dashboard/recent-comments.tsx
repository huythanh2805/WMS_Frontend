'use client';

import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User } from '@/types/user';
import { FindAllResponse, useApi } from '@/hooks/use-api';
import { useEffect, useState } from 'react';
import { AvatarWithFallback } from '../avatar-with-fallback';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

// Định nghĩa type cho Comment (dựa trên schema Prisma của bạn)
export interface Comment {
  id: string;
  content: string;
  createdAt: string | Date; // ISO string hoặc Date
  userId: string;
  taskId: string;
  projectId: string;
  user: User;
  task?: {
    id: string;
    title: string;
  }; // optional, nếu API join task
}

// Props cho component
interface RecentCommentsProps {
  projectId: string;
}

export function RecentComments({ projectId }: RecentCommentsProps) {
  const { loading, request } = useApi<FindAllResponse<Comment>>();
  const [comments, setComments] = useState<Comment[]>([]);
  // Fetching latest comments
  const fetchLatestComments = async () => {
    await request(
      {
        url: API_ENDPOINTS.COMMENT_BY_PROJECT_ID(projectId),
        method: 'get',
      },
      {
        onSuccess: (data) => {
          if (data.data) setComments(data.data.items);
        },
      }
    );
  };
  useEffect(() => {
    if (!projectId) return;
    fetchLatestComments();
  }, [projectId]);

  if (comments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground py-8">
            Chưa có bình luận nào gần đây
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bình luận gần đây</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[320px] pr-4">
          <div className="space-y-4">
            {comments.map((comment) => {
              const timeAgo = formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
                locale: vi,
              });

              return (
                <div
                  key={comment.id}
                  className="flex gap-3 rounded-lg border bg-card p-3 hover:bg-accent/50 transition-colors"
                >
                  {/* avatar */}
                  <AvatarWithFallback
                    avatar={comment.user.image}
                    className="h-9 w-9"
                  />

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">
                        {comment.user.name || 'Người dùng'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {timeAgo}
                      </span>
                    </div>

                    <p className="text-sm line-clamp-2">{comment.content}</p>

                    {comment.task && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Trong task:{' '}
                        <Link
                          href={`/dashboard/${comment.projectId}/task/${comment.task.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {comment.task.title}
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
