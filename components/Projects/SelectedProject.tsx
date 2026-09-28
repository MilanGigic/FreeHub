"use client";

import CalendarEntries from "./CalendarEntries";
import { MouseEvent, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchProjectById } from "@/actions/projects/fetchProjectById";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { fetchDataForSelectedDate } from "@/actions/projects/calendar/fetchDataForSelectedDate";
import SelectedProjectHeader from "./SelectedProjectHeader";
import SelectedProjectSkeleton from "./SelectedProjectSkeleton";
import Revenue from "./Revenue";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectCalendar from "./ProjectCalendar";
import { useTranslations } from "next-intl";
import { useRates } from "@/hooks/useRates";
import { convertMinor, toMinor } from "@/lib/currency";

function mostCommon(
  values: ("USD" | "EUR" | "GBP" | "JPY" | "RSD" | "CAD")[] | undefined,
): string | null {
  if (!values) return null;
  const counts = new Map<string, number>();
  for (const v of values) if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

const tabs = [
  { key: "calendar", labelKey: "calendar" },
  { key: "revenue", labelKey: "revenueTab" },
] as const;

export default function SelectedProject({
  displayCurrency: preferred,
}: {
  displayCurrency?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "calendar";
  const t = useTranslations("projects");

  const {
    selectedProject,
    selectedDate,
    setSelectedProject,
    setNote,
    setHoursWorked,
    projectFinances,
  } = useProjectStore();

  const financeCurrencies = projectFinances?.map((proj) => proj.currency);
  const displayCurrency = preferred ?? mostCommon(financeCurrencies) ?? "USD";

  const rates = useRates([
    ...(financeCurrencies as (string | null | undefined)[]),
    displayCurrency,
  ]);

  useEffect(() => {
    (async () => {
      if (!selectedProject) {
        const projectId = pathname.split("/").pop();
        if (!projectId) return;
        const project = await fetchProjectById(projectId);
        if (project.success) {
          if (!project.data) return;
          setSelectedProject(project.data);
        }
      } else return;
    })();
  }, [setSelectedProject, pathname, selectedProject]);

  useEffect(() => {
    (async () => {
      if (!selectedProject || !selectedDate) return;
      const result = await fetchDataForSelectedDate(
        selectedProject.id,
        selectedDate,
      );
      if (result.success) {
        setNote(result.data?.note ?? "");
        setHoursWorked(result.data?.hoursWorked ?? null);
      }
    })();
  }, [selectedProject, selectedDate, setNote, setHoursWorked]);

  const totals = useMemo(() => {
    if (!rates) return null;
    let income = 0;
    let expense = 0;
    for (const fin of projectFinances!) {
      const minor = convertMinor(
        toMinor(fin.amount),
        fin.currency ?? displayCurrency,
        displayCurrency,
        rates,
      );
      if (fin.type === "income") income += minor;
      if (fin.type === "expense") expense += minor;
    }
    return { income, expense };
  }, [projectFinances, rates, displayCurrency]);

  if (!totals) return 0;

  const profit = selectedProject?.totalProfit
    ? Number(totals.income - totals.expense)
    : 0;

  if (!selectedProject) return <SelectedProjectSkeleton />;

  const handleBack = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.back();
  };

  return (
    <div className="p-4 flex flex-col gap-2 md:gap-4 w-full h-full">
      <div className="flex w-full p-2 background-elevated gap-2">
        <button
          className="flex items-center gap-2 text-gray-500 uppercase font-semibold hover:text-(--accent-slate) transition-all cursor-pointer"
          onClick={(e) => handleBack(e)}
        >
          <ArrowLeft size={20} />
          {t("back")}
        </button>
        <div className="h-full border background-border" />
        <Link
          href={"/projects"}
          className="text-gray-500 uppercase font-semibold hover:text-(--accent-slate) transition-all"
        >
          {t("title")}
        </Link>
        <div className="h-full border background-border" />
        <h1 className="text-primary uppercase font-semibold">
          {selectedProject.name} -{" "}
          <span className="text-gray-400 lowercase">
            {selectedProject.clientName}
          </span>
        </h1>
      </div>
      <div className="flex items-center gap-2 justify-center p-2">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() =>
              router.push(`/projects/${selectedProject.id}?tab=${tab.key}`)
            }
            className={`text-lg border background-border uppercase font-semibold px-4 py-2 rounded-lg ${activeTab === tab.key ? (tab.key === "calendar" ? "text-primary bg-(--accent-cyan)/20" : "text-primary bg-(--accent-green)/20") : "primary-slate hover:text-primary"} hover:cursor-pointer transition-all duration-300 ease-out`}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>

      <div className="flex flex-col w-full justify-center items-center gap-2 md:gap-4 h-full">
        {activeTab === "calendar" ? (
          <div className="flex flex-col md:grid md:grid-cols-3 w-full h-full gap-2 md:gap-4">
            <div className="col-span-3">
              <SelectedProjectHeader
                income={totals.income}
                profit={profit}
                expenses={totals.expense}
                displayCurrency={displayCurrency}
              />
            </div>
            <div className="col-span-2 h-full">
              <ProjectCalendar />
            </div>

            <CalendarEntries key={selectedDate?.getTime() ?? "no-date"} />
          </div>
        ) : activeTab === "revenue" ? (
          <Revenue displayCurrency={displayCurrency} />
        ) : null}
      </div>
    </div>
  );
}
