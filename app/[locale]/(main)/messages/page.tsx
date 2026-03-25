import { getTranslations } from "next-intl/server";

export default async function MessagesPage() {
  const t = await getTranslations("pages");
  return <div>{t("messagesPage")}</div>;
}
