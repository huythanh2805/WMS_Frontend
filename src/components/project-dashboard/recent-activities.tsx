'use client';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FindAllResponse, useApi } from '@/hooks/use-api';
import { Activity } from '@/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '../ui/skeleton';
import { AvatarWithFallback } from '../avatar-with-fallback';
import { API_ENDPOINTS } from '@/constants/api-endpoints';

type Props = {
  projectId: string;
};

function RecentActivities({ projectId }: Props) {
  const { loading, request } = useApi<FindAllResponse<Activity>>();
  const [activities, setActivities] = useState<Activity[]>();
  // Fetching activities
  const fetchActivitiesByProjectId = async () => {
    await request(
      {
        url: API_ENDPOINTS.ACTIVITY_BY_PROJECT_ID(projectId),
        method: 'get',
      },
      {
        onSuccess: (data) => {
          if (data.data) setActivities(data.data.items);
        },
      }
    );
  };
  useEffect(() => {
    if (!projectId) return;
    fetchActivitiesByProjectId();
  }, [projectId]);
  return (
    <div className="w-full h-[450px] overflow-y-auto">
      {!loading ? (
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities?.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <AvatarWithFallback
                  avatar={item.user.image}
                  className="h-8 w-8"
                />
                <div>
                  <p className="text-sm">{item.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {JSON.stringify(item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </div>
  );
}

export default RecentActivities;
