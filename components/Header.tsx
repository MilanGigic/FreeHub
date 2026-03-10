"use client";

import { useUIStore } from "@/lib/store/useUIStore";
import { Bell, ChevronDown, List, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/lib/useAuth";

export default function Header() {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const { isSidebarOpen, sidebarOpen } = useUIStore();

  const spaces = ["Space 1", "Space 2", "Space 3"];

  return (
    <div className="w-full flex px-4 py-2 gap-2 border-b background-border sticky top-0 z-30 background backdrop-blur-sm">
      {/* DESKTOP VIEW */}
      <div className="relative hidden sm:block">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="h-10 min-w-[170px] rounded-lg background-elevated border background-border px-4 py-2 text-left text-xs font-semibold uppercase text-primary flex items-center justify-between focus-border-accent transition-all outline-none"
        >
          <span>{selected ?? "Select a space"}</span>
          <span className="ml-2 text-[10px]">▾</span>
        </button>

        {open && (
          <div className="absolute mt-1 w-full rounded-lg background-elevated border background-border shadow-lg z-10">
            {spaces.map((project) => (
              <button
                key={project}
                type="button"
                onClick={() => {
                  setSelected(project);
                  setOpen(false);
                }}
                className="w-full px-4 py-2 text-xs text-left text-primary hover:bg-(--border-default) cursor-pointer hover:rounded-lg focus-border-accent transition-all outline-none"
              >
                {project}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* MOBILE VIEW */}
      {!isSidebarOpen ? (
        <div className="flex justify-start items-center sm:hidden">
          <button onClick={() => sidebarOpen()} className="p-2">
            <List size={40} className="text-primary transition-all" />
          </button>
        </div>
      ) : null}
      <div className="relative flex items-center justify-end w-full sm:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="h-10 min-w-[170px] rounded-lg background-elevated border background-border px-4 py-2 text-left text-xs font-semibold uppercase text-primary flex items-center justify-between focus-border-accent transition-all outline-none"
        >
          <span>{selected ?? "Select a space"}</span>
          <span className="ml-2 text-[10px]">▾</span>
        </button>

        {open && (
          <div className="absolute top-12 w-full rounded-lg background-elevated border background-border shadow-lg z-10">
            {spaces.map((project) => (
              <button
                key={project}
                type="button"
                onClick={() => {
                  setSelected(project);
                  setOpen(false);
                }}
                className="w-full px-4 py-2 text-xs text-left text-primary hover:bg-(--border-default) cursor-pointer hover:rounded-lg focus-border-accent transition-all outline-none"
              >
                {project}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ADD BUTTON TO OPEN THESE DIVS FOR MOBILE WIDTH */}
      {/* MOBILE VIEW */}

      {/* DESKTOP VIEW */}
      <div className="hidden sm:flex items-center justify-between w-full">
        <div className="flex-1 flex items-center justify-center">
          <input
            type="text"
            placeholder="Search"
            className="w-64 md:w-md h-8 rounded-md background-elevated border background-border px-4 py-2 outline-none text-sm text-primary placeholder:text-(--text-tertiary) focus-border-accent transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Bell
            size={40}
            className="px-2 text-primary cursor-pointer hover:primary-cyan transition-all"
          />
          {user ? (
            <Link href="/profile">
              <User
                size={40}
                className="px-2 text-primary cursor-pointer hover:primary-cyan transition-all"
              />
            </Link>
          ) : (
            <Link
              href="/register"
              className="text-primary underline hover:text-(--accent-cyan) transition-all uppercase font-semibold text-lg"
            >
              Register
            </Link>
          )}
          <ChevronDown
            size={40}
            className="px-2 text-primary cursor-pointer hover:primary-cyan transition-all"
          />
        </div>

        <ThemeToggle />
      </div>
    </div>
  );
}
