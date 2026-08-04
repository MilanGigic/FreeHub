"use client";

import { useProjectStore } from "@/lib/store/useProjectStore";
import { useTranslations } from "next-intl";
import { differenceInDays } from "date-fns";

export default function SelectedProjectHeader() {
  const t = useTranslations("projects");
  const { selectedProject } = useProjectStore();

  if (!selectedProject) return null;

  const activeDays = differenceInDays(
    new Date(),
    new Date(selectedProject.createdAt),
  );

  return (
    <header className="w-full text-center flex flex-col md:flex-row gap-2">
      <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
        <p className="text-primary text-4xl font-bold">
          {selectedProject.totalHoursWorked ?? 0}
        </p>
        <h1 className="primary-slate tracking-widest">{t("totalHours")}</h1>
      </div>
      <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
        <p className="text-primary text-4xl font-bold">{activeDays}</p>
        <h1 className="primary-slate tracking-widest">{t("activeDays")}</h1>
      </div>
      <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
        <p className="text-primary text-4xl font-bold">
          $
          {Number(selectedProject.totalRevenue || 0).toLocaleString("en-US", {
            maximumFractionDigits: 0,
          })}
        </p>
        <h1 className="primary-slate tracking-widest">
          {t("totalRevenueLabel")}
        </h1>
      </div>
      <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
        <p className="text-primary text-4xl font-bold">
          $
          {Number(selectedProject.totalExpenses || 0).toLocaleString("en-US", {
            maximumFractionDigits: 0,
          })}
        </p>
        <h1 className="primary-slate tracking-widest">{t("totalExpenses")}</h1>
      </div>
      <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
        <p className="text-primary text-4xl font-bold">
          $
          {Number(selectedProject.totalProfit || 0).toLocaleString("en-US", {
            maximumFractionDigits: 0,
          })}
        </p>
        <h1 className="primary-slate tracking-widest">{t("totalProfit")}</h1>
      </div>
    </header>
  );
}
