"use client";

import Link from "next/link";
import { ClientDetailPanel } from "./ClientDetailPanel";
import { ProjectDetailPanel } from "./ProjectDetailPanel";
import { getStatusColor } from "@/utils/getStatusColor";
import { formatMoney } from "@/utils/formatMoney";
import { ArrowRight, House, Wallet, Briefcase, Users } from "lucide-react";
import { Tabs } from "@/types/types";
import { usePathname, useSearchParams } from "next/navigation";
import { useDataStore } from "@/lib/store/useDataStore";
import { useClientStore } from "@/lib/store/useClientStore";
import { useSidebarHover } from "@/lib/hooks/useSidebarHover";
import { useLocale, useTranslations } from "next-intl";

export default function DesktopSidebar() {
  const pathname = usePathname();
  const locale = useLocale();

  const searchParams = useSearchParams();

  const financesActiveTab = searchParams.get("tab");

  // Strip the locale prefix for clean comparison
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, "");
  const t = useTranslations("navigation");
  const f = useTranslations("finances");

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

  const tabs = [
    { key: "dashboard", route: "dashboard" },
    { key: "clients", route: "clients" },
    { key: "projects", route: "projects" },
    { key: "finances", route: "finances" },
  ];

  function renderTab(key: string) {
    switch (key) {
      case "dashboard":
        return <House />;
      case "finances":
        return <Wallet />;
      case "clients":
        return <Users />;
      case "projects":
        return <Briefcase />;
    }
  }

  return (
    <div className="hidden w-24 md:w-48 h-full background-sidebar background-border border-r p-1 z-20 relative sm:flex sm:flex-col">
      {/* Projects Flyout */}
      {hoveredTab?.name === "projects" && (
        <div
          className="absolute left-full w-72 background-elevated border-r border-y background-border rounded-r-lg shadow-xl shadow-black/50 z-50 overflow-hidden"
          style={{ top: Math.max(0, hoveredTab.y - 40) }}
          onMouseEnter={handleFlyoutEnter}
          onMouseLeave={scheduleClose}
        >
          <div className="px-4 py-3 border-b background-border">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider">
                {t("projects")}
              </h2>
              <div className="flex gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-(--accent-cyan)/20 primary-cyan font-semibold">
                  {activeProjectCount} {t("active")}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-(--accent-slate)/20 primary-slate font-semibold">
                  {projects.length} {t("total")}
                </span>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {projects.length === 0 ? (
              <div className="px-4 py-6 text-center primary-slate text-sm">
                {t("noProjectsYet")}
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
              {t("viewAllProjects")}
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
      {hoveredTab?.name === "clients" && (
        <div
          className="absolute left-full w-72 background-elevated border-r border-y background-border rounded-r-lg shadow-xl shadow-black/50 z-50 overflow-hidden"
          style={{ top: Math.max(0, hoveredTab.y - 40) }}
          onMouseEnter={handleFlyoutEnter}
          onMouseLeave={scheduleClose}
        >
          <div className="px-4 py-3 border-b background-border">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider">
                {t("clients")}
              </h2>
              <div className="flex gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-(--accent-green)/20 primary-green font-semibold">
                  {activeClientCount} {t("active")}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-(--accent-slate)/20 primary-slate font-semibold">
                  {clients.length} {t("total")}
                </span>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {clients.length === 0 ? (
              <div className="px-4 py-6 text-center primary-slate text-sm">
                {t("noClientsYet")}
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
                    {projectCountByClient[client.id] || 0} {t("proj")}
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
              {t("viewAllClients")}
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

      {hoveredTab?.name === "finances" && (
        <div
          className="absolute left-full w-72 background-elevated border-r border-y background-border rounded-r-lg shadow-xl shadow-black/50 z-50 overflow-hidden"
          style={{ top: Math.max(0, hoveredTab.y - 40) }}
          onMouseEnter={handleFlyoutEnter}
          onMouseLeave={scheduleClose}
        >
          <div className="px-4 py-3 border-b background-border">
            <div className="flex items-center justify-between flex-col gap-2">
              <Link
                className={`text-sm font-bold  uppercase tracking-wider border-b background-border ${financesActiveTab === "details" ? "text-(--accent-cyan) border-(--accent-cyan)" : "hover:text-(--accent-cyan) hover:border-(--accent-cyan) text-primary"} transition-all duration-300 w-full py-2`}
                href="/finances?tab=details"
              >
                {f("details")}
              </Link>
              <Link
                className={`text-sm font-bold  uppercase tracking-wider border-b background-border ${financesActiveTab === "taxes" ? "text-(--accent-cyan) border-(--accent-cyan)" : "hover:text-(--accent-cyan) hover:border-(--accent-cyan) text-primary"} transition-all duration-300 w-full py-2`}
                href="/finances?tab=taxes"
              >
                {f("taxes")}
              </Link>
              <Link
                className={`text-sm font-bold  uppercase tracking-wider border-b background-border ${financesActiveTab === "transactions" ? "text-(--accent-cyan) border-(--accent-cyan)" : "hover:text-(--accent-cyan) hover:border-(--accent-cyan) text-primary"} transition-all duration-300 w-full py-2`}
                href="/finances?tab=transactions"
              >
                {f("transactions")}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Simple tooltip for other tabs */}
      {hoveredTab &&
        hoveredTab.name !== "projects" &&
        hoveredTab.name !== "clients" &&
        hoveredTab.name !== "finances" && (
          <div
            className="absolute left-full px-3 py-1.5 background-elevated border-r border-y background-border rounded-r-lg text-xs font-semibold uppercase text-primary whitespace-nowrap z-50 pointer-events-none"
            style={{ top: hoveredTab.y }}
          >
            {t(hoveredTab.name)}
          </div>
        )}

      <div className="flex flex-col pt-2 gap-2 flex-1 relative">
        {tabs.map((tab) => (
          <Link
            key={tab.key}
            href={
              tab.key === "finances"
                ? `/${locale}/finances?tab=details`
                : `/${locale}/${tab.route}`
            }
            className={`w-full h-12 flex flex-col items-center justify-center cursor-pointer 
              ${
                pathnameWithoutLocale.includes(`/${tab.route}`)
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
                name: tab.key as Tabs,
                y: rect.top - parentRect.top + rect.height / 2 - 16,
              });
              setHoveredProject(null);
              setHoveredClient(null);
            }}
            onMouseLeave={scheduleClose}
          >
            {!pathnameWithoutLocale.includes(`/${tab.route}`) && (
              <span>{renderTab(tab.key)}</span>
            )}
            <h1 className="text-xs uppercase font-semibold">{t(tab.key)}</h1>
          </Link>
        ))}
      </div>
    </div>
  );
}
