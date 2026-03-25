import { useClientStore } from "@/lib/store/useClientStore";
import { useTranslations } from "next-intl";

export default function TotalRevenue() {
  const { clientProjects } = useClientStore();
  const t = useTranslations("clients");
  return (
    <div className="w-full h-full p-px bg-linear-to-b from-[#34d399] via-[#21262d] to-[#0a0e14] rounded-lg">
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-between gap-2 w-full h-full">
        <h1 className="text-base primary-slate uppercase font-semibold">
          {t("totalRevenue")}
        </h1>
        <p className="text-2xl font-bold primary-green">
          {clientProjects.length > 0
            ? `$${clientProjects
                .reduce((acc, project) => acc + Number(project.totalRevenue || 0), 0)
                .toLocaleString("en-US", { maximumFractionDigits: 0 })}`
            : "$0"}
        </p>
        <p className="text-sm primary-slate">
          {t("totalRevenueDescription")}
        </p>
      </div>
    </div>
  );
}
