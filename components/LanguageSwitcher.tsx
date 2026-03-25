"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const locales = [
  { code: "en", label: "English" },
  { code: "sr-Latn", label: "Srpski" },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const switchLocale = (newLocale: string) => {
    // Replace the current locale segment in the URL with the new one
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setOpen(false);
  };

  const current = locales.find((l) => l.code === locale);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-primary cursor-pointer hover:primary-cyan transition-all flex items-center gap-2"
      >
        {current?.label}
        <ChevronDown size={20} className="text-primary transition-all" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-36 rounded-md shadow-lg background-elevated border border-border z-50 text-primary">
          {locales.map((l) => (
            <button
              key={l.code}
              onClick={() => switchLocale(l.code)}
              className={`w-full text-left px-4 py-2 text-sm hover:primary-cyan transition-colors first:rounded-t-md last:rounded-b-md ${
                l.code === locale ? "font-semibold text-primary" : ""
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
