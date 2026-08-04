import {
  FiltersType,
  useTransactionsFiltersStore,
} from "@/lib/store/useTransactionsFiltersStore";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
export type FilterProps = {
  openFilters: "type" | "category" | "date" | null;
  setOpenFilters: (openFilters: "type" | "category" | "date" | null) => void;
};

const TYPE_OPTIONS = ["All", "Income", "Expense"];

export default function TypeFilter({
  openFilters,
  setOpenFilters,
}: FilterProps) {
  const { filters, setFilters } = useTransactionsFiltersStore();
  const t = useTranslations("transactions");
  return (
    <motion.div
      layout="position"
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 28,
      }}
      className="flex flex-col md:flex-row items-center gap-2"
    >
      <button
        className={`h-10 px-4 flex items-center gap-2 text-xl border-r-2 transition-colors duration-200 ${
          openFilters === "type" ? "border-zinc-500" : "border-transparent"
        }`}
        onClick={() =>
          openFilters === "type" ? setOpenFilters(null) : setOpenFilters("type")
        }
      >
        {t("type")}{" "}
        {filters.type ? (
          <span className="text-cyan-300 bg-cyan-500/15 uppercase">
            {filters.type}
          </span>
        ) : null}
      </button>

      <AnimatePresence mode="popLayout">
        {openFilters === "type" && (
          <motion.div
            key="type-options"
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 90, damping: 15 }}
          >
            {TYPE_OPTIONS.map((option) => (
              <button
                key={option}
                className={`flex items-center gap-2 uppercase cursor-pointer px-2 ${filters.type === option.toLowerCase() ? "bg-cyan-500/15 text-cyan-300" : "text-zinc-500 hover:text-zinc-200"} transition-all duration-300`}
                onClick={() =>
                  setFilters({
                    type:
                      option === "All"
                        ? null
                        : (option.toLowerCase() as FiltersType),
                  })
                }
              >
                {option}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
