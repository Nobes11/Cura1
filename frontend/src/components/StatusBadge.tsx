import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "../utils/cn";
import { ChevronRight } from "lucide-react";

export interface StatusBadgeProps {
  holdStatus?: boolean;
  consulted?: boolean;
  status: "waiting" | "in-progress" | "discharge-ready" | "discharged";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, holdStatus, consulted }) => {
  const getStatusConfig = () => {
    // Using the hospital theme colors with updated waiting color
    const customClasses = {
      waiting: "bg-[#F6AB13] text-white border-[#F6AB13]",
      "in-progress": "bg-[#3d8bb9] text-white border-[#3d8bb9]", /* Changed from #c1632f to #3d8bb9 (blue) */
      "discharge-ready": "bg-[#5f8575] text-white border-[#5f8575]",
      discharged: "bg-[#f5e6c8] text-[#5f8575] border-[#5f8575] border"
    };
    switch (status) {
      case "waiting":
        return { label: "Waiting", variant: "secondary" as const, className: customClasses.waiting };
      case "in-progress":
        return { label: "In Progress", variant: "default" as const, className: customClasses["in-progress"] };
      case "discharge-ready":
        return { label: "Ready for Discharge", variant: "success" as const, className: customClasses["discharge-ready"] };
      case "discharged":
        return { label: "Discharged", variant: "outline" as const, className: customClasses.discharged };
      default:
        return { label: status, variant: "default" as const, className: "" };
    }
  };

  const { label, variant, className } = getStatusConfig();
  
  // Create status badge element
  const statusBadge = (
    <Badge
      variant={variant}
      className={cn(
        className,
        {
          "animate-pulse": status === "discharge-ready" // Only discharge-ready status blinks
        },
      )}
    >
      <span className="flex items-center">
        {label}
        {holdStatus && status === "in-progress" && (
          <span className="ml-1 bg-red-600 text-white text-xs px-1 rounded-sm flex items-center shadow-sm" title="Patient on hold">
            <span className="mr-0.5 font-bold tracking-tight">HOLD</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM9 7.5A.75.75 0 0 0 9 9h1.5c.398 0 .75.352.75.75S10.898 11.5 10.5 11.5H9a.75.75 0 0 0 0 1.5h1.5c.398 0 .75.352.75.75s-.352.75-.75.75H9a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5h-3.75a.75.75 0 0 1-.75-.75c0-.398.352-.75.75-.75H15a.75.75 0 0 0 0-1.5h-3.75a.75.75 0 0 1-.75-.75c0-.398.352-.75.75-.75H15a.75.75 0 0 0 0-1.5H9Z" clipRule="evenodd" />
            </svg>
          </span>
        )}
        {consulted && (
          <span className="ml-1 bg-blue-600 text-white text-xs px-1 rounded-sm flex items-center shadow-sm" title="Patient consulted">
            <span className="mr-0.5 font-bold tracking-tight">CONSULT</span>
          </span>
        )}
      </span>
    </Badge>
  );
  
  // If patient is consulted, show consulted badge
  if (consulted) {
    return (
      <div className="flex items-center gap-1 font-medium">
        <Badge variant="secondary" className="bg-blue-100 hover:bg-blue-100 text-blue-800 border border-blue-300 min-w-20 justify-center">
          Consult
        </Badge>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        {holdStatus ? (
          <div className="flex items-center gap-1 font-medium">
            <Badge variant="secondary" className="bg-amber-100 hover:bg-amber-100 text-amber-800 border border-amber-300 min-w-20 justify-center">
              On Hold
            </Badge>
            <ChevronRight className="h-3 w-3 text-slate-400" />
            {statusBadge}
          </div>
        ) : statusBadge}
      </div>
    );
  }
  
  // If patient is on hold, show the hold badge
  if (holdStatus) {
    return (
      <div className="flex items-center gap-1 font-medium">
        <Badge variant="secondary" className="bg-amber-100 hover:bg-amber-100 text-amber-800 border border-amber-300 min-w-20 justify-center">
          On Hold
        </Badge>
        <ChevronRight className="h-3 w-3 text-slate-400" />
        {statusBadge}
      </div>
    );
  }
  
  // Simple status badge if no special conditions
  return statusBadge;
};