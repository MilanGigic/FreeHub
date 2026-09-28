"use client";

import JobsAndProjectsSlideOver from "@/components/Clients/ClientPage/JobsAndProjects/JobsAndProjectsSlideOver";
import { useUIStore } from "@/lib/store/useUIStore";
import Projects from "@/components/Clients/ClientPage/JobsAndProjects/Projects";
import { useTranslations } from "next-intl";

export default function JobsAndProjectsPage() {
  const { isJobsAndProjectsSlideOverOpen } = useUIStore();
  const t = useTranslations("projects");

  return (
    <div className="w-full h-full flex flex-col gap-2 md:gap-4">
      <div className="flex flex-col gap-2 md:gap-4 items-center justify-center">
        <input
          type="text"
          placeholder={t("searchProjects")}
          className="p-2 w-64 md:w-md text-center rounded-lg border background-border outline-none text-primary focus-border-accent transition-all duration-300 ease-out placeholder:text-tertiary"
        />
      </div>
      <Projects displayCurrency="RSD" />

      {isJobsAndProjectsSlideOverOpen ? (
        <JobsAndProjectsSlideOver displayCurrency="RSD" />
      ) : null}
    </div>
  );
}
