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

  return (
    <div className="flex justify-center items-center gap-2 md:gap-4 w-full">
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
  );
}
