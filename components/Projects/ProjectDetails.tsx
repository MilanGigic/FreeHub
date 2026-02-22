"use client";

import { addEntryToCalendar } from "@/actions/projects/addEntryToCalendar";
import { fetchDataForSelectedDate } from "@/actions/projects/fetchDataForSelectedDate";
import { useUIStore } from "@/lib/store/useUIStore";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ProjectDetails() {
  const { selectedProject, selectedDate } = useUIStore();
  const [note, setNote] = useState<string>("");
  const [hoursWorked, setHoursWorked] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      if (!selectedProject || !selectedDate) return;
      const result = await fetchDataForSelectedDate(
        selectedProject.id,
        selectedDate,
      );
      if (result.success) {
        setNote(result.data?.note ?? "");
        setHoursWorked(result.data?.hoursWorked ?? null);
      }
    })();
  }, [selectedProject, selectedDate]);

  if (!selectedProject) return null;

  const dateValue = selectedDate
    ? `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`
    : "";

  const handleAddEntry = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedProject || !selectedDate || !hoursWorked) return;

    const result = await addEntryToCalendar(
      selectedProject.id,
      selectedDate,
      note,
      hoursWorked,
    );

    if (result.success) {
      toast.success("Entry added successfully");
      setNote("");
      setHoursWorked(null);
    } else {
      toast.error(
        result.error?.message || "An error occurred while adding entry",
      );
      setNote("");
      setHoursWorked(null);
      return;
    }
  };

  return (
    <form
      onSubmit={(e) => handleAddEntry(e)}
      className="w-full h-full background-border p-4 rounded-lg gap-2 md:gap-4 flex flex-col"
    >
      <div className="flex flex-col gap-2 md:gap-4 border background-border background-elevated p-4 rounded-lg">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          value={dateValue}
          disabled={true}
          className="p-2 rounded-lg w-full border background-border outline-[#0969da]"
        />
      </div>
      <div className="flex flex-col gap-2 md:gap-4 border background-border background-elevated p-4 rounded-lg">
        <label htmlFor="note">Note</label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="p-2 rounded-lg w-full border background-border outline-[#0969da]"
        />
      </div>
      <div className="flex flex-col gap-2 md:gap-4 border background-border background-elevated p-4 rounded-lg">
        <label htmlFor="hoursWorked">Hours Worked</label>
        <input
          type="number"
          id="hoursWorked"
          min={0}
          max={24}
          step="0.25"
          inputMode="decimal"
          value={hoursWorked !== null ? hoursWorked : ""}
          onKeyDown={(e) => {
            const allowedKeys = [
              "Backspace",
              "Delete",
              "Tab",
              "Escape",
              "Enter",
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "Home",
              "End",
            ];
            const isDigit = e.key.length === 1 && e.key >= "0" && e.key <= "9";
            const isDecimal = e.key === ".";
            const isAllowedKey = allowedKeys.includes(e.key);
            if (!isDigit && !isDecimal && !isAllowedKey) {
              e.preventDefault();
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            const raw = e.clipboardData.getData("text").replace(/[^\d.]/g, "");
            const parts = raw.split(".");
            const numeric =
              parts.length > 1 ? `${parts[0]}.${parts.slice(1).join("")}` : raw;
            if (numeric === "" || numeric === ".") return;
            const n = Number(numeric);
            if (!Number.isNaN(n)) {
              setHoursWorked(Math.min(24, Math.max(0, n)));
            }
          }}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === "") {
              setHoursWorked(null);
              return;
            }
            const n = Number(raw);
            if (!Number.isNaN(n)) {
              setHoursWorked(Math.min(24, Math.max(0, n)));
            }
          }}
          className="p-2 rounded-lg w-full border background-border outline-[#0969da]"
        />
      </div>

      <div className="w-full flex">
        <button
          type="submit"
          className="rounded-lg w-full background-elevated border px-4 py-2 outline-none border-(--accent-green) transition-all cursor-pointer text-primary font-semibold hover:bg-(--accent-green)/20"
        >
          Add Entry
        </button>
      </div>
    </form>
  );
}
