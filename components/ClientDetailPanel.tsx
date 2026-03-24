import { Client, Project } from "@/types/types";
import { Mail } from "lucide-react";
import { getStatusColor, getStatusTextColor } from "@/utils/getStatusColor";
import { formatMoney } from "@/utils/formatMoney";

export function ClientDetailPanel({
  client,
  clientProjects,
  onMouseEnter,
  onMouseLeave,
}: {
  client: Client;
  clientProjects: Project[];
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      className="absolute left-full top-0 ml-0.5 w-72 background-elevated border background-border rounded-lg shadow-xl shadow-black/50 z-50 overflow-hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="px-4 py-3 border-b background-border">
        <h3 className="text-base font-bold text-primary">
          {client.firstName} {client.lastName}
        </h3>
        <div className="flex items-center gap-1.5 mt-1">
          <Mail size={11} className="primary-slate" />
          <span className="text-xs primary-slate">{client.email}</span>
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${getStatusColor(client.status)}`}
            />
            <span
              className={`text-sm font-semibold capitalize ${getStatusTextColor(client.status)}`}
            >
              {client.status}
            </span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-(--bg-elevated) border background-border text-primary font-semibold">
            {client.currency}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-(--bg-elevated) rounded-md p-2.5 border background-border">
            <span className="text-[10px] primary-slate uppercase font-semibold block mb-1">
              Projects
            </span>
            <p className="text-lg font-bold primary-cyan">
              {clientProjects.length}
            </p>
          </div>
          <div className="bg-(--bg-elevated) rounded-md p-2.5 border background-border">
            <span className="text-[10px] primary-slate uppercase font-semibold block mb-1">
              Since
            </span>
            <p className="text-sm font-bold text-primary">
              {new Date(client.startDate).toLocaleDateString(undefined, {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {clientProjects.length > 0 && (
          <div>
            <span className="text-[10px] primary-slate uppercase font-semibold block mb-1.5">
              Their Projects
            </span>
            <div className="space-y-1.5">
              {clientProjects.slice(0, 4).map((p) => (
                <div key={p.id} className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusColor(p.status)}`}
                  />
                  <span className="text-primary truncate flex-1">{p.name}</span>
                  <span className="primary-green font-semibold shrink-0">
                    {formatMoney(p.totalRevenue)}
                  </span>
                </div>
              ))}
              {clientProjects.length > 4 && (
                <p className="text-[10px] primary-slate">
                  +{clientProjects.length - 4} more
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between text-[10px] primary-slate pt-1 border-t background-border">
          <span>Start: {new Date(client.startDate).toLocaleDateString()}</span>
          {client.endDate && (
            <span>End: {new Date(client.endDate).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}
