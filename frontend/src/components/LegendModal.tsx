import React, { useMemo } from "react";
import { mockPatients } from "../utils/mockData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";

export const LegendModal: React.FC = () => {
  // Calculate bed occupancy
  const bedCounts = useMemo(() => {
    const counts = {
      standard: { total: 10, occupied: 0, holding: 0 },
      trauma: { total: 2, occupied: 0, holding: 0 },
      critical: { total: 2, occupied: 0, holding: 0 },
      psych: { total: 2, occupied: 0, holding: 0 },
      lobby: { total: 0, occupied: 0 }
    };
    
    mockPatients.forEach(patient => {
      if (patient.room === "Lobby") {
        counts.lobby.occupied++;
      } else if (patient.room.startsWith("T-")) {
        counts.trauma.occupied++;
        if (patient.holdStatus) counts.trauma.holding++;
      } else if (patient.room.startsWith("C-")) {
        counts.critical.occupied++;
        if (patient.holdStatus) counts.critical.holding++;
      } else if (patient.room.startsWith("P-")) {
        counts.psych.occupied++;
        if (patient.holdStatus) counts.psych.holding++;
      } else if (patient.room.startsWith("Room")) {
        counts.standard.occupied++;
        if (patient.holdStatus) counts.standard.holding++;
      }
    });
    
    return counts;
  }, []);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 bg-white">
          <HelpCircle className="h-4 w-4" />
          Legend
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#173F5F]">ED Track Board Legend</DialogTitle>
          <DialogDescription className="text-[#173F5F]/80">
            This legend explains the different elements and icons used in the Track Board.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-md border-2 border-[#20659B]/30 shadow-sm">
            <h3 className="text-lg font-medium mb-3 text-[#173F5F] border-b border-[#20659B]/30 pb-2">ED Bed Occupancy</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex flex-col p-3 border border-[#20659B] rounded-md bg-[#20659B]/20 shadow-sm">
                <p className="font-medium text-[#173F5F]">Regular Rooms</p>
                <p className="text-2xl font-bold text-[#173F5F]">
                  {bedCounts.standard.occupied}/{bedCounts.standard.total}
                  <span className="text-sm font-normal ml-2 text-[#ED553B]">
                    {bedCounts.standard.holding > 0 ? `(${bedCounts.standard.holding} holding)` : ''}
                  </span>
                </p>
                <p className="text-xs text-[#173F5F] mt-1">{bedCounts.standard.total - bedCounts.standard.occupied} beds available</p>
              </div>
              
              <div className="flex flex-col p-3 border border-[#ED553B] rounded-md bg-[#ED553B]/20 shadow-sm">
                <p className="font-medium text-[#173F5F]">Trauma/Critical</p>
                <p className="text-2xl font-bold text-[#173F5F]">
                  {bedCounts.trauma.occupied + bedCounts.critical.occupied}/{bedCounts.trauma.total + bedCounts.critical.total}
                  <span className="text-sm font-normal ml-2 text-[#ED553B]">
                    {(bedCounts.trauma.holding + bedCounts.critical.holding) > 0 ? 
                      `(${bedCounts.trauma.holding + bedCounts.critical.holding} holding)` : ''}
                  </span>
                </p>
                <p className="text-xs text-[#173F5F] mt-1">{(bedCounts.trauma.total + bedCounts.critical.total) - (bedCounts.trauma.occupied + bedCounts.critical.occupied)} beds available</p>
              </div>
              
              <div className="flex flex-col p-3 border border-[#3CAEA3] rounded-md bg-[#3CAEA3]/20 shadow-sm">
                <p className="font-medium text-[#173F5F]">Psychiatric</p>
                <p className="text-2xl font-bold text-[#173F5F]">
                  {bedCounts.psych.occupied}/{bedCounts.psych.total}
                  <span className="text-sm font-normal ml-2 text-[#ED553B]">
                    {bedCounts.psych.holding > 0 ? `(${bedCounts.psych.holding} holding)` : ''}
                  </span>
                </p>
                <p className="text-xs text-[#173F5F] mt-1">{bedCounts.psych.total - bedCounts.psych.occupied} beds available</p>
              </div>
              
              <div className="flex flex-col p-3 border border-[#F6D55C] rounded-md bg-[#F6D55C]/30 shadow-sm">
                <p className="font-medium text-[#173F5F]">Lobby</p>
                <p className="text-2xl font-bold text-[#173F5F]">{bedCounts.lobby.occupied}</p>
                <p className="text-xs text-[#173F5F] mt-1">Waiting to be placed</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-md border-2 border-[#20659B]/30 shadow-sm">
            <h3 className="text-lg font-medium mb-3 text-[#173F5F] border-b border-[#20659B]/30 pb-2">Clinical Protocols</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2 p-2 border border-red-300 rounded-md bg-red-100 shadow-sm">
                <span className="inline-flex items-center justify-center h-6 w-auto px-1.5 rounded bg-red-100 text-red-700 font-bold text-xs">
                  Stroke Protocol
                </span>
                <div>
                  <p className="font-medium text-red-800">Stroke Protocol</p>
                  <p className="text-xs text-slate-600">Time-sensitive protocols for stroke patients</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 border border-purple-300 rounded-md bg-purple-100 shadow-sm">
                <span className="inline-flex items-center justify-center h-6 w-auto px-1.5 rounded bg-purple-100 text-purple-700 font-bold text-xs">
                  Sepsis Protocol
                </span>
                <div>
                  <p className="font-medium text-purple-800">Sepsis Protocol</p>
                  <p className="text-xs text-slate-600">Early intervention for sepsis patients</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 border border-amber-300 rounded-md bg-amber-100 shadow-sm">
                <span className="inline-flex items-center justify-center h-6 w-auto px-1.5 rounded bg-amber-100 text-amber-700 font-bold text-xs">
                  Fall Risk Protocol
                </span>
                <div>
                  <p className="font-medium text-amber-800">Fall Risk Protocol</p>
                  <p className="text-xs text-slate-600">Patient requires fall precautions</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-2 border border-orange-300 rounded-md bg-orange-100 shadow-sm">
                <span className="inline-flex items-center justify-center h-6 w-auto px-1.5 rounded bg-orange-100 text-orange-700 font-bold text-xs">
                  Code STEMI
                </span>
                <div>
                  <p className="font-medium text-orange-800">Code STEMI</p>
                  <p className="text-xs text-slate-600">Cardiac emergency protocol</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-md border-2 border-[#20659B]/30 shadow-sm">
            <h3 className="text-lg font-medium mb-3 text-[#173F5F] border-b border-[#20659B]/30 pb-2">Patient Status</h3>
            <Table className="border border-gray-200 rounded-md overflow-hidden">
              <TableHeader className="bg-[#173F5F]/5">
                <TableRow>
                  <TableHead className="font-semibold text-[#173F5F]">Status</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><StatusBadge status="waiting" /></TableCell>
                  <TableCell>Patient is waiting to be seen</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <StatusBadge status="in-progress" />
                      <StatusBadge status="in-progress" holdStatus={true} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <span>Patient is currently being seen</span>
                      <div className="mt-1 p-1 border border-[#F6D55C] bg-[#F6D55C]/20 rounded-md">
                        <span className="text-sm font-medium flex items-center text-[#173F5F]">
                          <span className="bg-[#ED553B] text-white text-xs px-1 rounded-sm mr-1">HOLD</span>
                          <span>Holding Status:</span>
                          <span className="ml-1 text-[#173F5F] font-normal">Patient waiting for bed placement or admission</span>
                        </span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><StatusBadge status="discharge-ready" /></TableCell>
                  <TableCell>Patient is ready to be discharged</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><StatusBadge status="discharged" /></TableCell>
                  <TableCell>Patient has been discharged</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="bg-[#ED553B]/10 border border-[#ED553B]/30 rounded text-[#173F5F]">Red Background</TableCell>
                  <TableCell>Patient does not have a provider assigned</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="bg-[#20659B]/10 border border-[#20659B]/30 rounded text-[#173F5F]">Blue Background</TableCell>
                  <TableCell>Patient is currently selected in the Track Board</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="bg-white p-4 rounded-md border-2 border-[#20659B]/30 shadow-sm">
            <h3 className="text-lg font-medium mb-3 text-[#173F5F] border-b border-[#20659B]/30 pb-2">Priority Levels</h3>
            <Table className="border border-gray-200 rounded-md overflow-hidden">
              <TableHeader className="bg-[#173F5F]/5">
                <TableRow>
                  <TableHead className="font-semibold">Priority</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell><PriorityBadge priority="urgent" /></TableCell>
                  <TableCell>Urgent attention required</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><PriorityBadge priority="high" /></TableCell>
                  <TableCell>High priority</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><PriorityBadge priority="medium" /></TableCell>
                  <TableCell>Medium priority</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell><PriorityBadge priority="low" /></TableCell>
                  <TableCell>Low priority</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="bg-white p-4 rounded-md border-2 border-[#20659B]/30 shadow-sm">
            <h3 className="text-lg font-medium mb-3 text-[#173F5F] border-b border-[#20659B]/30 pb-2">Pending Items</h3>
            <Table className="border border-gray-200 rounded-md overflow-hidden">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Icon</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <span className="inline-flex h-4 w-4 rounded-full bg-blue-600 border border-blue-700 shadow-sm"></span>
                  </TableCell>
                  <TableCell>Labs pending</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <span className="inline-flex h-4 w-4 rounded-full bg-purple-600 border border-purple-700 shadow-sm"></span>
                  </TableCell>
                  <TableCell>Imaging pending</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <span className="inline-flex h-4 w-4 rounded-full bg-orange-600 border border-orange-700 shadow-sm"></span>
                  </TableCell>
                  <TableCell>Consult pending</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          <div className="bg-white p-4 rounded-md border-2 border-[#20659B]/30 shadow-sm">
            <h3 className="text-lg font-medium mb-3 text-[#173F5F] border-b border-[#20659B]/30 pb-2">Column Descriptions</h3>
            <Table className="border border-gray-200 rounded-md overflow-hidden">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Column</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-[#173F5F]">Room</TableCell>
                  <TableCell>Patient's assigned room in the ED</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Patient</TableCell>
                  <TableCell>Patient name, age, and gender</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">MRN</TableCell>
                  <TableCell>Medical Record Number</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Chief Complaint</TableCell>
                  <TableCell>Primary reason for the patient's visit</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Status</TableCell>
                  <TableCell>Current status in the ED workflow</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Priority</TableCell>
                  <TableCell>Urgency level of the patient's condition</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Provider</TableCell>
                  <TableCell>Physician assigned to the patient</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Arrival</TableCell>
                  <TableCell>Time the patient arrived at the ED</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Time Elapsed</TableCell>
                  <TableCell>Time since patient's arrival</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Pending</TableCell>
                  <TableCell>Colored dots indicating pending orders or consultations</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
