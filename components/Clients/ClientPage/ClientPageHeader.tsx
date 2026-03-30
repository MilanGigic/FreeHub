"use client";

import { Briefcase, Eye, FileText } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const tabIcons = [
  <Eye key="eye" />,
  <Briefcase key="briefcase" />,
  <FileText key="file-text" />,
];

export default function ClientPageHeader({ clientId }: { clientId: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("clients");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [open, setOpen] = useState<boolean>(false);

  const tabs = [
    { key: "overview", label: t("overview"), icon: tabIcons[0] },
    {
      key: "jobs-and-projects",
      label: t("jobsAndProjects"),
      icon: tabIcons[1],
    },
    { key: "invoices", label: t("invoicesTab"), icon: tabIcons[2] },
  ];

  const clientPageTab = pathname
    .replace(`/${locale}`, "")
    .split("/")
    .pop() as string;

  return (
    <div>
      {/* MOBILE VIEW */}
      <div className="relative block sm:hidden">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setOpen((o) => !o)}
            className="primary-slate w-full hover:cursor-pointer px-4 py-2 rounded-lg transition-all h-full text-center flex flex-col relative group items-center justify-between duration-200 cursor-pointer hover:primary-cyan"
          >
            {tCommon("selectATab")}
          </button>
          <h1 className="text-center primary-slate w-full h-full flex justify-center items-center gap-2 md:gap-4 uppercase text-sm font-semibold relative">
            {clientPageTab}
          </h1>
        </div>
        {open && (
          <div className="absolute mt-1 rounded-lg background-elevated border background-border shadow-lg z-10">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => {
                  router.push(
                    `/clients/${clientId}/${tab.key.toLowerCase().replaceAll(" ", "-")}`,
                  );
                  setOpen(false);
                }}
                className="primary-slate hover:cursor-pointer px-4 py-2 rounded-lg transition-all h-full text-center flex flex-col relative group items-center justify-between duration-200 cursor-pointer hover:primary-cyan w-full"
              >
                <h1 className="text-center flex-1 h-full flex justify-center items-center gap-2 md:gap-4 uppercase text-sm font-semibold">
                  <span>{tab.icon}</span>
                  {tab.label}
                  <div
                    className={`absolute bottom-0 left-1/2 h-0.5 w-0 bg-(--accent-cyan) transition-all duration-300 ease-out transform -translate-x-1/2 group-hover:w-full ${clientPageTab === tab.key.toLowerCase().replaceAll(" ", "-") ? "w-full" : "w-0"}`}
                  ></div>
                </h1>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden sm:flex sm:flex-col md:flex-row justify-center items-center gap-2 md:gap-4 w-full">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className="primary-slate hover:cursor-pointer px-4 py-2 rounded-lg transition-all h-full text-center flex flex-col relative group items-center justify-between duration-200 cursor-pointer hover:primary-cyan"
            onClick={() =>
              router.push(
                `/clients/${clientId}/${tab.key.toLowerCase().replaceAll(" ", "-")}`,
              )
            }
          >
            <h1
              className={`text-center flex-1 h-full flex justify-center items-center gap-2 md:gap-4 uppercase text-sm font-semibold ${clientPageTab === tab.key.toLowerCase().replaceAll(" ", "-") ? "primary-cyan" : "primary-slate"}`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </h1>
            <div
              className={`absolute bottom-0 left-1/2 h-0.5 w-0 bg-(--accent-cyan) transition-all duration-300 ease-out transform -translate-x-1/2 group-hover:w-full ${clientPageTab === tab.key.toLowerCase().replaceAll(" ", "-") ? "w-full" : "w-0"}`}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
}
