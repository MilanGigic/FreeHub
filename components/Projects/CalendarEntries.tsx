"use client";

import { addEntryToCalendar } from "@/actions/projects/calendar/addEntryToCalendar";
import { fetchExistingEntries } from "@/actions/projects/calendar/fetchExistingEntries";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { ProjectCalendar } from "@/types/types";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function CalendarEntries() {
  const {
    selectedProject,
    selectedDate,
    note,
    setNote,
    hoursWorked,
    setHoursWorked,
  } = useProjectStore();

  const [existingEntries, setExistingEntries] = useState<ProjectCalendar[]>([]);

  useEffect(() => {
    if (!selectedProject || !selectedDate) return;
    (async () => {
      const entries = await fetchExistingEntries(
        selectedProject.id,
        selectedDate,
      );
      if (entries.success) {
        if (entries.data) {
          setExistingEntries(entries.data);
        }
      } else {
        toast.error(
          entries.error || "An error occurred while fetching existing entries",
        );
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

    if (!result.newEntries) return;
    setExistingEntries(result.newEntries.data || []);

    if (result.success) {
      toast.success("Entry added successfully");
      setNote("");
      setHoursWorked(null);
    } else {
      toast.error(result.error || "An error occurred while adding entry");
      setNote("");
      setHoursWorked(null);
      return;
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-2 md:gap-4">
      <header className="flex flex-col gap-2 md:gap-4 px-4">
        <h1 className="text-primary font-semibold text-center md:text-left uppercase">
          Existing Entries: {existingEntries.length}
        </h1>

        <div className="w-full max-w-[800px] mx-auto overflow-x-auto">
          <div className="flex gap-2 md:gap-4 flex-nowrap min-h-0 pb-2">
            {existingEntries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => {
                  if (
                    note === entry.note &&
                    hoursWorked === entry.hoursWorked
                  ) {
                    setNote("");
                    setHoursWorked(null);
                  } else {
                    setNote(entry.note);
                    setHoursWorked(entry.hoursWorked);
                  }
                }}
                className={`flex flex-col gap-2 md:gap-4 border background-border background-elevated p-4 rounded-lg justify-between cursor-pointer hover:bg-(--accent-green)/20 transition-all shrink-0 min-w-[200px] w-[200px] ${
                  note === entry.note && hoursWorked === entry.hoursWorked
                    ? "bg-(--accent-green)/20"
                    : ""
                }`}
              >
                <h2 className="primary-slate">
                  Date:{" "}
                  <span className="text-primary font-semibold">
                    {entry.date.toLocaleDateString()}
                  </span>
                </h2>
                <p className="primary-slate">
                  Note: <span className="text-primary">{entry.note}</span>
                </p>
                <p className="primary-slate">
                  Hours Worked:{" "}
                  <span className="text-primary font-semibold">
                    {entry.hoursWorked}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </header>
      <form
        onSubmit={(e) => handleAddEntry(e)}
        className="w-full h-full background-border p-4 rounded-lg gap-2 md:gap-4 flex flex-col"
      >
        <div className="flex flex-col gap-2 md:gap-4 border background-border background-elevated p-4 rounded-lg">
          <label htmlFor="date" className="text-primary font-semibold">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={dateValue}
            disabled={true}
            className="p-2 rounded-lg w-full border background-border outline-[#0969da] text-primary"
          />
        </div>
        <div className="flex flex-col gap-2 md:gap-4 border background-border background-elevated p-4 rounded-lg">
          <label htmlFor="note" className="text-primary font-semibold">
            Note
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="p-2 rounded-lg w-full border background-border outline-[#0969da] text-primary"
          />
        </div>
        <div className="flex flex-col gap-2 md:gap-4 border background-border background-elevated p-4 rounded-lg">
          <label htmlFor="hoursWorked" className="text-primary font-semibold">
            Hours Worked
          </label>
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
              const isDigit =
                e.key.length === 1 && e.key >= "0" && e.key <= "9";
              const isDecimal = e.key === ".";
              const isAllowedKey = allowedKeys.includes(e.key);
              if (!isDigit && !isDecimal && !isAllowedKey) {
                e.preventDefault();
              }
            }}
            onPaste={(e) => {
              e.preventDefault();
              const raw = e.clipboardData
                .getData("text")
                .replace(/[^\d.]/g, "");
              const parts = raw.split(".");
              const numeric =
                parts.length > 1
                  ? `${parts[0]}.${parts.slice(1).join("")}`
                  : raw;
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
            className="p-2 rounded-lg w-full border background-border outline-(--accent-cyan) text-primary"
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
    </div>
  );
}
