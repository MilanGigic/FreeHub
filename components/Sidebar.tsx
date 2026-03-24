"use client";

import { useUIStore } from "@/lib/store/useUIStore";
import MobileSidebar from "./MobileSidebar";
import DesktopSidebar from "./DesktopSidebar";

export default function Sidebar() {
  const { isSidebarOpen } = useUIStore();

  return (
    <div className="h-full">
      {isSidebarOpen && <MobileSidebar />}

      <DesktopSidebar />
    </div>
  );
}
