"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { useDataStore } from "@/lib/store/useDataStore";
import { fetchAllProjects } from "@/actions/projects/fetchAllProjects";
import { toast } from "react-toastify";
import ProjectsMain from "@/components/Projects/ProjectsMain";
import ProjectsHeader from "@/components/Projects/ProjectsHeader";
import ProjectsPageSkeleton from "@/components/Projects/ProjectsPageSkeleton";
import { useState } from "react";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { fetchProjectsFinances } from "@/actions/projects/fetchProjectsFinances";

export default function ProjectsPage() {
  const { user } = useAuth();
  const { projects, setProjects } = useDataStore();
  const { projectFinances, setProjectFinances } = useProjectStore();
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    (async () => {
      if (!user) return;

      try {
        const res = await fetchProjectsFinances(user.id);

        if (!res.success) {
          toast.error(res.message);
        }

        if (res.data) {
          if (res.data.length > 0) {
            setProjectFinances(res.data);
          }
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user, setProjectFinances]);

  if (!projectFinances) return null;

  if (isLoading) return <ProjectsPageSkeleton />;

  return (
    <div className="background min-h-screen py-2 px-0 sm:p-4 md:p-6 font-sans flex flex-col gap-4 sm:gap-6 md:gap-8">
      <ProjectsHeader
        displayCurrency="RSD"
        projects={projects}
        projectFinances={projectFinances}
      />
      <main>
        <ProjectsMain displayCurrency="RSD" />
      </main>
    </div>
  );
}
