"use client";

import {
  Briefcase,
  FileText,
  House,
  ListTodo,
  MessageCircle,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const tabs = [
  "Dashboard",
  "Finances",
  "Clients",
  "Projects",
  "Tasks",
  "Reports",
  "Messages",
];

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
    case "Tasks":
      return <ListTodo />;
    case "Reports":
      return <FileText />;
    case "Messages":
      return <MessageCircle />;
  }
}

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>("Dashboard");

  return (
    <div className="w-24 h-full bg-[#11151c] border-r border-t border-[#1f2937] flex flex-col gap-2 rounded-t-lg pt-2">
      {tabs.map((tab) => (
        <Link
          key={tab}
          href={`/${tab.toLowerCase().replace(" ", "-")}`}
          onClick={() => setActiveTab(tab as Tab)}
          className={`w-full h-12 flex flex-col items-center justify-center cursor-pointer 
            ${activeTab === tab ? "text-[#2dd4bf]" : "hover:text-[#2dd4bf]"} transition-all`}
        >
          {renderTab(tab)}
          <h1 className="text-xs uppercase font-semibold">{tab}</h1>
        </Link>
      ))}
    </div>
  );
}
