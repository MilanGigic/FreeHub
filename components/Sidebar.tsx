"use client";

import { useUIStore } from "@/lib/store/useUIStore";
import {
  Briefcase,
  FileText,
  House,
  ListTodo,
  MessageCircle,
  Users,
  Wallet,
  X,
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

  const { isSidebarOpen, sidebarClose } = useUIStore();

  return (
    <div className="h-full">
      {/* MOBILE VIEW */}
      {isSidebarOpen ? (
        <div className="fixed top-14 left-0 h-full w-2/3 max-w-xs bg-black/50 backdrop-blur-sm z-100 border-r-2 border-[#21262d] sm:hidden">
          <div className="flex flex-col h-full">
            <button
              onClick={() => sidebarClose()}
              className="p-4 flex justify-end"
            >
              <X
                size={40}
                className="text-white transition-all border rounded-full p-1"
              />
            </button>
            <div className="flex flex-col pt-2 gap-2 border-b border-[#21262d] h-[92%]">
              {tabs.map((tab) => (
                <Link
                  key={tab}
                  href={`/${tab.toLowerCase().replace(" ", "-")}`}
                  onClick={() => sidebarClose()}
                  className={`w-full h-12 flex flex-col items-center justify-center cursor-pointer 
                    ${pathname.startsWith(`/${tab.toLowerCase().replace(" ", "-")}`) ? "text-[#2dd4bf] bg-[#161b22]" : "hover:text-[#2dd4bf]"} transition-all`}
                >
                  {!pathname.startsWith(
                    `/${tab.toLowerCase().replace(" ", "-")}`,
                  ) ? (
                    <span>{renderTab(tab)}</span>
                  ) : null}
                  <h1 className="text-xs uppercase font-semibold">{tab}</h1>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* DESKTOP VIEW */}
      <div className="hidden w-24 md:w-48 h-full background-sidebar background-border border-r p-1 z-20 relative sm:flex sm:flex-col">
        <div className="flex flex-col pt-2 gap-2 border-b border-[#21262d] flex-1">
          {tabs.map((tab) => (
            <Link
              key={tab}
              href={`/${tab.toLowerCase().replace(" ", "-")}`}
              className={`w-full h-12 flex flex-col items-center justify-center cursor-pointer 
              ${pathname.startsWith(`/${tab.toLowerCase().replace(" ", "-")}`) ? "text-[#2dd4bf] bg-[#161b22]" : "hover:text-[#2dd4bf]"} transition-all`}
            >
              {!pathname.startsWith(
                `/${tab.toLowerCase().replace(" ", "-")}`,
              ) ? (
                <span>{renderTab(tab)}</span>
              ) : null}
              <h1 className="text-xs uppercase font-semibold">{tab}</h1>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
