"use client";

import { addEntryToCalendar } from "@/actions/projects/calendar/addEntryToCalendar";
import { fetchExistingEntries } from "@/actions/projects/calendar/fetchExistingEntries";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useAuth } from "@/lib/useAuth";
import { ProjectCalendar } from "@/types/types";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

const MONTH_KEYS = [
  "months.january", "months.february", "months.march", "months.april",
  "months.may", "months.june", "months.july", "months.august",
  "months.september", "months.october", "months.november", "months.december",
] as const;

function isToday(d: Date) {
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export default function CalendarEntries() {
  const t = useTranslations("calendar");
  const tCommon = useTranslations("common");
  const { user } = useAuth();
  const {
    selectedProject,
    selectedDate,
    setSelectedDate,
    note,
    setNote,
    hoursWorked,
    setHoursWorked,
  } = useProjectStore();

  const [existingEntries, setExistingEntries] = useState<ProjectCalendar[]>([]);

  useEffect(() => {
    if (!selectedProject || !selectedDate || !user) {
      void Promise.resolve().then(() => setExistingEntries([]));
      return;
    }
    let cancelled = false;
    (async () => {
      const entries = await fetchExistingEntries(
        user.id,
        selectedProject.id,
        selectedDate,
      );
      if (cancelled) return;
      if (entries.success && entries.data) {
        setExistingEntries(entries.data);
      } else {
        setExistingEntries([]);
        if (entries.success === false && entries.error) {
          const msg =
            typeof entries.error === "string"
              ? entries.error
              : t("failedToLoadEntries");
          toast.error(msg);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedProject, selectedDate, user]);

  if (!selectedProject) return null;

  const totalHours = existingEntries.reduce((sum, e) => sum + e.hoursWorked, 0);
  const entryLabel =
    existingEntries.length === 1
      ? t("oneEntry")
      : `${existingEntries.length} ${t("entries")}`;

  const goPrevDay = () => {
    if (!selectedDate) return;
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
  };
  const goNextDay = () => {
    if (!selectedDate) return;
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
  };

  const handleAddEntry = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !selectedProject ||
      !selectedDate ||
      hoursWorked == null ||
      hoursWorked <= 0 ||
      !user
    )
      return;

    const result = await addEntryToCalendar(
      user.id,
      selectedProject.id,
      selectedDate,
      note.trim() || tCommon("noDescription"),
      hoursWorked,
    );

    if (result.newEntries) {
      setExistingEntries(result.newEntries.data || []);
    }
    if (result.success) {
      toast.success(t("entryAdded"));
      setNote("");
      setHoursWorked(null);
    } else {
      const errMsg =
        result.error instanceof Error
          ? result.error.message
          : (result.error as string) || t("failedToAddEntry");
      toast.error(errMsg);
      setNote("");
      setHoursWorked(null);
    }
  };

  if (!selectedDate) {
    return (
      <div className="w-full h-full flex flex-col gap-3 p-4 background-elevated border background-border rounded-lg items-center justify-center text-tertiary">
        <p className="text-sm">{t("selectADay")}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4 background-elevated border background-border rounded-lg min-h-0">
      {/* Header: "Today March 13" + nav arrows + list icon */}
      <div className="flex items-center justify-between gap-2 shrink-0">
        <h2 className="text-primary font-semibold">
          {isToday(selectedDate) ? t("today") : ""}
          {t(MONTH_KEYS[selectedDate.getMonth()])} {selectedDate.getDate()}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goPrevDay}
            className="p-1.5 rounded border background-border hover:background text-primary transition-colors"
            aria-label={t("previousDay")}
          >
            <ChevronLeftIcon size={18} />
          </button>
          <button
            type="button"
            onClick={goNextDay}
            className="p-1.5 rounded border background-border hover:background text-primary transition-colors"
            aria-label={t("nextDay")}
          >
            <ChevronRightIcon size={18} />
          </button>
        </div>
      </div>

      {/* Summary pill: "3h logged • 1 entry" */}
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-(--accent-green)/20 text-(--accent-green) px-2.5 py-1 text-sm font-medium">
          {totalHours}h
        </span>
        <span className="text-sm text-tertiary">{t("logged")} {entryLabel}</span>
      </div>

      {/* Entry list: description left, hours right */}
      <div className="flex flex-col gap-1 min-h-0 overflow-auto">
        {existingEntries.map((entry) => (
          <div
            key={entry.id}
            className="flex items-center justify-between py-2 px-2 rounded border background-border text-primary text-sm"
          >
            <span className="truncate">{entry.note || tCommon("noDescription")}</span>
            <span className="font-medium shrink-0 ml-2">
              {entry.hoursWorked}h
            </span>
          </div>
        ))}
      </div>

      {/* Add form */}
      <form
        onSubmit={handleAddEntry}
        className="flex flex-col gap-3 shrink-0 mt-auto pt-2 border-t background-border"
      >
        <input
          type="text"
          placeholder={t("whatDidYouWorkOn")}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full p-2.5 rounded-lg border background-border background text-primary placeholder:text-tertiary outline-none focus:ring-2 focus:ring-(--accent-cyan) text-sm"
        />
        <div className="flex gap-2">
          <input
            type="number"
            id="hoursWorked"
            min={0}
            max={24}
            step="0.25"
            inputMode="decimal"
            placeholder={t("hoursPlaceholder")}
            value={hoursWorked !== null && hoursWorked > 0 ? hoursWorked : ""}
            onKeyDown={(e) => {
              const allowed = [
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
              if (!isDigit && !isDecimal && !allowed.includes(e.key)) {
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
              if (!Number.isNaN(n))
                setHoursWorked(Math.min(24, Math.max(0, n)));
            }}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === "") {
                setHoursWorked(null);
                return;
              }
              const n = Number(raw);
              if (!Number.isNaN(n))
                setHoursWorked(Math.min(24, Math.max(0, n)));
            }}
            className="flex-1 p-2.5 rounded-lg border background-border background text-primary placeholder:text-tertiary outline-none focus:ring-2 focus:ring-(--accent-cyan) text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-lg font-semibold text-white bg-linear-to-r from-(--accent-green) to-(--accent-cyan) hover:opacity-90 transition-opacity shrink-0"
          >
            {tCommon("add")}
          </button>
        </div>
      </form>
    </div>
  );
}
