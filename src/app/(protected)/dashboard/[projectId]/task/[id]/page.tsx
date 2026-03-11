import TaskDetail from '@/components/project-dashboard/task/task-detail';

async function TaskDetailPage({
  params,
}: {
  params: { id: string; projectId: string };
}) {
  const { id, projectId } = await params;
  return (
    <div>
      <TaskDetail taskId={id} projectId={projectId} />
    </div>
  );
}

export default TaskDetailPage;
