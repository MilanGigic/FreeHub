"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, Clock } from "lucide-react";
import { useProjectStore } from "@/lib/store/useProjectStore";
import { useAuth } from "@/lib/useAuth";
import { fetchCalendarEntriesForMonth } from "@/actions/projects/calendar/fetchCalendarEntriesForMonth";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function getCalendarDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startWeekday = first.getDay();
  const totalDays = daysInMonth(first);
  const leadingEmpty = startWeekday;
  const cells = leadingEmpty + totalDays;
  const rows = Math.ceil(cells / 7);
  const trailingEmpty = rows * 7 - cells;

  const days: (number | null)[] = [];
  for (let i = 0; i < leadingEmpty; i++) days.push(null);
  for (let d = 1; d <= totalDays; d++) days.push(d);
  for (let i = 0; i < trailingEmpty; i++) days.push(null);
  return days;
}

/** Map from "year-month-day" to total hours for that day */
function buildHoursByDay(
  entries: { date: Date; hoursWorked: number }[],
  year: number,
  month: number,
): { hoursByDay: Record<string, number>; monthlyTotal: number } {
  const hoursByDay: Record<string, number> = {};
  let monthlyTotal = 0;
  for (const e of entries) {
    const d = e.date instanceof Date ? e.date : new Date(e.date);
    if (d.getFullYear() !== year || d.getMonth() !== month) continue;
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    hoursByDay[key] = (hoursByDay[key] ?? 0) + e.hoursWorked;
    monthlyTotal += e.hoursWorked;
  }
  return { hoursByDay, monthlyTotal };
}

const DOT_COLORS = [
  "bg-[#3b82f6]", // blue
  "bg-[var(--accent-green)]",
  "bg-teal-400",
  "bg-[var(--accent-purple)]",
  "bg-zinc-500",
];

export default function ProjectCalendar() {
  const { user } = useAuth();
  const { selectedProject, selectedDate, setSelectedDate } = useProjectStore();

  const projectCreatedAt = useMemo(() => {
    if (!selectedProject?.createdAt) return null;
    const raw = selectedProject.createdAt;
    return raw instanceof Date ? raw : new Date(raw);
  }, [selectedProject?.createdAt]);

  const [viewDate, setViewDate] = useState<Date>(() =>
    projectCreatedAt
      ? new Date(projectCreatedAt.getFullYear(), projectCreatedAt.getMonth(), 1)
      : new Date(),
  );
  const [today, setToday] = useState<Date | null>(null);
  const [monthEntries, setMonthEntries] = useState<
    { date: Date; hoursWorked: number }[]
  >([]);

  useEffect(() => {
    const id = requestAnimationFrame(() => setToday(new Date()));
    return () => cancelAnimationFrame(id);
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  useEffect(() => {
    if (!selectedProject || !user) {
      void Promise.resolve().then(() => setMonthEntries([]));
      return;
    }
    let cancelled = false;
    (async () => {
      const result = await fetchCalendarEntriesForMonth(
        user.id,
        selectedProject.id,
        year,
        month,
      );
      if (cancelled) return;
      if (result.success && result.data?.length) {
        setMonthEntries(
          result.data.map((e) => ({
            date: e.date instanceof Date ? e.date : new Date(e.date),
            hoursWorked: e.hoursWorked,
          })),
        );
      } else {
        setMonthEntries([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedProject, user, year, month]);

  const { hoursByDay, monthlyTotal } = useMemo(
    () => buildHoursByDay(monthEntries, year, month),
    [monthEntries, year, month],
  );

  if (!selectedProject) return null;

  const calendarDays = getCalendarDays(year, month);

  const goPrev = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goNext = () =>
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  return (
    <div className="p-4 rounded-lg w-full h-full flex flex-col gap-3 background-elevated border background-border">
      {/* Header: Month year + nav (left, 1, right) */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-primary">
          {MONTHS[month]} {year}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goPrev}
            className="p-1.5 rounded border background-border hover:background text-primary transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeftIcon size={18} />
          </button>
          <span className="text-xs text-tertiary px-2">{month + 1}</span>
          <button
            type="button"
            onClick={goNext}
            className="p-1.5 rounded border background-border hover:background text-primary transition-colors"
            aria-label="Next month"
          >
            <ChevronRightIcon size={18} />
          </button>
        </div>
      </div>

      {/* Weekday row */}
      <div className="grid grid-cols-7 gap-px">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-tertiary py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px flex-1 min-h-0 auto-rows-fr">
        {calendarDays.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="min-h-[64px]" />;
          }
          const cellDate = new Date(year, month, day);
          const dayKey = `${year}-${month}-${day}`;
          const hours = hoursByDay[dayKey] ?? 0;
          const isSelected = selectedDate
            ? isSameDay(cellDate, selectedDate)
            : false;
          const isToday = today ? isSameDay(cellDate, today) : false;
          const dotColor = DOT_COLORS[day % DOT_COLORS.length];

          return (
            <button
              type="button"
              key={`${year}-${month}-${day}`}
              onClick={() =>
                selectedDate && isSameDay(cellDate, selectedDate)
                  ? setSelectedDate(null)
                  : setSelectedDate(cellDate)
              }
              className={`
                min-h-[64px] flex flex-col items-center justify-start pt-1.5 pb-1 rounded border background-border
                text-sm font-medium transition-colors
                ${isSelected ? "bg-zinc-600/40 dark:bg-zinc-500/30 text-primary" : ""}
                ${!isSelected ? "background hover:background-elevated text-primary" : ""}
              `}
            >
              <span
                className={
                  isToday && !isSelected ? "text-(--accent-green)" : ""
                }
              >
                {day}
              </span>
              {hours > 0 && (
                <div className="flex flex-col items-center mt-auto gap-0.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`}
                  />
                  <span className="text-xs text-tertiary">{hours}h</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Monthly total */}
      <div className="flex items-center gap-2 pt-2 border-t background-border">
        <Clock className="w-4 h-4 text-tertiary" />
        <span className="text-sm font-medium text-primary">
          {monthlyTotal}h
        </span>
      </div>
    </div>
  );
}
