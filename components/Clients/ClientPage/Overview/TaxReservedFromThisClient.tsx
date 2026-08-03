import { useClientStore } from "@/lib/store/useClientStore";
import { useTaxProfileStore } from "@/lib/store/useTaxProfileStore";
import { useTranslations } from "next-intl";

export default function TaxReservedFromThisClient() {
  const { clientProjects } = useClientStore();
  const { taxResult } = useTaxProfileStore();
  const t = useTranslations("clients");

  const clientRevenue = clientProjects.reduce(
    (acc, p) => acc + Number(p.totalRevenue || 0),
    0,
  );
  const taxReserved = clientRevenue * taxResult.effectiveTaxRate;

  return (
    <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
      <h1 className="text-base primary-slate uppercase font-semibold">
        {t("taxReservedFromClient")}
      </h1>
      <p className="text-2xl font-bold primary-amber">
        $
        {taxReserved.toLocaleString("en-US", {
          maximumFractionDigits: 0,
        })}
      </p>
      <p className="text-sm primary-slate">{t("taxReservedDescription")}</p>
    </div>
  );
}
