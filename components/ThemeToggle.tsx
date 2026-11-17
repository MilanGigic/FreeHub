"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";

type Theme = "light" | "dark";

const listeners = new Set<() => void>();

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
}

function notify() {
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const onSystemChange = () => {
    // Only follow the system if the user hasn't chosen a theme
    if (!localStorage.getItem("theme")) {
      applyTheme(media.matches);
      notify();
    }
  };
  // Other tabs: re-read the stored theme
  const onStorage = (e: StorageEvent) => {
    if (e.key === "theme") {
      applyTheme(e.newValue === "dark" || (!e.newValue && media.matches));
      notify();
    }
  };

  media.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => false;

export default function ThemeToggle() {
  const t = useTranslations("common");
  const isDark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setTheme = (theme: Theme) => {
    localStorage.setItem("theme", theme);
    applyTheme(theme === "dark");
    notify();
  };

  return (
    <div className="w-full background-elevated border background-border p-1 rounded-lg">
      <div className="w-full flex" role="group" aria-label={t("toggleTheme")}>
        <button
          type="button"
          onClick={() => setTheme("dark")}
          aria-pressed={isDark}
          className={`p-2 rounded-md w-full ${isDark ? "bg-white/5 text-primary" : "text-tertiary"}`}
        >
          {t("dark")}
        </button>
        <button
          type="button"
          onClick={() => setTheme("light")}
          aria-pressed={!isDark}
          className={`p-2 rounded-md w-full ${!isDark ? "bg-black/5 text-primary" : "text-tertiary"}`}
        >
          {t("light")}
        </button>
      </div>
    </div>
  );
}
