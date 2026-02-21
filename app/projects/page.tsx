"use client"

import ProjectsHeader from "@/components/Projects/ProjectsHeader";
import ProjectsMain from "@/components/Projects/ProjectsMain";
import SelectedProject from "@/components/Projects/SelectedProject";
import { useUIStore } from "@/lib/store/useUIStore";

export default function ProjectsPage() {
  const {selectedProject} = useUIStore()
  console.log("Selected project: ", selectedProject);
  
  return (
    <div className="w-full h-full flex flex-col gap-2 md:gap-4 relative">

      {selectedProject ? (
        <SelectedProject  />
      ) : null}

      <header>
        <ProjectsHeader />
      </header>

      <main>
        <ProjectsMain />
      </main>
    </div>
  );
}
