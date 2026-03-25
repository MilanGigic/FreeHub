"use server";

import ClientsHeader from "@/components/Clients/Header/ClientsHeader";
import { fetchClientsPageMetrics } from "@/actions/clients/fetchClientsPageMetrics";
import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import { fetchClientCardMetrics } from "@/actions/clients/fetchClientCardMetrics";
import ClientTable from "@/components/Clients/ClientTable";
import { getTranslations } from "next-intl/server";

export default async function ClientsPage() {
  const user = await getCurrentUser();
  if (!user) {
    const tAuth = await getTranslations("auth");
    return (
      <div className="text-center text-primary font-semibold">
        {tAuth("mustBeLoggedIn")}
      </div>
    );
  }
  const tClients = await getTranslations("clients");
  const headerRes = await fetchClientsPageMetrics(user.id);
  if (!headerRes.success) {
    return (
      <div className="text-center text-primary font-semibold">
        {tClients("errorFetchingMetrics")}
      </div>
    );
  }
  const mainRes = await fetchClientCardMetrics(user.id);
  if (!mainRes.success) {
    return (
      <div className="text-center text-primary font-semibold">
        {tClients("errorFetchingCardMetrics")}
      </div>
    );
  }
  if (!mainRes.data) {
    return (
      <div className="text-center text-primary font-semibold">
        {tClients("noCardMetrics")}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2 md:gap-4 w-full min-h-screen h-full">
      <header>
        <ClientsHeader
          clientsPageMetrics={
            headerRes.data as {
              revenueThisMonth: string;
              expensesThisMonth: string;
              outstandingInvoices: string;
            }
          }
        />
      </header>
      <main className="w-full">
        <div className="w-full h-full flex flex-col gap-2 md:gap-4 p-4">
          <ClientTable clientMetrics={mainRes.data} />
        </div>
      </main>
    </div>
  );
}
