"use client";

import { Opstina } from "@/lib/opstineSrbije";
import { opstineSrbije } from "@/lib/opstineSrbije";
import { useEffect, useRef, useState } from "react";

interface Props {
  value: Opstina | null;
  onChange: (val: Opstina) => void;
}

export function OpštinaSelect({ value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = opstineSrbije
    .filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    .slice()
    .sort((a, b) => a.localeCompare(b, "sr"));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      <input
        readOnly
        value={value ?? ""}
        placeholder="Odaberi opštinu..."
        onClick={() => setOpen((o) => !o)}
      />
      {open && (
        <div
          style={{
            position: "absolute",
            zIndex: 50,
            width: "100%",
            border: "1px solid #ccc",
            background: "#fff",
            borderRadius: 8,
          }}
        >
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pretraži..."
            style={{
              width: "100%",
              padding: "8px",
              borderBottom: "1px solid #eee",
            }}
          />
          <ul
            style={{
              maxHeight: 240,
              overflowY: "auto",
              listStyle: "none",
              padding: 0,
            }}
          >
            {filtered.map((o) => (
              <li
                key={o}
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                  setQuery("");
                }}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  background: o === value ? "#f0f4ff" : undefined,
                }}
              >
                {o}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
