"use client";

import { ClientPageTab } from "@/types/types";
import { Briefcase, ChartBar, Eye, FileText } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const tabs = [
  { tab: "Overview", icon: <Eye /> },
  { tab: "Jobs And Projects", icon: <Briefcase /> },
  { tab: "Invoices", icon: <FileText /> },
  { tab: "Insights", icon: <ChartBar /> },
];

export default function ClientPageHeader({
  clientName,
}: {
  clientName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const clientPageTab = pathname.split("/").pop() as ClientPageTab;

  return (
    <div>
      {/* MOBILE VIEW */}
      <div className="relative block sm:hidden">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-secondary w-full hover:cursor-pointer px-4 py-2 rounded-lg transition-all h-full text-center flex flex-col relative group items-center justify-between duration-200 cursor-pointer hover:text-[#2dd4bf]"
          >
            Select a tab
          </button>
          <h1 className="text-center text-[#2dd4bf] w-full h-full flex justify-center items-center gap-2 md:gap-4 uppercase text-sm font-semibold relative">
            {clientPageTab}
          </h1>
        </div>
        {open && (
          <div className="absolute mt-1 rounded-lg bg-[#11151c] border border-[#1f2937] shadow-lg z-10">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => {
                  router.push(
                    `/clients/${clientName.toLowerCase().replace(" ", "-")}/${tab.tab.toLowerCase().replace(" ", "-").replace("/", "")}`,
                  );
                  setOpen(false);
                }}
                className="text-secondary hover:cursor-pointer px-4 py-2 rounded-lg transition-all h-full text-center flex flex-col relative group items-center justify-between duration-200 cursor-pointer hover:text-[#2dd4bf] w-full"
              >
                <h1 className="text-center flex-1 h-full flex justify-center items-center gap-2 md:gap-4 uppercase text-sm font-semibold">
                  <span>{tab.icon}</span>
                  {tab.tab}
                  <div
                    className={`absolute bottom-0 left-1/2 h-0.5 w-0 bg-[#21262d] dark:bg-[#2dd4bf] transition-all duration-300 ease-out transform -translate-x-1/2 group-hover:w-full ${clientPageTab === tab.tab.toLowerCase() ? "w-full" : "w-0"}`}
                  ></div>
                </h1>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* DESKTOP VIEW */}
      <div className="hidden sm:flex justify-center items-center gap-2 md:gap-4 w-full">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className="text-secondary hover:cursor-pointer px-4 py-2 rounded-lg transition-all h-full text-center flex flex-col relative group items-center justify-between duration-200 cursor-pointer hover:text-[#2dd4bf]"
            onClick={() =>
              router.push(
                `/clients/${clientName.toLowerCase().replace(" ", "-")}/${tab.tab.toLowerCase().replace(" ", "-").replace(" ", "-")}`,
              )
            }
          >
            <h1
              className={`text-center flex-1 h-full flex justify-center items-center gap-2 md:gap-4 uppercase text-sm font-semibold ${clientPageTab === tab.tab.toLowerCase().replace(" ", "-").replace(" ", "-") ? "text-[#2dd4bf]" : "text-secondary"}`}
            >
              <span>{tab.icon}</span>
              {tab.tab}
            </h1>
            <div
              className={`absolute bottom-0 left-1/2 h-0.5 w-0 bg-[#21262d] dark:bg-[#2dd4bf] transition-all duration-300 ease-out transform -translate-x-1/2 group-hover:w-full ${clientPageTab === tab.tab.toLowerCase().replace(" ", "-").replace(" ", "-") ? "w-full" : "w-0"}`}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
}
