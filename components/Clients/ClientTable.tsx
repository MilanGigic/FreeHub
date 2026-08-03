"use client";

import { useClientStore } from "@/lib/store/useClientStore";
import { useDataStore } from "@/lib/store/useDataStore";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import NewClientModal from "./NewClientModal";
import { ClientCardMetrics } from "@/actions/clients/fetchClientCardMetrics";
import { useTranslations } from "next-intl";

const maxMobileClients = 5;

export default function ClientTable({
  clientMetrics,
}: {
  clientMetrics: ClientCardMetrics[];
}) {
  const router = useRouter();

  const { clients, setSelectedClient, selectedClient } = useClientStore();
  const { projects } = useDataStore();
  const t = useTranslations("clients");
  const [currentPage] = useState<number>(1);
  const [newClientModalOpen, setNewClientModalOpen] = useState<boolean>(false);

  const metricsMap = useMemo(() => {
    const map = new Map<string, ClientCardMetrics>();
    clientMetrics.forEach((m) => map.set(m.clientId, m));
    return map;
  }, [clientMetrics]);

  const clientRevenues = useMemo(() => {
    const map = new Map<string, { ytd: number; mtd: number }>();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    projects.forEach((p) => {
      const rev = Number(p.totalRevenue || 0);
      const existing = map.get(p.clientId) || { ytd: 0, mtd: 0 };
      existing.ytd += rev;
      const created = new Date(p.createdAt);
      if (created >= startOfMonth) {
        existing.mtd += rev;
      }
      map.set(p.clientId, existing);
    });
    return map;
  }, [projects]);

  const currentClients = useMemo(() => {
    return clients.slice(
      (currentPage - 1) * maxMobileClients,
      currentPage * maxMobileClients,
    );
  }, [currentPage, clients]);

  return (
    <div className="w-full h-full flex gap-2 md:gap-4">
      <div className="flex items-start gap-2 relative max-w-2xl w-full">
        <button
          className="primary-green p-2 w-full rounded-lg border background-border outline-none focus-border-accent transition-all duration-300 ease-out flex items-center justify-center gap-2"
          onClick={() => setNewClientModalOpen(true)}
        >
          <PlusIcon size={20} /> {t("newClient")}
        </button>
        {newClientModalOpen ? (
          <NewClientModal onClose={() => setNewClientModalOpen(false)} />
        ) : null}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {currentClients.map((client) => (
          <div
            key={client.id}
            className={`p-px bg-linear-to-b cursor-pointer ${
              client.status === "active"
                ? "from-(--accent-green) via-[#21262d] to-[#0a0e14]"
                : client.status === "paused"
                  ? "from-(--accent-amber) via-[#21262d] to-[#0a0e14]"
                  : client.status === "archived"
                    ? "from-(--accent-red) via-[#21262d] to-[#0a0e14]"
                    : "from-[#21262d] via-[#21262d] to-[#0a0e14]"
            } rounded-lg ${
              selectedClient
                ? selectedClient.id === client.id
                  ? "scale-105 shadow-xl shadow-[#2dd4bf]/20"
                  : "hover:scale-105 transition-all duration-300 ease-out hover:cursor-pointer hover:shadow-xl hover:shadow-[#2dd4bf]/20 cursor-pointer"
                : "hover:scale-105 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-[#2dd4bf]/20 cursor-pointer"
            }`}
            onClick={() => {
              setSelectedClient(client);
              router.push(`/clients/${client.id}/overview`);
            }}
          >
            <div className="background-elevated border background-border rounded-lg p-4 flex flex-col gap-2">
              <div className="flex flex-col gap-1 border-b-2 background-border pb-2">
                <h1 className="text-lg text-primary uppercase font-bold">
                  {client.clientName}
                </h1>
                <p className="primary-slate font-semibold">{client.email}</p>
              </div>

              <p className="text-sm primary-slate uppercase font-semibold flex items-center gap-2">
                {t("status")}
                <span
                  className={`${
                    client.status === "active"
                      ? "primary-green"
                      : client.status === "paused"
                        ? "primary-amber"
                        : client.status === "archived"
                          ? "primary-red"
                          : "primary-slate"
                  }`}
                >
                  {client.status}
                </span>
              </p>

              <p className="text-sm primary-slate uppercase font-semibold flex items-center gap-2">
                {t("revenueMTD")}
                <span className="primary-cyan">
                  $
                  {(clientRevenues.get(client.id)?.mtd ?? 0).toLocaleString(
                    "en-US",
                    { maximumFractionDigits: 0 },
                  )}
                </span>
              </p>
              <p className="text-sm primary-slate uppercase font-semibold flex items-center gap-2">
                {t("revenueYTD")}
                <span className="primary-cyan">
                  $
                  {(clientRevenues.get(client.id)?.ytd ?? 0).toLocaleString(
                    "en-US",
                    { maximumFractionDigits: 0 },
                  )}
                </span>
              </p>

              <p className="text-sm primary-slate uppercase font-semibold flex items-center gap-2">
                {t("outstanding")}
                <span
                  className={
                    Number(metricsMap.get(client.id)?.outstandingTotal ?? 0) > 0
                      ? "primary-amber"
                      : "primary-slate"
                  }
                >
                  $
                  {Number(
                    metricsMap.get(client.id)?.outstandingTotal ?? 0,
                  ).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                </span>
              </p>

              <p className="text-sm primary-slate uppercase font-semibold flex items-center gap-2">
                {t("avgPaymentTime")}
                <span className="primary-slate">
                  {metricsMap.get(client.id)?.avgPaymentDays != null
                    ? `${metricsMap.get(client.id)!.avgPaymentDays} ${t("days")}`
                    : "—"}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
