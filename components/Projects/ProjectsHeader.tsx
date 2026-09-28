"use client";

import { useRates } from "@/hooks/useRates";
import { convertMinor, formatMinor, toMinor } from "@/lib/currency";
import { ProjectFinance } from "@/lib/store/useProjectStore";
import { Project } from "@/types/types";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

export default function ProjectsHeader({
  displayCurrency = "RSD",
  projects,
  projectFinances,
}: {
  displayCurrency: string;
  projects: Project[];
  projectFinances: ProjectFinance[];
}) {
  const t = useTranslations("projects");
  const locale = useLocale();

  const financeCurrencies = projectFinances?.map((f) => f.currency);
  const rates = useRates([...financeCurrencies!, displayCurrency]);

  const totalRevenue = useMemo(() => {
    if (!rates) return 0;

    let revenue = 0;
    for (const f of projectFinances!) {
      const minor = convertMinor(
        toMinor(f.amount),
        f.currency ?? displayCurrency,
        displayCurrency,
        rates,
      );

      if (f.type === "income") revenue += minor;
    }

    return revenue;
  }, [projectFinances, rates, displayCurrency]);

  const fmt = (minor?: number) =>
    minor === undefined ? "—" : formatMinor(minor, displayCurrency, locale);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 w-full min-w-0">
      <div className="background-elevated border background-border flex flex-col items-center justify-center rounded-xl sm:rounded-2xl p-2.5 sm:p-4 w-full min-w-0 overflow-hidden">
        <p className="primary-cyan text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide sm:tracking-widest mb-1.5 sm:mb-4 md:mb-6 truncate max-w-full">
          {projects.length}
        </p>
        <p className="text-primary text-[10px] sm:text-xs md:text-sm lg:text-base uppercase tracking-wide sm:tracking-widest text-center leading-tight break-words">
          {t("totalProjects")}
        </p>
      </div>
      <div className="background-elevated border background-border flex flex-col items-center justify-center rounded-xl sm:rounded-2xl p-2.5 sm:p-4 w-full min-w-0 overflow-hidden">
        <p className="primary-purple text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide sm:tracking-widest mb-1.5 sm:mb-4 md:mb-6 truncate max-w-full">
          {
            projects.filter(
              (project) =>
                project.status === "active" || project.status === "in_progress",
            ).length
          }
        </p>
        <p className="text-primary text-[10px] sm:text-xs md:text-sm lg:text-base uppercase tracking-wide sm:tracking-widest text-center leading-tight break-words">
          {t("activeInProgress")}
        </p>
      </div>
      <div className="background-elevated border background-border flex flex-col items-center justify-center rounded-xl sm:rounded-2xl p-2.5 sm:p-4 w-full min-w-0 col-span-2 lg:col-span-4 overflow-hidden">
        <p className="primary-green text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide sm:tracking-widest mb-1.5 sm:mb-4 md:mb-6 truncate max-w-full">
          {fmt(totalRevenue)}
        </p>
        <p className="text-primary text-[10px] sm:text-xs md:text-sm lg:text-base uppercase tracking-wide sm:tracking-widest text-center leading-tight break-words">
          {t("totalRevenue")}
        </p>
      </div>
    </div>
  );
}
