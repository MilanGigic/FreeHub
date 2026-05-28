"use server";

import { computeTaxesAction } from "@/actions/computeTaxes";
import { getTaxProfile } from "@/actions/taxProfile";
import FinancesClient from "@/components/Finances/FinancesClient";
import { getSession } from "@/lib/session";
import { getTranslations } from "next-intl/server";

export default async function FinancesPage() {
  const session = await getSession();

  if (!session?.userId) {
    const t = await getTranslations("auth");
    return (
      <div className="text-center text-primary font-semibold">
        {t("mustBeLoggedIn")}
      </div>
    );
  }

  const profile = await getTaxProfile(session.userId);

  const taxComputation = await computeTaxesAction(profile);

  return (
    <FinancesClient
      initialTaxResult={taxComputation.result}
      initialTaxMeta={taxComputation.meta}
    />
  );
}
