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
  "Clients",
  "Projects",
  "Finances",
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
        <div className="fixed top-14 left-0 h-full w-2/3 max-w-xs bg-black/50 backdrop-blur-sm z-100 border-r-2 background-border sm:hidden">
          <div className="flex flex-col h-full">
            <button
              onClick={() => sidebarClose()}
              className="p-4 flex justify-end"
            >
              <X
                size={40}
                className="text-primary transition-all border background-border rounded-full p-1"
              />
            </button>
            <div className="flex flex-col pt-2 gap-2 h-[92%]">
              {tabs.map((tab) => (
                <Link
                  key={tab}
                  href={`/${tab.toLowerCase().replace(" ", "-")}`}
                  onClick={() => sidebarClose()}
                  className={`w-full h-12 flex flex-col items-center justify-center cursor-pointer 
                    ${pathname.startsWith(`/${tab.toLowerCase().replace(" ", "-")}`) ? "primary-cyan background-elevated" : "hover:primary-cyan text-primary hover:background-elevated"} transition-all`}
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
        <div className="flex flex-col pt-2 gap-2 flex-1">
          {tabs.map((tab) => (
            <Link
              key={tab}
              href={`/${tab.toLowerCase().replace(" ", "-")}`}
              className={`w-full h-12 flex flex-col items-center justify-center cursor-pointer 
              ${pathname.startsWith(`/${tab.toLowerCase().replace(" ", "-")}`) ? "primary-cyan background-elevated" : "hover:primary-cyan text-primary hover:background-elevated"} transition-all`}
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
