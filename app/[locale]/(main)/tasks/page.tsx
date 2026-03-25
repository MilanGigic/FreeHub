import { getTranslations } from "next-intl/server";

export default async function TasksPage() {
  const t = await getTranslations("pages");
  return <div>{t("tasksPage")}</div>;
}
