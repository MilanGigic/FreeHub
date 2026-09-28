import { formatMinor, toMinor } from "@/lib/currency";
import { useLocale, useTranslations } from "next-intl";

export default function NetTakeHomeFromThisClient({
  displayCurrency = "RSD",
  amount,
}: {
  displayCurrency?: string;
  amount: number;
}) {
  const t = useTranslations("clients");
  const locale = useLocale();

  return (
    <div className="w-full p-px bg-linear-to-b from-[#2dd4bf] via-[#21262d] to-[#0a0e14] rounded-lg">
      <div className="background-elevated border background-border rounded-lg p-4 flex flex-col justify-center gap-2 w-full">
        <h1 className="text-base primary-slate uppercase font-semibold">
          {t("netTakeHome")}
        </h1>
        <p className="text-2xl font-bold primary-cyan">
          {formatMinor(toMinor(amount), displayCurrency, locale)}
        </p>
        <p className="text-sm primary-slate">{t("netTakeHomeDescription")}</p>
      </div>
    </div>
  );
}
