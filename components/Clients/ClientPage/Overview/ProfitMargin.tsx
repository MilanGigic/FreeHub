import { useClientStore } from "@/lib/store/useClientStore";
import { useTranslations } from "next-intl";

export default function ProfitMargin({ amount }: { amount: number }) {
  const { clientProjects } = useClientStore();
  const t = useTranslations("clients");

  const totalRevenue = clientProjects.reduce(
    (acc, project) => acc + Number(project.totalRevenue || 0),
    0,
  );
  const totalExpenses = clientProjects.reduce(
    (acc, project) => acc + Number(project.totalExpenses || 0),
    0,
  );

  const profitMargin =
    totalRevenue > 0
      ? ((totalRevenue - totalExpenses) / totalRevenue) * 100
      : 0;

  return (
    <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
      <h1 className="text-base primary-slate uppercase font-semibold">
        {t("profitMargin")}
      </h1>
      <p
        className={`text-2xl font-bold ${
          profitMargin >= 40
            ? "primary-green"
            : profitMargin >= 25
              ? "primary-slate"
              : "primary-red"
        }`}
      >
        {profitMargin.toFixed(2)}%
      </p>
      <p className="text-sm primary-slate">{t("profitMarginDescription")}</p>
    </div>
  );
}
