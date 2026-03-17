"use client";

import { useClientStore } from "@/lib/store/useClientStore";
import { useAuth } from "@/lib/useAuth";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import NewClientModal from "./NewClientModal";

const maxMobileClients = 5;

export default function ClientTable() {
  const router = useRouter();

  useAuth();
  const { clients, setSelectedClient, selectedClient } = useClientStore();
  const [currentPage] = useState<number>(1);
  const [newClientModalOpen, setNewClientModalOpen] = useState<boolean>(false);

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
          <PlusIcon size={20} /> New Client
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
                  {client.firstName} {client.lastName}
                </h1>
                <p className="primary-slate font-semibold">{client.email}</p>
              </div>

              <p className="text-sm primary-slate uppercase font-semibold flex items-center gap-2">
                Status:
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
                Revenue MTD:
                <span className="primary-slate">—</span>
              </p>
              <p className="text-sm primary-slate uppercase font-semibold flex items-center gap-2">
                Revenue YTD:
                <span className="primary-slate">—</span>
              </p>

              <p className="text-sm primary-slate uppercase font-semibold flex items-center gap-2">
                Outstanding:
                <span className="primary-slate">To be added</span>
              </p>

              <p className="text-sm primary-slate uppercase font-semibold flex items-center gap-2">
                Avg payment time:
                <span className="primary-slate">To be added</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* <table className="w-full min-w-[720px]">
          <thead>
            <tr>
              {tableLists.map((list) => (
                <th
                  key={list}
                  className="text-sm text-primary text-center whitespace-nowrap px-2 py-3"
                >
                  {list}
                </th>
              ))}
            </tr>
          </thead>
          const tableLists = [
  "Client",
  "Status",
  "Revenue MTD",
  "Revenue YTD",
  "Outstanding",
  "Avg Payment Time",
]; 
          <tbody className="max-h-[500px] overflow-y-auto">
            {currentClients.map((client) => (
              <tr
                key={client.id}
                className="border-t background-border hover:bg-(--bg-elevated)"
                onClick={() => {
                  setSelectedClient(client);
                  router.push(`/clients/${client.id}/overview`);
                }}
              >
                <td className="text-sm text-primary text-center px-2 py-3 hover:cursor-pointer">
                  {client.firstName} {client.lastName}
                </td>
                <td className="text-sm primary-slate text-center px-2 py-3">
                  {client.status}
                </td>
                <td className="text-sm primary-slate text-center px-2 py-3">
                  ${mtdRevenue}
                </td>
                <td className="text-sm primary-slate text-center px-2 py-3">
                  ${ytdRevenue}
                </td>
                <td className="text-sm primary-slate text-center px-2 py-3">
                  To be added
                </td>
                <td className="text-sm primary-slate text-center px-2 py-3">
                  To be added
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}
    </div>
  );
}

{
  /*
Client Name	Bold text, maybe client logo/icon optional
Status	Badge (green / yellow / red)
Revenue (MTD)	Number, teal if up, muted if flat
Revenue (YTD)	Number
Outstanding	Red if overdue, gray if pending
Avg Payment Time	Number + small trend arrow
Profitability %	Number, maybe progress bar
Last Payment Date	Date, formatted “MMM DD”
Safe-to-Spend Contribution	Number, small subtext: “% of buffer”  
  
*/
}
