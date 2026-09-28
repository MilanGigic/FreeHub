import { useRates } from "@/hooks/useRates";
import { convertMinor, formatMinor, toMinor } from "@/lib/currency";
import { useClientStore } from "@/lib/store/useClientStore";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useLocale, useTranslations } from "next-intl";
import { useMemo } from "react";

function mostCommon(
  values: ("USD" | "EUR" | "GBP" | "JPY" | "RSD" | "CAD")[] | undefined,
): string | null {
  if (!values) return null;
  const counts = new Map<string, number>();
  for (const v of values) if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

export default function ProjectBreakdown({
  displayCurrency: preferred,
}: {
  displayCurrency?: string;
}) {
  const { clientProjects } = useClientStore();
  const { projectFinances } = useProjectStore();
  const t = useTranslations("clients");
  const locale = useLocale();

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
    t("project"),
    t("revenueColumn"),
    t("expensesColumn"),
    t("profitColumn"),
    t("marginColumn"),
  ];

  if (!totalsByProject) return null;

  const fmt = (minor?: number) =>
    minor === undefined ? "—" : formatMinor(minor, displayCurrency, locale);

  return (
    <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
      <h1 className="text-base primary-slate uppercase font-semibold">
        {t("projectBreakdown")}
      </h1>
      <table className="w-full">
        <thead className="border-b-2 background-border">
          <tr>
            {tableLists.map((list) => (
              <th
                key={list}
                className="text-sm font-semibold primary-slate text-center pb-2"
              >
                {list}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clientProjects.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="text-sm primary-slate text-center py-4"
              >
                {t("noProjectsForClient")}
              </td>
            </tr>
          )}
          {clientProjects.map((project) => {
            const { income, expense } = totalsByProject.get(project.id) ?? {
              income: 0,
              expense: 0,
            };
            const profit = income - expense;
            const margin = income > 0 ? (profit / income) * 100 : 0;

            return (
              <tr
                key={project.id}
                className="border-b background-border text-center primary-slate"
              >
                <td className="text-sm text-primary py-2">{project.name}</td>
                <td className="primary-green">
                  {fmt(income)}
                  {/* $
                {Number(project.totalRevenue || 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} */}
                </td>
                <td className="primary-red">{fmt(expense)}</td>
                <td className="primary-green">{fmt(profit)}</td>
                <td
                  className={`${project.totalMargin && Number(project.totalMargin) >= 40 ? "primary-green" : project.totalMargin && Number(project.totalMargin) >= 25 ? "primary-slate" : "primary-red"}`}
                >
                  {margin.toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-sm primary-slate">
        {t("projectBreakdownDescription")}
      </p>
    </div>
  );
}
