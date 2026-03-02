import ProjectsHeader from "@/components/Projects/ProjectsHeader";
import ProjectsMain from "@/components/Projects/ProjectsMain";

export default function ProjectsPage() {
  return (
    <div className="w-full h-full flex flex-col gap-2 md:gap-4 relative">
      <header>
        <ProjectsHeader />
      </header>

      <main>
        <ProjectsMain />
      </main>
    </div>
  );
}
