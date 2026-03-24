"use client";

import Link from "next/link";
import { ClientDetailPanel } from "./ClientDetailPanel";
import { ProjectDetailPanel } from "./ProjectDetailPanel";
import { getStatusColor } from "@/utils/getStatusColor";
import { formatMoney } from "@/utils/formatMoney";
import { ArrowRight, House, Wallet, Briefcase, Users } from "lucide-react";
import { Tabs } from "@/types/types";
import { usePathname } from "next/navigation";
import { useDataStore } from "@/lib/store/useDataStore";
import { useClientStore } from "@/lib/store/useClientStore";
import { useSidebarHover } from "@/lib/hooks/useSidebarHover";

function renderTab(tab: string) {
  switch (tab) {
    case "Dashboard":
      return <House />;
    case "Finances":
      return <Wallet />;
    case "Clients":
      return <Users />;
    case "Projects":
      return <Briefcase />;
  }
}

const tabs = ["Dashboard", "Clients", "Projects", "Finances"];

export default function DesktopSidebar() {
  const pathname = usePathname();

  const { projects } = useDataStore();
  const { clients } = useClientStore();

  const {
    hoveredProject,
    setHoveredProject,
    hoveredClient,
    setHoveredClient,
    hoveredTab,
    setHoveredTab,
    scheduleClose,
    clearItemTimeout,
    scheduleItemClose,
    activeProjectCount,
    activeClientCount,
    hoveredClientProjects,
    projectCountByClient,
    handleFlyoutEnter,
    handleDetailLeave,
    clearCloseTimeout,
  } = useSidebarHover({ projects, clients });

  return (
    <div className="hidden w-24 md:w-48 h-full background-sidebar background-border border-r p-1 z-20 relative sm:flex sm:flex-col">
      {/* Projects Flyout */}
      {hoveredTab?.name === "Projects" && (
        <div
          className="absolute left-full w-72 background-elevated border-r border-y background-border rounded-r-lg shadow-xl shadow-black/50 z-50 overflow-hidden"
          style={{ top: Math.max(0, hoveredTab.y - 40) }}
          onMouseEnter={handleFlyoutEnter}
          onMouseLeave={scheduleClose}
        >
          <div className="px-4 py-3 border-b background-border">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider">
                Projects
              </h2>
              <div className="flex gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-(--accent-cyan)/20 primary-cyan font-semibold">
                  {activeProjectCount} active
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-(--accent-slate)/20 primary-slate font-semibold">
                  {projects.length} total
                </span>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {projects.length === 0 ? (
              <div className="px-4 py-6 text-center primary-slate text-sm">
                No projects yet
              </div>
            ) : (
              projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}?tab=calendar`}
                  className="group flex items-center gap-3 px-4 py-2.5 hover:bg-(--bg-elevated) transition-colors cursor-pointer border-b background-border last:border-b-0 relative"
                  onMouseEnter={() => {
                    clearItemTimeout();
                    setHoveredProject(project);
                    setHoveredClient(null);
                  }}
                  onMouseLeave={scheduleItemClose}
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(project.status)}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-primary font-semibold truncate group-hover:primary-cyan transition-colors">
                      {project.name}
                    </p>
                    <p className="text-xs primary-slate truncate">
                      {project.clientName}
                    </p>
                  </div>
                  <span className="text-xs primary-green font-semibold shrink-0">
                    {formatMoney(project.totalProfit)}
                  </span>
                </Link>
              ))
            )}
          </div>

          {projects.length > 0 && (
            <Link
              href="/projects"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 border-t background-border text-xs font-semibold primary-cyan hover:bg-(--bg-elevated) transition-colors uppercase"
            >
              View all projects
              <ArrowRight size={12} />
            </Link>
          )}

          {hoveredProject && (
            <ProjectDetailPanel
              project={hoveredProject}
              onMouseEnter={handleFlyoutEnter}
              onMouseLeave={handleDetailLeave}
            />
          )}
        </div>
      )}

      {/* Clients Flyout */}
      {hoveredTab?.name === "Clients" && (
        <div
          className="absolute left-full w-72 background-elevated border-r border-y background-border rounded-r-lg shadow-xl shadow-black/50 z-50 overflow-hidden"
          style={{ top: Math.max(0, hoveredTab.y - 40) }}
          onMouseEnter={handleFlyoutEnter}
          onMouseLeave={scheduleClose}
        >
          <div className="px-4 py-3 border-b background-border">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider">
                Clients
              </h2>
              <div className="flex gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-(--accent-green)/20 primary-green font-semibold">
                  {activeClientCount} active
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-(--accent-slate)/20 primary-slate font-semibold">
                  {clients.length} total
                </span>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {clients.length === 0 ? (
              <div className="px-4 py-6 text-center primary-slate text-sm">
                No clients yet
              </div>
            ) : (
              clients.map((client) => (
                <Link
                  key={client.id}
                  href={`/clients/${client.id}/overview`}
                  className="group flex items-center gap-3 px-4 py-2.5 hover:bg-(--bg-elevated) transition-colors cursor-pointer border-b background-border last:border-b-0 relative"
                  onMouseEnter={() => {
                    clearItemTimeout();
                    setHoveredClient(client);
                    setHoveredProject(null);
                  }}
                  onMouseLeave={scheduleItemClose}
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(client.status)}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-primary font-semibold truncate group-hover:primary-cyan transition-colors">
                      {client.firstName} {client.lastName}
                    </p>
                    <p className="text-xs primary-slate truncate">
                      {client.email}
                    </p>
                  </div>
                  <span className="text-xs primary-slate font-semibold shrink-0">
                    {projectCountByClient[client.id] || 0} proj
                  </span>
                </Link>
              ))
            )}
          </div>

          {clients.length > 0 && (
            <Link
              href="/clients"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 border-t background-border text-xs font-semibold primary-cyan hover:bg-(--bg-elevated) transition-colors uppercase"
            >
              View all clients
              <ArrowRight size={12} />
            </Link>
          )}

          {hoveredClient && (
            <ClientDetailPanel
              client={hoveredClient}
              clientProjects={hoveredClientProjects}
              onMouseEnter={handleFlyoutEnter}
              onMouseLeave={handleDetailLeave}
            />
          )}
        </div>
      )}

      {/* Simple tooltip for other tabs */}
      {hoveredTab &&
        hoveredTab.name !== "Projects" &&
        hoveredTab.name !== "Clients" && (
          <div
            className="absolute left-full px-3 py-1.5 background-elevated border-r border-y background-border rounded-r-lg text-xs font-semibold uppercase text-primary whitespace-nowrap z-50 pointer-events-none"
            style={{ top: hoveredTab.y }}
          >
            {hoveredTab.name}
          </div>
        )}

      <div className="flex flex-col pt-2 gap-2 flex-1 relative">
        {tabs.map((tab) => (
          <Link
            key={tab}
            href={`/${tab.toLowerCase().replace(" ", "-")}`}
            className={`w-full h-12 flex flex-col items-center justify-center cursor-pointer 
                ${
                  pathname.startsWith(`/${tab.toLowerCase().replace(" ", "-")}`)
                    ? "primary-cyan background-elevated"
                    : "hover:primary-cyan text-primary hover:background-elevated"
                } transition-all`}
            onMouseEnter={(e) => {
              clearCloseTimeout();
              const rect = (
                e.currentTarget as HTMLElement
              ).getBoundingClientRect();
              const parentRect = (e.currentTarget as HTMLElement)
                .closest(".relative")!
                .getBoundingClientRect();
              setHoveredTab({
                name: tab as Tabs,
                y: rect.top - parentRect.top + rect.height / 2 - 16,
              });
              setHoveredProject(null);
              setHoveredClient(null);
            }}
            onMouseLeave={scheduleClose}
          >
            {!pathname.startsWith(
              `/${tab.toLowerCase().replace(" ", "-")}`,
            ) && <span>{renderTab(tab)}</span>}
            <h1 className="text-xs uppercase font-semibold">{tab}</h1>
          </Link>
        ))}
      </div>
    </div>
  );
}
