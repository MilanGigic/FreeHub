import { formatMinor, toMinor } from "@/lib/currency";
import { useLocale, useTranslations } from "next-intl";

export default function TotalRevenue({
  displayCurrency = "RSD",
  amount,
}: {
  displayCurrency?: string;
  amount: number;
}) {
  const t = useTranslations("clients");
  const locale = useLocale();

  return (
    <div className="w-full h-full p-px bg-linear-to-b from-[#34d399] via-[#21262d] to-[#0a0e14] rounded-lg">
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-between gap-2 w-full h-full">
        <h1 className="text-base primary-slate uppercase font-semibold">
          {t("totalRevenue")}
        </h1>
        <p className="text-2xl font-bold primary-green">
          {formatMinor(toMinor(amount), displayCurrency, locale)}{" "}
        </p>
        <p className="text-sm primary-slate">{t("totalRevenueDescription")}</p>
      </div>
    </div>
  );
}
