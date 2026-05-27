import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Field } from "@/components/ui/field";
import { DateRange } from "react-day-picker";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FilterProps } from "./TypeFilter";
import {
  DatePreset,
  useTransactionsFiltersStore,
} from "@/lib/store/useTransactionsFiltersStore";

const DATE_FILTERS = ["7d", "30d", "month", "year"];

export default function DateFilter({
  openFilters,
  setOpenFilters,
}: FilterProps) {
  const { filters, setFilters } = useTransactionsFiltersStore();

  const [showCustomDate, setShowCustomDate] = useState<boolean>(false);
  const [customDate, setCustomDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  });

  return (
    <motion.div
      layout="position"
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 28,
      }}
      className="flex items-center gap-2"
    >
      <button
        className={`h-10 px-4 flex items-center text-xl border-r-2 transition-colors duration-200 ${
          openFilters === "date" ? "border-zinc-500" : "border-transparent"
        }`}
        onClick={() =>
          openFilters === "date" ? setOpenFilters(null) : setOpenFilters("date")
        }
      >
        Date
      </button>
      <AnimatePresence mode="popLayout">
        {openFilters === "date" && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 90,
              damping: 15,
              mass: 1,
              delay: 0.04,
            }}
            className="flex items-center gap-2"
          >
            <AnimatePresence mode="wait">
              {!showCustomDate ? (
                <motion.div
                  key="presets"
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  {DATE_FILTERS.map((date) => (
                    <button
                      key={date}
                      className={`flex items-center gap-2 uppercase cursor-pointer px-2 ${filters.datePreset === date ? "bg-cyan-500/15 text-cyan-300" : "text-zinc-500 hover:text-zinc-200"} transition-all duration-300`}
                      onClick={() =>
                        setFilters({
                          datePreset:
                            filters.datePreset === date
                              ? null
                              : (date as DatePreset),
                          customDateRange: null,
                        })
                      }
                    >
                      {date}
                    </button>
                  ))}
                  <button
                    className={`flex items-center gap-2 uppercase cursor-pointer px-2 ${showCustomDate ? "bg-cyan-500/15 text-cyan-300" : "text-zinc-500 hover:text-zinc-200"} transition-all duration-300`}
                    onClick={() => setShowCustomDate(!showCustomDate)}
                  >
                    custom
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="custom-picker"
                  className="w-[400px]"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{
                    type: "spring",
                    stiffness: 90,
                    damping: 15,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <motion.button
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      transition={{
                        delay: DATE_FILTERS.length * 0.04,
                      }}
                      onClick={() => setShowCustomDate(!showCustomDate)}
                      className={`flex items-center gap-2 uppercase cursor-pointer px-2 ${showCustomDate ? "text-(--accent-cyan)" : "hover:text-(--accent-cyan)"} transition-all duration-300`}
                    >
                      custom
                    </motion.button>
                    {showCustomDate && (
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 90,
                          damping: 15,
                          mass: 1,
                        }}
                        className="w-[400px]"
                      >
                        <Field className="mx-auto w-full">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                id="date-picker-range"
                                className="justify-center px-2.5 font-normal"
                              >
                                <CalendarIcon />
                                {customDate?.from ? (
                                  customDate.to ? (
                                    <>
                                      {format(customDate.from, "LLL dd, y")} -{" "}
                                      {format(customDate.to, "LLL dd, y")}
                                    </>
                                  ) : (
                                    format(customDate.from, "LLL dd, y")
                                  )
                                ) : (
                                  <span>Pick a customDate</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-full p-0"
                              align="center"
                            >
                              <Calendar
                                mode="range"
                                defaultMonth={customDate?.from}
                                selected={customDate}
                                onSelect={(range) => {
                                  setCustomDate(range);

                                  setFilters({
                                    datePreset: null,
                                    customDateRange: range ?? null,
                                  });
                                }}
                                numberOfMonths={2}
                              />
                            </PopoverContent>
                          </Popover>
                        </Field>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
