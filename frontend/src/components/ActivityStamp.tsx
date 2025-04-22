import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getCurrentUserInitials, createActivityStamp } from "../utils/auth";

interface Props {
  actionType?: 'viewed' | 'modified' | 'ordered' | 'custom';
  customAction?: string;
  timestamp?: string; // Use this for pre-existing stamps
}

/**
 * Displays a user activity stamp with initials, date, and time
 * Creates a new timestamp if one isn't provided
 */
export const ActivityStamp: React.FC<Props> = ({
  actionType = 'viewed',
  customAction,
  timestamp
}) => {
  // Either use provided timestamp or create a new one
  const stamp = timestamp || createActivityStamp();
  const initials = getCurrentUserInitials();
  
  // Determine action verb
  const getActionText = () => {
    if (customAction) return customAction;
    
    switch(actionType) {
      case 'viewed': return 'Viewed by';
      case 'modified': return 'Modified by';
      case 'ordered': return 'Ordered by';
      default: return 'Action by';
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
            <span className="font-semibold">{initials}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            {getActionText()} <strong>{initials}</strong>
            <br />
            <span className="text-xs">{stamp}</span>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
