import { Project } from "@/types/types";
import { getStatusColor, getStatusTextColor } from "@/utils/getStatusColor";
import { DollarSign, TrendingUp, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

export function ProjectDetailPanel({
  project,
  onMouseEnter,
  onMouseLeave,
}: {
  project: Project;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const t = useTranslations("projects");

  return (
    <div
      className="absolute left-full top-0 w-80 background-elevated border-r background-border rounded-r-lg shadow-xl shadow-black/50 z-50 overflow-hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="px-4 py-3 border-b background-border">
        <h3 className="text-base font-bold text-primary">{project.name}</h3>
        <p className="text-xs primary-slate mt-0.5">{project.clientName}</p>
      </div>

      <div className="px-4 py-3 space-y-3">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${getStatusColor(project.status)}`}
          />
          <span
            className={`text-sm font-semibold capitalize ${getStatusTextColor(project.status)}`}
          >
            {project.status.replace("_", " ")}
          </span>
        </div>

        {project.description && (
          <p className="text-xs primary-slate leading-relaxed line-clamp-3">
            {project.description}
          </p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-(--bg-elevated) rounded-md p-2.5 border background-border">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign size={12} className="primary-green" />
              <span className="text-[10px] primary-slate uppercase font-semibold">
                {t("detailRevenue")}
              </span>
            </div>
            <p className="text-sm font-bold primary-green">
              ${project.totalRevenue || "0"}
            </p>
          </div>
          <div className="bg-(--bg-elevated) rounded-md p-2.5 border background-border">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign size={12} className="primary-red" />
              <span className="text-[10px] primary-slate uppercase font-semibold">
                {t("detailExpenses")}
              </span>
            </div>
            <p className="text-sm font-bold primary-red">
              ${project.totalExpenses || "0"}
            </p>
          </div>
          <div className="bg-(--bg-elevated) rounded-md p-2.5 border background-border">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={12} className="primary-cyan" />
              <span className="text-[10px] primary-slate uppercase font-semibold">
                {t("detailProfit")}
              </span>
            </div>
            <p className="text-sm font-bold primary-cyan">
              ${project.totalProfit || "0"}
            </p>
          </div>
          <div className="bg-(--bg-elevated) rounded-md p-2.5 border background-border">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock size={12} className="primary-purple" />
              <span className="text-[10px] primary-slate uppercase font-semibold">
                {t("detailHours")}
              </span>
            </div>
            <p className="text-sm font-bold primary-purple">
              {project.totalHoursWorked || 0}h
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] primary-slate uppercase font-semibold">
              {t("detailProfitMargin")}
            </span>
            <span className="text-xs primary-cyan font-bold">
              {project.totalMargin || "0"}%
            </span>
          </div>
          <div className="h-1.5 bg-[#27272a] rounded-full overflow-hidden">
            <div
              className="h-full bg-(--accent-cyan) rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.max(0, Number(project.totalMargin || 0)))}%`,
              }}
            />
          </div>
        </div>

        <div className="flex justify-between text-[10px] primary-slate pt-1 border-t background-border">
          <span>
            {t("detailCreated")} {new Date(project.createdAt).toLocaleDateString()}
          </span>
          <span>
            {t("detailUpdated")} {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}
