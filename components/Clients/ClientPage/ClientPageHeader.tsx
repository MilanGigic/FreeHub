"use client";

import { Briefcase, ChartBar, Eye, FileText } from "lucide-react";
import { useState } from "react";

const tabs = [
  { tab: "Overview", icon: <Eye /> },
  { tab: "Jobs / Projects", icon: <Briefcase /> },
  { tab: "Invoices", icon: <FileText /> },
  { tab: "Insights", icon: <ChartBar /> },
];

type Tab = "overview" | "jobs / projects" | "invoices" | "insights";

export default function ClientPageHeader() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const [open, setOpen] = useState<boolean>(false);

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
            {activeTab}
          </h1>
        </div>
        {open && (
          <div className="absolute mt-1 rounded-lg bg-[#11151c] border border-[#1f2937] shadow-lg z-10">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveTab(tab.tab.toLowerCase() as Tab);
                  setOpen(false);
                }}
                className="text-secondary hover:cursor-pointer px-4 py-2 rounded-lg transition-all h-full text-center flex flex-col relative group items-center justify-between duration-200 cursor-pointer hover:text-[#2dd4bf] w-full"
              >
                <h1 className="text-center flex-1 h-full flex justify-center items-center gap-2 md:gap-4 uppercase text-sm font-semibold">
                  <span>{tab.icon}</span>
                  {tab.tab}
                  <div
                    className={`absolute bottom-0 left-1/2 h-0.5 w-0 bg-[#21262d] dark:bg-[#2dd4bf] transition-all duration-300 ease-out transform -translate-x-1/2 group-hover:w-full ${activeTab === tab.tab.toLowerCase() ? "w-full" : "w-0"}`}
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
            onClick={() => setActiveTab(tab.tab.toLowerCase() as Tab)}
          >
            <h1
              className={`text-center flex-1 h-full flex justify-center items-center gap-2 md:gap-4 uppercase text-sm font-semibold ${activeTab === tab.tab.toLowerCase() ? "text-[#2dd4bf]" : "text-secondary"}`}
            >
              <span>{tab.icon}</span>
              {tab.tab}
            </h1>
            <div
              className={`absolute bottom-0 left-1/2 h-0.5 w-0 bg-[#21262d] dark:bg-[#2dd4bf] transition-all duration-300 ease-out transform -translate-x-1/2 group-hover:w-full ${activeTab === tab.tab.toLowerCase() ? "w-full" : "w-0"}`}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
}
