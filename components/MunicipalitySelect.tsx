"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { MUNICIPALITIES, MunicipalitySeed } from "@/config/constants";

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

export function MunicipalitySelect({ value, onChange }: Props) {
  const [query, setQuery] = useState("");

  const filtered = MUNICIPALITIES.filter((m: MunicipalitySeed) =>
    m.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="w-full flex flex-col gap-2 relative">
      <Input
        placeholder="Počnite da kucate..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="text-center"
      />

      {query && (
        <div className="absolute top-full mt-1 w-full bg-(--background-elevated) border border-(--background-border) rounded-lg max-h-48 overflow-y-auto z-50">
          {filtered.length > 0 ? (
            filtered.map((m: MunicipalitySeed) => (
              <div
                key={m.code}
                onClick={() => {
                  onChange(m.code);
                  setQuery("");
                }}
                className="px-4 py-2 border background-border rounded-lg hover:border-(--accent-cyan) cursor-pointer bg-(--background-elevated)/60 backdrop-blur-xs text-primary"
              >
                {m.name}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              Nema rezultata
            </div>
          )}
        </div>
      )}
    </div>
  );
}
