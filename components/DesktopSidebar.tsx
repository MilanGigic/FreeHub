"use client";

import Link from "next/link";
import { formatMoney } from "@/utils/formatMoney";
import { House, Wallet, Briefcase, Users } from "lucide-react";
import { useDataStore } from "@/lib/store/useDataStore";
import { useClientStore } from "@/lib/store/useClientStore";
import { useSidebarHover } from "@/lib/hooks/useSidebarHover";
import { useLocale, useTranslations } from "next-intl";

export default function DesktopSidebar() {
  const locale = useLocale();

  // Strip the locale prefix for clean comparison
  const t = useTranslations("navigation");
  const f = useTranslations("finances");

  const { projects } = useDataStore();
  const { clients } = useClientStore();

  const {
    setHoveredProject,
    setHoveredClient,
    clearItemTimeout,
    scheduleItemClose,
    projectCountByClient,
  } = useSidebarHover({ projects, clients });

  const tabs = [
    {
      key: "dashboard",
      route: "dashboard",
      subTabs: [{ subKey: "overview", subRoute: "dashboard" }],
    },
    {
      key: "clients",
      route: "clients",
      subTabs: [],
    },
    {
      key: "projects",
      route: "projects",
      subTabs: [],
    },
    {
      key: "finances",
      route: "finances",
      subTabs: [],
    },
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
    <div className="hidden w-24 lg:w-72 self-stretch z-20 sm:flex sm:flex-col border-r background-border">
      <div className="flex flex-col pt-2 w-full">
        {tabs.map((tab) => (
          <div key={tab.key} className="w-full transition-all duration-300">
            <div className="flex items-center justify-between w-full px-4 py-2 border-b background-border">
              <h1 className="flex uppercase items-center gap-2 text-tertiary font-semibold text-sm">
                {renderTab(tab.key)}{" "}
                <span className="hidden lg:inline">{t(tab.key)}</span>
              </h1>
            </div>

            <div>
              {tab.key === "clients" ? (
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
                        className="group flex items-center gap-2 px-2 lg:px-8 py-2 hover:bg-(--bg-elevated) transition-colors cursor-pointer relative"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm lg:text-lg text-primary font-semibold truncate group-hover:primary-cyan transition-colors">
                            {client.clientName}
                          </p>
                          <p className="hidden lg:block text-xs primary-slate truncate">
                            {client.email}
                          </p>
                        </div>
                        <span className="hidden lg:inline text-sm primary-slate font-semibold shrink-0">
                          {projectCountByClient[client.id] || 0} {t("projects")}
                        </span>
                      </Link>
                    ))
                  )}
                  <Link
                    href="/clients"
                    className="text-sm lg:text-lg font-semibold w-full py-2 hover:bg-(--bg-elevated) transition-colors cursor-pointer px-1 lg:px-8 text-tertiary text-center flex items-center justify-center"
                  >
                    {t("viewAllClients")}
                  </Link>
                </div>
              ) : tab.key === "projects" ? (
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
                        className="group flex items-center gap-2 px-2 lg:px-8 py-2.5 hover:bg-(--bg-elevated) transition-colors cursor-pointer relative"
                        onMouseEnter={() => {
                          clearItemTimeout();
                          setHoveredProject(project);
                          setHoveredClient(null);
                        }}
                        onMouseLeave={scheduleItemClose}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm lg:text-lg text-primary font-semibold truncate group-hover:primary-cyan transition-colors">
                            {project.name}
                          </p>
                          <p className="hidden lg:block text-base primary-slate truncate">
                            {project.clientName}
                          </p>
                        </div>
                        <span className="hidden lg:inline text-sm primary-green font-semibold shrink-0">
                          {formatMoney(project.totalProfit)}
                        </span>
                      </Link>
                    ))
                  )}
                  <Link
                    href="/projects"
                    className="text-sm lg:text-lg font-semibold w-full py-2 hover:bg-(--bg-elevated) transition-colors cursor-pointer px-1 lg:px-8 text-tertiary text-center flex items-center justify-center"
                  >
                    {t("viewAllProjects")}
                  </Link>
                </div>
              ) : tab.key === "finances" ? (
                <div className="flex flex-col w-full gap-2 py-2 uppercase">
                  <Link
                    className="text-sm lg:text-lg font-semibold py-2 hover:bg-(--bg-elevated) transition-colors cursor-pointer px-2 lg:px-8 text-primary"
                    href="/finances?tab=details"
                  >
                    {f("details")}
                  </Link>
                  <Link
                    className="text-sm lg:text-lg font-semibold py-2 hover:bg-(--bg-elevated) transition-colors cursor-pointer px-2 lg:px-8 text-primary"
                    href="/finances?tab=taxes"
                  >
                    {f("taxes")}
                  </Link>
                  <Link
                    className="text-sm lg:text-lg font-semibold py-2 hover:bg-(--bg-elevated) transition-colors cursor-pointer px-2 lg:px-8 text-primary"
                    href="/finances?tab=transactions"
                  >
                    {f("transactions")}
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col w-full gap-2 py-2 uppercase">
                  {tab.subTabs.map((subTab) => (
                    <Link
                      key={subTab.subKey}
                      href={`/${locale}/${subTab.subRoute}`}
                      className="text-sm lg:text-lg font-semibold py-2 hover:bg-(--bg-elevated) transition-colors cursor-pointer px-2 lg:px-8 text-primary"
                    >
                      {subTab.subKey}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
