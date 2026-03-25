import { getTranslations } from "next-intl/server";

export default async function ReportsPage() {
  const t = await getTranslations("pages");
  return <div>{t("reportsPage")}</div>;
}
