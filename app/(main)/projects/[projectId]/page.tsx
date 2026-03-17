"use client";

import { storeTotalHours } from "@/actions/projects/storeTotalHours";
import SelectedProject from "@/components/Projects/SelectedProject";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useEffect } from "react";

export default function SelectedProjectPage() {
  const { selectedProject } = useProjectStore();

  useEffect(() => {
    (async () => {
      if (!selectedProject) return;

      await storeTotalHours(selectedProject.id);
    })();
  }, [selectedProject]);

  return (
    <div className="w-full h-full flex flex-col">
      <SelectedProject />
    </div>
  );
}
