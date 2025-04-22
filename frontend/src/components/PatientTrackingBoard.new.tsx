import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Patient, mockPatients, RoomType, roomStatuses, RoomStatus } from "../utils/mockData";
import { usePatientStore } from "../utils/patientStore";
import { MedicationStatusIndicator } from "./MedicationStatusIndicator";
import * as mockData from "../utils/mockData";
import { PatientDetail } from "./PatientDetail";
import { PatientCharts } from "./PatientCharts";
import { RoomChangeDialog } from "./RoomChangeDialog";
import { StatusUpdateDialog } from "./StatusUpdateDialog";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { RoomStatusPanel } from "./RoomStatusPanel";
import { ProtocolToggleDialog } from "./ProtocolToggleDialog";
import { PriorityDialog } from "./PriorityDialog";
import { ScheduleViewDialog } from "./ScheduleViewDialog";
import { DischargePatientDialog } from "./DischargePatientDialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronUp, FileText, ClipboardList, ArrowUpDown, Info, ListPlus, BellRing, MessageSquare, Pill, Calendar as CalendarIcon, History, FlaskConical, Syringe, Droplet } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { LegendModal } from "./LegendModal";
import { AddNoteDialog } from "./AddNoteDialog";
import { AssignProviderModal } from "./AssignProviderModal";
import { ChiefComplaintDialog } from "./ChiefComplaintDialog";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TasksPanel } from "./TasksPanel";

// CSS for auto-expanding comment boxes
const commentBoxStyles = `
  .comment-box {
    min-height: 48px;
    height: auto;
    max-height: 96px;
    width: 48px;
    transition: all 0.2s ease-in-out;
    overflow-y: auto;
    border: none !important;
  }
  .comment-box:hover {
    max-height: 200px;
    width: auto;
    min-width: 48px;
  }
  .comment-box .comment-item {
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 4px;
    margin-bottom: 4px;
  }
  .comment-box .comment-item:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

// Helper function to render styled provider/nurse names
const renderStyledName = (name: string | null) => {
  if (!name) return null;
  
  // Check if it's a styled name with our format: "|style|{...}|name|"
  if (name.startsWith('|style|') && name.includes('|name|')) {
    try {
      const styleStr = name.split('|name|')[0].replace('|style|', '');
      const actualName = name.split('|name|')[1];
      const styleObj = JSON.parse(styleStr);
      
      return (
        <span style={{
          color: styleObj.color || 'inherit',
          fontFamily: styleObj.fontFamily || 'inherit',
          fontWeight: styleObj.fontWeight || 'inherit',
          fontStyle: styleObj.fontStyle || 'inherit'
        }}>
          {actualName}
        </span>
      );
    } catch (e) {
      console.error('Error parsing styled name:', e);
      return name; // Fallback to the raw string if parsing fails
    }
  }
  
  return name;
};

interface SortConfig {
  key: keyof Patient | null;
  direction: 'ascending' | 'descending';
}

const PatientTrackingBoard = () => {
  // Add the styles to the DOM
  useEffect(() => {
    // Add the style element to the document head
    const styleElement = document.createElement('style');
    styleElement.innerHTML = commentBoxStyles;
    document.head.appendChild(styleElement);
    
    // Clean up the style element on unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Track loading state for skeleton UI
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  // Reference for context menu
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  // Get patients from store, fallback to mock data if empty
  const patientStore = usePatientStore();
  // Combine store patients with mock data for initial state
  // Initialize with existing data or mock data, wrapped in useMemo to prevent unnecessary rerenders
  
  // The rest of the component code...
  return <div>Placeholder - Component Being Fixed</div>;
};

export default PatientTrackingBoard;