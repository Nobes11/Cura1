import React from "react";
import { Badge } from "@/components/ui/badge";

export interface PriorityBadgeProps {
  priority: "low" | "medium" | "high" | "urgent";
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityConfig = () => {
    switch (priority) {
      case "low":
        return { label: "Low", variant: "outline" as const, className: "bg-[#3CAEA3]/70 text-white border-[#3CAEA3]" };
      case "medium":
        return { label: "Medium", variant: "outline" as const, className: "bg-[#F6D55C] text-[#173F5F] border-[#F6D55C]" };
      case "high":
        return { label: "High", variant: "outline" as const, className: "bg-[#20659B] text-white border-[#20659B]" };
      case "urgent":
        return { label: "Urgent", variant: "outline" as const, className: "animate-pulse bg-[#ED553B] text-white border-[#ED553B]" };
      default:
        return { label: priority, variant: "outline" as const, className: "" };
    }
  };

  const { label, variant, className } = getPriorityConfig();

  return (
    <Badge variant={variant} className={className}>
      {priority === "urgent" && (
        <span className="relative mr-1 inline-flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
      )}
      {label}
    </Badge>
  );
};
