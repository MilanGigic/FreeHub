"use client";

import { Bell, ChevronDown, User } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const spaces = ["Space 1", "Space 2", "Space 3"];

  return (
    <div className="w-full flex px-4 py-2 gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="h-10 min-w-[170px] rounded-lg bg-[#11151c] border border-[#1f2937] px-4 py-2 text-left text-xs font-semibold uppercase text-white flex items-center justify-between"
        >
          <span>{selected ?? "Select a space"}</span>
          <span className="ml-2 text-[10px]">▾</span>
        </button>

        {open && (
          <div className="absolute mt-1 w-full rounded-lg bg-[#11151c] border border-[#1f2937] shadow-lg z-10">
            {spaces.map((project) => (
              <button
                key={project}
                type="button"
                onClick={() => {
                  setSelected(project);
                  setOpen(false);
                }}
                className="w-full px-4 py-2 text-xs text-left text-white hover:bg-[#131720] cursor-pointer hover:rounded-lg"
              >
                {project}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between w-full">
        <div className="flex-1 flex items-center justify-center">
          <input
            type="text"
            placeholder="Search"
            className="w-64 h-10 rounded-md bg-[#11151c] border border-[#1f2937] px-4 py-2 outline-none text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-white" />
          <User className="w-6 h-6 text-white" />
          <ChevronDown className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
