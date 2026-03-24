"use client";

import { useClientStore } from "@/lib/store/useClientStore";
import { useDataStore } from "@/lib/store/useDataStore";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

const tableLists = ["Client", "Revenue", "Expenses", "Profit"];

export default function ProjectProfitability() {
  const { clients } = useClientStore();
  const { projects } = useDataStore();

  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    if (!selectedProjectId) return projects;
    return projects.filter((p) => p.id === selectedProjectId);
  }, [projects, selectedProjectId]);

  const dropdownLabel = selectedProjectId
    ? projects.find((p) => p.id === selectedProjectId)?.name ?? "All Projects"
    : "All Projects";

  function renderSelectedClient(clientId: string) {
    const client = clients.find((client) => client.id === clientId);
    if (!client) return null;
    return (
      <h1 className="text-sm text-primary text-center w-full">
        {client.firstName} {client.lastName}
      </h1>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 items-center border background-border rounded-lg background-elevated p-4">
      <header className="flex w-full justify-between items-center">
        <h1 className="text-lg font-semibold tracking-widest text-primary uppercase">
          Project Profitability
        </h1>
        <div className="relative">
          <button
            onClick={() => setOpenDropdown((prev) => !prev)}
            className={`flex items-center gap-2 primary-slate text-sm font-semibold background-elevated py-2 px-4 rounded-lg border transition-all ${openDropdown ? "border-(--accent-cyan)" : "background-border"}`}
          >
            {dropdownLabel} <ChevronDown className="w-4 h-4 primary-slate" />
          </button>
          {openDropdown ? (
            <div className="flex flex-col gap-2 absolute mt-1 w-full z-10 bg-black/50 rounded-lg">
              <div className="flex flex-col items-center gap-2 background-elevated p-2 rounded-lg border background-border">
                <h1
                  onClick={() => {
                    setSelectedProjectId(null);
                    setOpenDropdown(false);
                  }}
                  className="text-sm font-semibold primary-cyan py-2 px-4 hover:bg-(--border-default) transition-all cursor-pointer w-full text-center rounded-lg"
                >
                  All Projects
                </h1>
                {projects.map((project) => (
                  <h1
                    key={project.id}
                    onClick={() => {
                      setSelectedProjectId(project.id);
                      setOpenDropdown(false);
                    }}
                    className={`text-sm font-semibold py-2 px-4 hover:bg-(--border-default) transition-all cursor-pointer w-full text-center rounded-lg ${selectedProjectId === project.id ? "primary-cyan" : "primary-slate"}`}
                  >
                    {project.name}
                  </h1>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </header>

      <section className="flex flex-col gap-2 w-full">
        <div className="flex items-center gap-2 w-full justify-between border-b-2 background-border pb-2">
          {tableLists.map((list) => (
            <h1
              key={list}
              className="text-sm font-semibold primary-slate text-center w-full"
            >
              {list}
            </h1>
          ))}
        </div>
        <div>
          {filteredProjects.length === 0 && (
            <p className="text-sm primary-slate text-center py-4">No projects found</p>
          )}
          {filteredProjects.map((project) => (
            <div key={project.id}>
              <div className="flex items-center gap-2 w-full justify-between border-b background-border py-2">
                {renderSelectedClient(project.clientId)}
                <h1 className="text-sm primary-slate text-center w-full">
                  $
                  <span className="primary-green ml-0.5">
                    {Number(project.totalRevenue || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </h1>
                <h1 className="text-sm primary-slate text-center w-full">
                  $
                  <span className="primary-red ml-0.5">
                    {Number(project.totalExpenses || 0).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </h1>
                <h1 className="text-sm primary-cyan text-center w-full font-semibold">
                  ${Number(project.totalProfit || 0).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
