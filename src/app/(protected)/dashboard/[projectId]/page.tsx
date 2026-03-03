import { ProjectDashboard } from "@/components/project-dashboard";


export default function ProjectPage({ params }: { params: { projectId: string } }) {
  return (
    <div className="h-screen overflow-auto">
      <ProjectDashboard projectId={params.projectId} />
    </div>
  );
}