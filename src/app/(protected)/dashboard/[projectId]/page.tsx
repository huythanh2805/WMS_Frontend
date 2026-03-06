import { ProjectDashboard } from "@/components/project-dashboard";


export default async function ProjectPage({ params }: { params: { projectId: string } }) {
  const { projectId } = await params
  return (
    <div className="h-screen overflow-auto">
      <ProjectDashboard projectId={projectId} />
    </div>
  );
}