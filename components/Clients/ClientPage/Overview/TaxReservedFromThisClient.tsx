import { formatMinor, toMinor } from "@/lib/currency";
import { useLocale, useTranslations } from "next-intl";

export default function TaxReservedFromThisClient({
  displayCurrency = "RSD",
  amount,
}: {
  displayCurrency?: string;
  amount: number;
}) {
  const t = useTranslations("clients");
  const locale = useLocale();

  return (
    <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
      <h1 className="text-base primary-slate uppercase font-semibold">
        {t("taxReservedFromClient")}
      </h1>
      <p className="text-2xl font-bold primary-amber">
        {formatMinor(toMinor(amount), displayCurrency, locale)}
      </p>
      <p className="text-sm primary-slate">{t("taxReservedDescription")}</p>
    </div>
  );
}
