"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { useDataStore } from "@/lib/store/useDataStore";
import { fetchAllProjects } from "@/actions/projects/fetchAllProjects";
import { toast } from "react-toastify";
// import { useUIStore } from "@/lib/store/useUIStore";
import ProjectsMain from "@/components/Projects/ProjectsMain";
import ProjectsHeader from "@/components/Projects/ProjectsHeader";
import ProjectsPageSkeleton from "@/components/Projects/ProjectsPageSkeleton";
import { useState } from "react";

export default function ProjectsPage() {
  const { user } = useAuth();
  const { projects, setProjects, totalRevenue, setTotalRevenue } =
    useDataStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (projects.length === 0) return;
    setTotalRevenue(
      projects
        .reduce((acc, project) => acc + Number(project.totalRevenue || 0), 0)
        .toFixed(2)
        .toString(),
    );
  }, [projects, setTotalRevenue]);

  useEffect(() => {
    (async () => {
      if (!user) return;

      try {
        const res = await fetchAllProjects(user.id);

        if (!res.success) {
          toast.error(res.error);
        }

        if (res.data) {
          if (res.data.length > 0) {
            setProjects(res.data);
          }
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [setProjects, user]);

  if (isLoading) return <ProjectsPageSkeleton />;

  return (
    <div className="background min-h-screen p-3 sm:p-4 md:p-6 font-sans flex flex-col gap-4 sm:gap-6 md:gap-8">
      <ProjectsHeader projects={projects} totalRevenue={totalRevenue} />
      {/* <ProjectsSearch /> */}
      <main>
        <ProjectsMain />
      </main>
    </div>
  );
}
