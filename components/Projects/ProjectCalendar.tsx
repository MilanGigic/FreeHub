"use client"

import { useEffect, useMemo, useState } from "react"
import { useUIStore } from "@/lib/store/useUIStore"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { ProjectCalendar } from "@/types/types"
import { fetchDataForSelectedDate } from "@/actions/projects/fetchDataForSelectedDate"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function daysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
}

function getCalendarDays(year: number, month: number) {
  const first = new Date(year, month, 1)
  const startWeekday = first.getDay()
  const totalDays = daysInMonth(first)
  const leadingEmpty = startWeekday
  const cells = leadingEmpty + totalDays
  const rows = Math.ceil(cells / 7)
  const trailingEmpty = rows * 7 - cells

  const days: (number | null)[] = []
  for (let i = 0; i < leadingEmpty; i++) days.push(null)
  for (let d = 1; d <= totalDays; d++) days.push(d)
  for (let i = 0; i < trailingEmpty; i++) days.push(null)
  return days
}

export default function ProjectCalendar() {
  const { selectedProject } = useUIStore()

  const [data, setData] = useState<ProjectCalendar | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(selectedProject?.createdAt ? new Date(selectedProject.createdAt) : null)

  useEffect(() => {
    (async () => {

        if (!selectedProject?.id || !selectedDate) return
        const res = await fetchDataForSelectedDate(selectedProject?.id, selectedDate)
        if (res.success) {
            if (res.data === undefined) setData(null)
            else setData(res.data)
        }
    })()
  }, [selectedProject?.id, selectedDate])

  const projectCreatedAt = useMemo(() => {
    if (!selectedProject?.createdAt) return null
    const raw = selectedProject.createdAt
    return raw instanceof Date ? raw : new Date(raw)
  }, [selectedProject?.createdAt])

  const [viewDate, setViewDate] = useState<Date>(() =>
    projectCreatedAt ? new Date(projectCreatedAt.getFullYear(), projectCreatedAt.getMonth(), 1) : new Date()
  )

  if (!selectedProject) return null

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const calendarDays = getCalendarDays(year, month)
  const today = new Date()

  const goPrev = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const goNext = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  return (
    <div className="border-2 background-border p-4 rounded-lg">
      <h2 className="text-2xl font-bold text-primary mb-4">
        Project Calendar
      </h2>

      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={goPrev}
          className="p-2 rounded-lg border-interactive border hover:background-elevated text-primary transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeftIcon size={20} />
        </button>
        <span className="text-lg font-semibold text-primary">
          {MONTHS[month]} {year}
        </span>
        <button
          type="button"
          onClick={goNext}
          className="p-2 rounded-lg border-interactive border hover:background-elevated text-primary transition-colors"
          aria-label="Next month"
        >
          <ChevronRightIcon size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-tertiary py-1"
          >
            {day}
          </div>
        ))}
        {calendarDays.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} className="aspect-square" />
          }
          const cellDate = new Date(year, month, day)
          const isToday = isSameDay(cellDate, today)
          const isProjectStart = projectCreatedAt && isSameDay(cellDate, projectCreatedAt)
          return (
            <div
              key={`${year}-${month}-${day}`}
              onClick={() => selectedDate?.getDay() === day ? setSelectedDate(null) : setSelectedDate(cellDate)}
              className={`
                h-36 flex items-center justify-center rounded-lg text-sm font-medium border
                ${isProjectStart ? "bg-(--accent-cyan) text-white ring-2 ring-(--accent-cyan) ring-offset-2 ring-offset-(--bg-main)" : ""}
                ${!isProjectStart && isToday ? "border-2 border-(--accent-cyan) text-primary" : ""}
                ${!isProjectStart && !isToday ? "text-primary hover:background-elevated" : ""}
                ${selectedDate?.getDate() === cellDate.getDate()  ? "bg-(--accent-green) text-white ring-2 ring-(--accent-cyan) ring-offset-2 ring-offset-(--bg-main)" : ""}
                `}
            >
              {day}
            </div>
          )
        })}
      </div>

      {projectCreatedAt && (
        <p className="mt-3 text-sm primary-slate">
          Project started on {MONTHS[projectCreatedAt.getMonth()]} {projectCreatedAt.getDate()}, {projectCreatedAt.getFullYear()}
        </p>
      )}
    </div>
  )
}
