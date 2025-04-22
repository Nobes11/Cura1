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
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    z-index: 10;
    position: relative;
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
  const [patients, setPatients] = useState<Patient[]>(
    () => patientStore.patients
  );
  
  // Fetch patients on component mount with loading state handling
  useEffect(() => {
    // Set local loading state
    const fetchData = async () => {
      setIsLoading(true);
      setHasError(false);
      
      try {
        await patientStore.fetchPatients();
        // Successfully retrieved data - always use data from the store
        setPatients(patientStore.patients);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching patients:', error);
        // Use mock data as fallback if fetch fails
        setPatients(mockPatients);
        setIsLoading(false);
        setHasError(true);
      }
    };
    
    fetchData();
  }, []);
  
  // Memoize and update patients when store changes
  useEffect(() => {
    if (patientStore.patients.length > 0) {
      setPatients(patientStore.patients);
    }
  }, [patientStore.patients]);

  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState("");
  const [openLegend, setOpenLegend] = useState(false);
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [roomSortMode, setRoomSortMode] = useState<"standard" | "critical-first">("standard");
  const [previousSortConfig, setPreviousSortConfig] = useState<SortConfig | null>(null);
  const [isNameSortActive, setIsNameSortActive] = useState(false);

  // State for patient detail sheet
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [openPatientDetail, setOpenPatientDetail] = useState<Patient | null>(null);
  const [openPatientCharts, setOpenPatientCharts] = useState<Patient | null>(null);

  // Handle URL query params for patient charts
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const patientId = params.get('patientCharts');

    if (patientId) {
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        setOpenPatientCharts(patient);
      }
    } else {
      setOpenPatientCharts(null);
    }
  }, [location.search, patients]);

  // State for note dialogs
  const [noteDialog, setNoteDialog] = useState<{isOpen: boolean; patientId: string; noteType: "nurse" | "provider" | "comment"} | null>(null);

  // State for note history dialog
  const [noteHistoryDialog, setNoteHistoryDialog] = useState<{isOpen: boolean; patientId: string; noteType: "nurse" | "provider"} | null>(null);

  // State for provider/nurse assignment
  const [assignmentDialog, setAssignmentDialog] = useState<{
    isOpen: boolean;
    patientId: string;
    patientName: string;
    currentAssignment: string | null;
    assignmentType: "provider" | "nurse";
  } | null>(null);

  // State for room change dialog
  const [roomChangeDialog, setRoomChangeDialog] = useState<{
    isOpen: boolean;
    patientId: string;
    patientName: string;
    currentRoom: string;
  } | null>(null);

  // State for status update dialog
  const [statusUpdateDialog, setStatusUpdateDialog] = useState<{
    isOpen: boolean;
    patientId: string;
    patientName: string;
    currentStatus: "waiting" | "in-progress" | "discharge-ready" | "discharged";
  } | null>(null);

  // State for priority update dialog
  const [priorityDialog, setPriorityDialog] = useState<{
    isOpen: boolean;
    patientId: string;
    patientName: string;
    currentPriority: "low" | "medium" | "high" | "urgent";
  } | null>(null);

  // State for status update
  const [statusUpdatePatient, setStatusUpdatePatient] = useState<Patient | null>(null);

  // State for room change
  const [roomChangePatient, setRoomChangePatient] = useState<Patient | null>(null);
  const [newRoom, setNewRoom] = useState("");

  // State for protocol toggle dialog
  const [protocolDialog, setProtocolDialog] = useState<{
    isOpen: boolean;
    patientId: string;
    patientName: string;
    protocols: { id: string; label: string; active: boolean; }[];
  } | null>(null);

  // State for schedule view dialog
  const [scheduleViewOpen, setScheduleViewOpen] = useState(false);

  // State for tasks panel
  const [tasksDialogOpen, setTasksDialogOpen] = useState(false);
  
  // State for room management panel
  const [showRoomManagement, setShowRoomManagement] = useState(false);

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    room: true,
    time: true,
    priority: true,
    patient: true,
    chiefComplaint: true,
    status: true,
    provider: true,
    nurse: true
  });

  // Filter patients based on tab selection and search term
  const filteredPatients = useMemo(() => {
    // Start with all active patients (exclude discharged patients for tracking board)
    let filtered = patients.filter(patient => {
      // Only show patients on the tracking board (exclude Schedule patients unless they've been checked in)
      if (patient.room === 'Schedule' && patient.registrationStatus === 'pending') {
        return false;
      }
      
      // Filter discharged patients (this is the key difference from "all patients" view)
      if (selectedTab !== 'discharged' && patient.status === 'discharged') {
        return false;
      }
      
      // Show only discharged patients in discharged tab
      if (selectedTab === 'discharged' && patient.status !== 'discharged') {
        return false;
      }
      
      // Filter by triage status
      if (selectedTab === 'untriaged' && patient.triageStatus !== 'not-triaged') {
        return false;
      }
      
      if (selectedTab === 'in-triage' && patient.triageStatus !== 'in-triage') {
        return false;
      }
      
      // Search by patient name, chief complaint, or room
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          patient.name.toLowerCase().includes(searchLower) ||
          (patient.chiefComplaint && patient.chiefComplaint.toLowerCase().includes(searchLower)) ||
          patient.room.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });

    // Sort patients
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        // Special handling for complex keys
        if (sortConfig.key === 'name') {
          if (a.name < b.name) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (a.name > b.name) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        }
        
        // Handle other sortable columns
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }
    
    return filtered;
  }, [patients, selectedTab, searchTerm, sortConfig]);

  // Calculate counts for the filter tabs
  const counts = useMemo(() => {
    // All active patients (not discharged, not pending schedule)
    const activeCount = patients.filter(p => 
      p.status !== 'discharged' && 
      !(p.room === 'Schedule' && p.registrationStatus === 'pending')
    ).length;
    
    // Discharged patients
    const dischargedCount = patients.filter(p => p.status === 'discharged').length;
    
    // Patients needing triage
    const untriagedCount = patients.filter(p => 
      p.triageStatus === 'not-triaged' && 
      p.status !== 'discharged' && 
      !(p.room === 'Schedule' && p.registrationStatus === 'pending')
    ).length;
    
    // Patients in triage process
    const inTriageCount = patients.filter(p => 
      p.triageStatus === 'in-triage' && 
      p.status !== 'discharged'
    ).length;
    
    return {
      active: activeCount,
      discharged: dischargedCount,
      untriaged: untriagedCount,
      inTriage: inTriageCount
    };
  }, [patients]);

  // Function to render the triage status indicator
  const renderTriageStatus = (patient: Patient) => {
    if (patient.triageStatus === 'not-triaged') {
      return (
        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800">
          Not Triaged
        </span>
      );
    } else if (patient.triageStatus === 'in-triage') {
      return (
        <div className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          In Triage
        </div>
      );
    }
    return null;
  };

  return (
    <div className="relative space-y-4 p-4">
      {/* Top controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Input
            className="w-64"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>Clear</Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setOpenLegend(true)}
            className="flex items-center gap-1"
          >
            <Info className="h-4 w-4" />
            Legend
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setScheduleViewOpen(true)}
            className="flex items-center gap-1"
          >
            <CalendarIcon className="h-4 w-4" />
            Schedule
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ListPlus className="h-4 w-4" />
                Add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem onClick={() => navigate('/patient/add')}>New Patient</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem onClick={() => navigate('/procedure')}>New Procedure</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem onClick={() => alert('Feature coming soon!')}>Add Task</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTasksDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <ClipboardList className="h-4 w-4" />
            Tasks
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRoomManagement(true)}
            className="flex items-center gap-1"
          >
            Rooms
          </Button>
        </div>
      </div>
      
      {/* Filter tabs */}
      <div className="border-b border-gray-200">
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all" className="flex items-center justify-center">
              All <Badge variant="secondary" className="ml-2">{counts.active}</Badge>
            </TabsTrigger>
            <TabsTrigger value="untriaged" className="flex items-center justify-center">
              Needs Triage <Badge variant="secondary" className="ml-2">{counts.untriaged}</Badge>
            </TabsTrigger>
            <TabsTrigger value="in-triage" className="flex items-center justify-center">
              In Triage <Badge variant="secondary" className="ml-2">{counts.inTriage}</Badge>
            </TabsTrigger>
            <TabsTrigger value="discharged" className="flex items-center justify-center">
              Discharged <Badge variant="secondary" className="ml-2">{counts.discharged}</Badge>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center justify-center">
              Reports
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Patient table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columnVisibility.room && (
                <TableHead className="w-24">
                  <span className="flex items-center cursor-pointer" onClick={() => {
                    setSortConfig({
                      key: 'room',
                      direction: sortConfig.key === 'room' && sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
                    });
                  }}>
                    Room
                    {sortConfig.key === 'room' && (
                      sortConfig.direction === 'ascending' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </span>
                </TableHead>
              )}
              {columnVisibility.time && (
                <TableHead className="w-24">
                  <span className="flex items-center cursor-pointer" onClick={() => {
                    setSortConfig({
                      key: 'arrivalTime',
                      direction: sortConfig.key === 'arrivalTime' && sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
                    });
                  }}>
                    Time
                    {sortConfig.key === 'arrivalTime' && (
                      sortConfig.direction === 'ascending' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </span>
                </TableHead>
              )}
              {columnVisibility.priority && (
                <TableHead className="w-28">
                  <span className="flex items-center cursor-pointer" onClick={() => {
                    setSortConfig({
                      key: 'priority',
                      direction: sortConfig.key === 'priority' && sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
                    });
                  }}>
                    Priority
                    {sortConfig.key === 'priority' && (
                      sortConfig.direction === 'ascending' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </span>
                </TableHead>
              )}
              {columnVisibility.patient && (
                <TableHead>
                  <span className="flex items-center cursor-pointer" onClick={() => {
                    setSortConfig({
                      key: 'name',
                      direction: sortConfig.key === 'name' && sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
                    });
                  }}>
                    Patient
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'ascending' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </span>
                </TableHead>
              )}
              {columnVisibility.chiefComplaint && (
                <TableHead className="min-w-[250px]">
                  Chief Complaint / Triage
                </TableHead>
              )}
              {columnVisibility.status && (
                <TableHead className="w-28">
                  <span className="flex items-center cursor-pointer" onClick={() => {
                    setSortConfig({
                      key: 'status',
                      direction: sortConfig.key === 'status' && sortConfig.direction === 'ascending' ? 'descending' : 'ascending'
                    });
                  }}>
                    Status
                    {sortConfig.key === 'status' && (
                      sortConfig.direction === 'ascending' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </span>
                </TableHead>
              )}
              {columnVisibility.provider && (
                <TableHead className="w-36">Provider</TableHead>
              )}
              {columnVisibility.nurse && (
                <TableHead className="w-36">Nurse</TableHead>
              )}
              <TableHead className="w-7">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Pill className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Medication Status</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead className="w-14">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <MessageSquare className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Comments</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-sm text-muted-foreground">Loading patients...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <p className="text-muted-foreground">No patients found</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredPatients.map((patient) => (
                <TableRow key={patient.id} className="relative hover:bg-slate-50">
                  {columnVisibility.room && (
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {patient.room}
                        {renderTriageStatus(patient)}
                        {patient.priority === "urgent" && (
                          <span className="ml-2 inline-block h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {columnVisibility.time && (
                    <TableCell className="text-sm">
                      {patient.arrivalTime ? new Date(patient.arrivalTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--'}
                    </TableCell>
                  )}
                  {columnVisibility.priority && (
                    <TableCell>
                      <div className="flex items-center">
                        <div className="flex items-center gap-1">
                          <PriorityBadge priority={patient.priority || 'medium'} />
                          {patient.priority === "urgent" && patient.isStroke && (
                            <span className="text-xs font-bold text-red-600 animate-pulse">STROKE</span>
                          )}
                          {patient.priority === "urgent" && patient.isSepsis && (
                            <span className="text-xs font-bold text-red-600 animate-pulse">SEPSIS</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  )}
                  {columnVisibility.patient && (
                    <TableCell>
                      <div className="hover:cursor-pointer font-medium" onClick={() => {
                        setSelectedPatient(patient);
                        setOpenPatientDetail(patient);
                      }}>
                        <div className="flex items-center gap-1">
                          <span>{patient.name}</span>
                          {patient.isFallRisk && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <span className="bg-amber-500 text-white text-xs px-1 py-0.5 rounded-sm">FALL</span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Fall Risk</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">
                          {patient.age} {patient.gender}, MRN: {patient.mrn || 'Unknown'}
                        </div>
                      </div>
                    </TableCell>
                  )}
                  {columnVisibility.chiefComplaint && (
                    <TableCell>
                      {patient.triageStatus === 'triaged' ? (
                        <div>
                          <div className="font-medium">{patient.chiefComplaint}</div>
                          {patient.triageImpression && (
                            <div className="text-xs text-slate-500">{patient.triageImpression}</div>
                          )}
                          {patient.triageData?.vitals && (
                            <div className="text-xs flex flex-wrap gap-x-4 gap-y-1 mt-1">
                              {patient.triageData.vitals.temperature && (
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">Temp:</span> {patient.triageData.vitals.temperature}°F
                                </span>
                              )}
                              {patient.triageData.vitals.heartRate && (
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">HR:</span> {patient.triageData.vitals.heartRate}
                                </span>
                              )}
                              {patient.triageData.vitals.respiratoryRate && (
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">RR:</span> {patient.triageData.vitals.respiratoryRate}
                                </span>
                              )}
                              {patient.triageData.vitals.bloodPressure && (
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">BP:</span> {patient.triageData.vitals.bloodPressure}
                                </span>
                              )}
                              {patient.triageData.vitals.oxygenSaturation && (
                                <span className="flex items-center gap-1">
                                  <span className="font-medium">O2:</span> {patient.triageData.vitals.oxygenSaturation}%
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {patient.chiefComplaint || 'No chief complaint'}
                        </div>
                      )}
                    </TableCell>
                  )}
                  {columnVisibility.status && (
                    <TableCell>
                      <StatusBadge status={patient.status} holdStatus={patient.holdStatus} consulted={patient.consulted} />
                    </TableCell>
                  )}
                  {columnVisibility.provider && (
                    <TableCell className="relative">
                      {renderStyledName(patient.assignedProvider) || (
                        <span className="cursor-pointer text-sky-600 hover:underline" onClick={() => {
                          setAssignmentDialog({
                            isOpen: true,
                            patientId: patient.id,
                            patientName: patient.name,
                            currentAssignment: patient.assignedProvider,
                            assignmentType: "provider"
                          });
                        }}>Assign</span>
                      )}
                    </TableCell>
                  )}
                  {columnVisibility.nurse && (
                    <TableCell className="relative">
                      {renderStyledName(patient.assignedNurse) || (
                        <span className="cursor-pointer text-sky-600 hover:underline" onClick={() => {
                          setAssignmentDialog({
                            isOpen: true,
                            patientId: patient.id,
                            patientName: patient.name,
                            currentAssignment: patient.assignedNurse,
                            assignmentType: "nurse"
                          });
                        }}>Assign</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <MedicationStatusIndicator patient={patient} onAdminister={() => {
                      // Handle administration logic
                      toast.success(`Medication administered for ${patient.name}`);
                    }} />
                  </TableCell>
                  <TableCell>
                      {/* Comment box implementation */}
                      <div className="comment-box bg-gray-100 rounded-md p-1 cursor-pointer" onClick={() => {
                        setNoteDialog({
                          isOpen: true,
                          patientId: patient.id,
                          noteType: "comment"
                        });
                      }}>
                        {patient.comments && patient.comments.length > 0 ? (
                          <div className="max-h-24 overflow-y-auto">
                            {patient.comments.map((comment, index) => (
                              <div key={index} className="comment-item text-xs p-1">
                                <div className="font-medium text-blue-600">{comment.author}</div>
                                <div className="break-words">{comment.text}</div>
                                <div className="text-[10px] text-gray-500">
                                  {new Date(comment.timestamp).toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500 text-center p-1">+</div>
                        )}
                      </div>
                    </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/PatientChart?patientId=${patient.id}`)}>
                      <FileText className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Patient detail side panel */}
      {openPatientDetail && (
        <Sheet open={!!openPatientDetail} onOpenChange={() => setOpenPatientDetail(null)}>
          <SheetContent className="w-[400px] sm:w-[540px] p-0 overflow-auto">
            <PatientDetail patient={openPatientDetail} onClose={() => setOpenPatientDetail(null)} />
          </SheetContent>
        </Sheet>
      )}
      
      {/* Patient charts side panel */}
      {openPatientCharts && (
        <Sheet open={!!openPatientCharts} onOpenChange={() => {
          setOpenPatientCharts(null);
          navigate(location.pathname);
        }}>
          <SheetContent className="w-[90vw] max-w-[1000px] p-0 overflow-auto">
            <PatientCharts patient={openPatientCharts} onClose={() => {
              setOpenPatientCharts(null);
              navigate(location.pathname);
            }} />
          </SheetContent>
        </Sheet>
      )}
      
      {/* Dialogs and Modals */}
      <LegendModal open={openLegend} onOpenChange={setOpenLegend} />
      <ScheduleViewDialog isOpen={scheduleViewOpen} onClose={() => setScheduleViewOpen(false)} />
      <TasksPanel isOpen={tasksDialogOpen} onClose={() => setTasksDialogOpen(false)} patients={patients} />
      
      {/* Note/Comment dialog */}
      {noteDialog && (
        <AddNoteDialog
          isOpen={noteDialog.isOpen}
          patientName={patients.find(p => p.id === noteDialog.patientId)?.name || ''}
          noteType={noteDialog.noteType}
          onClose={() => setNoteDialog(null)}
          onSave={(note) => {
            // Get current patient and add comment
            const patientStore = usePatientStore.getState();
            const patient = patients.find(p => p.id === noteDialog.patientId);
            
            if (patient) {
              const comments = patient.comments || [];
              comments.push({
                text: note,
                author: 'You', // Replace with actual user name when available
                timestamp: new Date().toISOString()
              });
              
              patientStore.updatePatient(noteDialog.patientId, { comments });
              toast.success("Comment added successfully");
            }
            
            setNoteDialog(null);
          }}
        />
      )}
      
      {assignmentDialog && (
        <AssignProviderModal
          isOpen={assignmentDialog.isOpen}
          patientId={assignmentDialog.patientId}
          patientName={assignmentDialog.patientName}
          currentProvider={assignmentDialog.currentAssignment}
          assignmentType={assignmentDialog.assignmentType}
          onClose={() => setAssignmentDialog(null)}
          onSave={(provider) => {
            const patientUpdate = assignmentDialog.assignmentType === "provider" ? 
              { assignedProvider: provider } : 
              { assignedNurse: provider };
              
            const patientStore = usePatientStore.getState();
            patientStore.updatePatient(assignmentDialog.patientId, patientUpdate);
            setAssignmentDialog(null);
          }}
        />
      )}
    </div>
  );
};

export default PatientTrackingBoard;