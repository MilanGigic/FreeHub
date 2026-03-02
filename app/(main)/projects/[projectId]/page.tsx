"use client";

import { storeTotalHours } from "@/actions/projects/storeTotalHours";
import SelectedProject from "@/components/Projects/SelectedProject";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { ArrowLeftFromLine } from "lucide-react";
import { useRouter } from "next/navigation";
import { MouseEvent, useEffect } from "react";

export default function SelectedProjectPage() {
  const router = useRouter();

  const { selectedProject } = useProjectStore();

  useEffect(() => {
    (async () => {
      if (!selectedProject) return;

      await storeTotalHours(selectedProject.id);
    })();
  }, [selectedProject]);

  const handleBack = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.back();
  };
  return (
    <div className="w-full h-full flex flex-col relative">
      <button
        className="flex items-center gap-2 text-primary cursor-pointer uppercase font-semibold hover:text-(--accent-slate) transition-all absolute top-8 left-4"
        onClick={(e) => handleBack(e)}
      >
        <ArrowLeftFromLine />
        Back
      </button>
      <SelectedProject />
    </div>
  );
}
