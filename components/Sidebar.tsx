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
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();

  return (
    <div className="w-24 md:w-48 self-stretch background-sidebar background-border border-r p-1">
      <div className="flex flex-col pt-2 gap-2 border-b border-[#21262d] h-[92%]">
        {tabs.map((tab) => (
          <Link
            key={tab}
            href={`/${tab.toLowerCase().replace(" ", "-")}`}
            className={`w-full h-12 flex flex-col items-center justify-center cursor-pointer 
            ${pathname.startsWith(`/${tab.toLowerCase().replace(" ", "-")}`) ? "text-[#2dd4bf] bg-[#161b22]" : "hover:text-[#2dd4bf]"} transition-all`}
          >
            {!pathname.startsWith(`/${tab.toLowerCase().replace(" ", "-")}`) ? (
              <span>{renderTab(tab)}</span>
            ) : null}
            <h1 className="text-xs uppercase font-semibold">{tab}</h1>
          </Link>
        ))}
      </div>
    </div>
  );
}
