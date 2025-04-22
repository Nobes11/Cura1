import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockPatients, Patient } from "../utils/mockData";
import { StatusBadge } from "./StatusBadge";

interface ProviderAssignment {
  time: string;
  providerName: string;
  patientName: string;
  room: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Sample providers
const providers = [
  "Dr. Sarah Johnson",
  "Dr. Michael Chen",
  "Dr. Emily Rodriguez",
  "Dr. David Kim",
  "Dr. Lisa Patel",
  "Dr. James Wilson",
  "Dr. Robert Smith",
  "Dr. Maria Garcia",
  "Dr. Patterson"
];

// Sample time slots
const timeSlots = [
  "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
];

export const ScheduleViewDialog: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [viewType, setViewType] = useState<string>("daily");
  
  // Get discharged patients
  const dischargedPatients = mockPatients.filter(p => p.status === "discharged");
  
  // Generate mock assignments
  const generateMockAssignments = (): ProviderAssignment[] => {
    const assignments: ProviderAssignment[] = [];
    
    // Generate mock patient names
    const patients = [
      "John Smith", "Maria Garcia", "Robert Johnson", "Lisa Chen", 
      "David Williams", "Sarah Brown", "Michael Davis", "Jennifer Miller",
      "Thomas Wilson", "Emma Moore", "James Taylor", "Olivia Anderson"
    ];
    
    // Generate rooms
    const rooms = [
      "101", "102", "103", "104", "105", "201", "202", "203", "204", "205"
    ];
    
    // Generate random assignments
    providers.forEach(provider => {
      // Each provider gets 2-4 assignments
      const numAssignments = 2 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < numAssignments; i++) {
        const timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
        const patient = patients[Math.floor(Math.random() * patients.length)];
        const room = rooms[Math.floor(Math.random() * rooms.length)];
        
        assignments.push({
          time: timeSlot,
          providerName: provider,
          patientName: patient,
          room: room
        });
      }
    });
    
    return assignments;
  };
  
  const allAssignments = generateMockAssignments();
  
  // Filter assignments based on selected provider
  const filteredAssignments = selectedProvider === "all" 
    ? allAssignments 
    : allAssignments.filter(a => a.providerName === selectedProvider);
  
  // Sort assignments by time
  const sortedAssignments = [...filteredAssignments].sort((a, b) => 
    a.time.localeCompare(b.time)
  );
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Provider Schedule</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Tabs value={viewType} onValueChange={setViewType}>
            <div className="flex justify-between items-center gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="daily">Daily View</TabsTrigger>
                <TabsTrigger value="provider">By Provider</TabsTrigger>
                <TabsTrigger value="discharged">Discharged</TabsTrigger>
              </TabsList>
              
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  {providers.map(provider => (
                    <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <TabsContent value="daily" className="mt-0">
              <div className="border rounded-md overflow-hidden">
                <table className="w-full border-collapse">
                  <thead className="bg-sky-50">
                    <tr>
                      <th className="p-2 text-left text-sm font-medium text-sky-700 w-24">Time</th>
                      <th className="p-2 text-left text-sm font-medium text-sky-700">Provider</th>
                      <th className="p-2 text-left text-sm font-medium text-sky-700">Patient</th>
                      <th className="p-2 text-left text-sm font-medium text-sky-700 w-16">Room</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAssignments.length > 0 ? (
                      sortedAssignments.map((assignment, index) => (
                        <tr key={index} className="border-b hover:bg-slate-50">
                          <td className="p-2 text-slate-700">{assignment.time}</td>
                          <td className="p-2 text-slate-700 font-medium">{assignment.providerName}</td>
                          <td className="p-2 text-slate-700">{assignment.patientName}</td>
                          <td className="p-2 text-slate-700">{assignment.room}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-slate-500">
                          No assignments found for the selected criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="provider" className="mt-0">
              <div className="grid grid-cols-2 gap-4">
                {providers
                  .filter(provider => selectedProvider === "all" || provider === selectedProvider)
                  .map(provider => {
                    const providerAssignments = allAssignments.filter(a => a.providerName === provider);
                    return (
                      <div key={provider} className="border rounded-md overflow-hidden">
                        <div className="bg-sky-50 p-2 font-medium text-sky-700">{provider}</div>
                        <div className="p-2">
                          {providerAssignments.length > 0 ? (
                            <table className="w-full">
                              <tbody>
                                {providerAssignments.map((assignment, index) => (
                                  <tr key={index} className="border-b last:border-b-0">
                                    <td className="py-1 text-slate-700 w-20">{assignment.time}</td>
                                    <td className="py-1 text-slate-700">
                                      {assignment.patientName} <span className="text-slate-500">(Room {assignment.room})</span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div className="text-center text-slate-500 py-2">No assignments</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </TabsContent>
            
            <TabsContent value="discharged" className="mt-0">
              <div className="border rounded-md overflow-hidden">
                <table className="w-full border-collapse">
                  <thead className="bg-sky-50">
                    <tr>
                      <th className="p-2 text-left text-sm font-medium text-sky-700">Patient</th>
                      <th className="p-2 text-left text-sm font-medium text-sky-700">Chief Complaint</th>
                      <th className="p-2 text-left text-sm font-medium text-sky-700">Provider</th>
                      <th className="p-2 text-left text-sm font-medium text-sky-700">Disposition</th>
                      <th className="p-2 text-left text-sm font-medium text-sky-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dischargedPatients.length > 0 ? (
                      dischargedPatients.map((patient) => (
                        <tr key={patient.id} className="border-b hover:bg-slate-50">
                          <td className="p-2 text-slate-700 font-medium">{patient.name}</td>
                          <td className="p-2 text-slate-700">{patient.chiefComplaint}</td>
                          <td className="p-2 text-slate-700">{patient.assignedProvider || 'Unassigned'}</td>
                          <td className="p-2 text-slate-700">{patient.disposition || 'Home'}</td>
                          <td className="p-2">
                            <StatusBadge status={patient.status} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-slate-500">
                          No discharged patients found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
