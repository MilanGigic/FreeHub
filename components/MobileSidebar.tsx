"use client";

import { useUIStore } from "@/lib/store/useUIStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  House,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";

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

const tabs = [
  { key: "dashboard", route: "dashboard" },
  { key: "clients", route: "clients" },
  { key: "projects", route: "projects" },
  { key: "finances", route: "finances" },
];

export default function MobileSidebar() {
  const pathname = usePathname();
  const t = useTranslations("navigation");

  const { sidebarClose } = useUIStore();
  return (
    <div className="fixed top-14 left-0 h-full w-2/3 max-w-xs bg-black/50 backdrop-blur-sm z-100 border-r-2 background-border sm:hidden">
      <div className="flex flex-col h-full">
        <button onClick={() => sidebarClose()} className="p-4 flex justify-end">
          <X
            size={40}
            className="text-primary transition-all border background-border rounded-full p-1"
          />
        </button>
        <div className="flex flex-col pt-2 gap-2 h-[92%]">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              href={`/${tab.route}`}
              onClick={() => sidebarClose()}
              className={`w-full h-12 flex flex-col items-center justify-center cursor-pointer 
            ${pathname.startsWith(`/${tab.route}`) ? "primary-cyan background-elevated" : "hover:primary-cyan text-primary hover:background-elevated"} transition-all`}
            >
              {!pathname.startsWith(
                `/${tab.route}`,
              ) ? (
                <span>{renderTab(tab.key)}</span>
              ) : null}
              <h1 className="text-xs uppercase font-semibold">{t(tab.key)}</h1>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
