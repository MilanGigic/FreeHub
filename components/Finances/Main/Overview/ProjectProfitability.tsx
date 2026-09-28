"use client";

import { useClientStore } from "@/lib/store/useClientStore";
import { useDataStore } from "@/lib/store/useDataStore";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useRates } from "@/hooks/useRates";
import { convertMinor, formatMinor, toMinor } from "@/lib/currency";

function mostCommon(
  values: ("USD" | "EUR" | "GBP" | "JPY" | "RSD" | "CAD")[] | undefined,
): string | null {
  if (!values) return null;
  const counts = new Map<string, number>();
  for (const v of values) if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

export default function ProjectProfitability({
  displayCurrency: preferred,
}: {
  displayCurrency?: string;
}) {
  const t = useTranslations("finances");
  const locale = useLocale();

  const { clients } = useClientStore();
  const { projects } = useDataStore();
  const { projectFinances } = useProjectStore();

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  const financeCurrencies = projectFinances?.map((proj) => proj.currency);
  const displayCurrency = preferred ?? mostCommon(financeCurrencies) ?? "USD";

  const rates = useRates([
    ...(financeCurrencies as (string | null | undefined)[]),
    displayCurrency,
  ]);

  const totalsByProject = useMemo(() => {
    if (!rates) return null;

    const map = new Map<string, { income: number; expense: number }>();

    for (const fin of projectFinances ?? []) {
      const minor = convertMinor(
        toMinor(fin.amount),
        fin.currency ?? displayCurrency,
        displayCurrency,
        rates,
      );

      const entry = map.get(fin.projectId) ?? { income: 0, expense: 0 };
      if (fin.type === "income") entry.income += minor;
      if (fin.type === "expense") entry.expense += minor;
      map.set(fin.projectId, entry);
    }

    return map;
  }, [projectFinances, rates, displayCurrency]);

  const tableLists = [
    t("clientColumn"),
    t("revenueColumn"),
    t("expensesColumn"),
    t("profitColumn"),
  ];

  const filteredProjects = useMemo(() => {
    if (!selectedProjectId) return projects;
    return projects.filter((p) => p.id === selectedProjectId);
  }, [projects, selectedProjectId]);

  const dropdownLabel = selectedProjectId
    ? (projects.find((p) => p.id === selectedProjectId)?.name ??
      t("allProjects"))
    : t("allProjects");

  function renderSelectedClient(clientId: string) {
    const client = clients.find((client) => client.id === clientId);
    if (!client) return null;
    return (
      <h1 className="text-sm text-primary text-center w-full">
        {client.clientName}
      </h1>
    );
  }

  if (!totalsByProject) return null;

  const fmt = (minor?: number) =>
    minor === undefined ? "—" : formatMinor(minor, displayCurrency, locale);

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center border background-border rounded-lg background-elevated p-4">
      <header className="flex w-full justify-between items-center">
        <h1 className="text-lg font-semibold tracking-widest text-primary uppercase">
          {t("projectProfitability")}
        </h1>
        <div className="relative">
          <button
            onClick={() => setOpenDropdown((prev) => !prev)}
            className={`flex items-center gap-2 primary-slate text-sm font-semibold background-elevated py-2 px-4 rounded-lg border transition-all ${openDropdown ? "border-(--accent-cyan)" : "background-border"}`}
          >
            {dropdownLabel} <ChevronDown className="w-4 h-4 primary-slate" />
          </button>
          {openDropdown ? (
            <div className="flex flex-col gap-2 absolute mt-1 w-full z-10 bg-black/50 rounded-lg">
              <div className="flex flex-col items-center gap-2 background-elevated p-2 rounded-lg border background-border">
                <h1
                  onClick={() => {
                    setSelectedProjectId(null);
                    setOpenDropdown(false);
                  }}
                  className="text-sm font-semibold primary-cyan py-2 px-4 hover:bg-(--border-default) transition-all cursor-pointer w-full text-center rounded-lg"
                >
                  {t("allProjects")}
                </h1>
                {projects.map((project) => (
                  <h1
                    key={project.id}
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setOpenDropdown(false);
                    }}
                    className={`text-sm font-semibold py-2 px-4 hover:bg-(--border-default) transition-all cursor-pointer w-full text-center rounded-lg ${selectedProjectId === project.id ? "primary-cyan" : "primary-slate"}`}
                  >
                    {project.name}
                  </h1>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </header>

      <section className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2 w-full justify-between border-b-2 background-border pb-2">
          {tableLists.map((list) => (
            <h1
              key={list}
              className="text-sm font-semibold primary-slate text-center w-full"
            >
              {list}
            </h1>
          ))}
        </div>
        <div>
          {filteredProjects.length === 0 && (
            <p className="text-sm primary-slate text-center py-4">
              {t("noProjectsFound")}
            </p>
          )}
          {filteredProjects.map((project) => {
            const { income, expense } = totalsByProject.get(project.id) ?? {
              income: 0,
              expense: 0,
            };
            const profit = income - expense;
            return (
              <div key={project.id}>
                <div className="flex items-center gap-2 w-full justify-between border-b background-border py-2">
                  {renderSelectedClient(project.clientId)}
                  <h1 className="text-sm primary-slate text-center w-full">
                    <span className="primary-green ml-0.5">{fmt(income)}</span>
                  </h1>
                  <h1 className="text-sm primary-slate text-center w-full">
                    <span className="primary-red ml-0.5">{fmt(expense)}</span>
                  </h1>
                  <h1 className="text-sm primary-cyan text-center w-full font-semibold">
                    {fmt(profit)}
                  </h1>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
