"use client";

import { useProjectStore } from "@/lib/store/useProjectStore";
import { useLocale, useTranslations } from "next-intl";
import { differenceInDays } from "date-fns";
import { formatMinor } from "@/lib/currency";

export default function SelectedProjectHeader({
  income,
  profit,
  expenses,
  displayCurrency,
}: {
  income: number;
  profit: number;
  expenses: number;
  displayCurrency: string;
}) {
  const t = useTranslations("projects");
  const { selectedProject } = useProjectStore();
  const locale = useLocale();

  if (!selectedProject) return null;

  const activeDays = differenceInDays(
    new Date(),
    new Date(selectedProject.createdAt),
  );

  const fmt = (minor?: number) =>
    minor === undefined ? "—" : formatMinor(minor, displayCurrency, locale);

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
        <p className="text-primary text-4xl font-bold">{fmt(income)}</p>
        <h1 className="primary-slate tracking-widest">
          {t("totalRevenueLabel")}
        </h1>
      </div>
      <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
        <p className="text-primary text-4xl font-bold">{fmt(expenses)}</p>
        <h1 className="primary-slate tracking-widest">{t("totalExpenses")}</h1>
      </div>
      <div className="flex flex-col items-center gap-2 background-elevated border background-border rounded-lg p-4 w-full">
        <p className="text-primary text-4xl font-bold">{fmt(profit)}</p>
        <h1 className="primary-slate tracking-widest">{t("totalProfit")}</h1>
      </div>
    </header>
  );
}
