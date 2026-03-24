"use server";

import ClientsHeader from "@/components/Clients/Header/ClientsHeader";
import { fetchClientsPageMetrics } from "@/actions/clients/fetchClientsPageMetrics";
import { getCurrentUser } from "@/actions/auth/getCurrentUser";
import { fetchClientCardMetrics } from "@/actions/clients/fetchClientCardMetrics";
import ClientTable from "@/components/Clients/ClientTable";

export default async function ClientsPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="text-center text-primary font-semibold">
        You must be logged in to access this page
      </div>
    );
  }
  const headerRes = await fetchClientsPageMetrics(user.id);
  if (!headerRes.success) {
    return (
      <div className="text-center text-primary font-semibold">
        An error occurred while fetching clients page metrics
      </div>
    );
  }
  const mainRes = await fetchClientCardMetrics(user.id);
  if (!mainRes.success) {
    return (
      <div className="text-center text-primary font-semibold">
        An error occurred while fetching client card metrics
      </div>
    );
  }
  if (!mainRes.data) {
    return (
      <div className="text-center text-primary font-semibold">
        No client card metrics found
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
