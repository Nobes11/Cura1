import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockPatients, Patient } from "../utils/mockData";
import { StatusBadge } from "components/StatusBadge";
import { CalendarIcon, Search, Filter, List } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CuraLogo } from "components/CuraLogo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "../utils/authStore";
import { PatientCheckIn } from "components/PatientCheckIn";
import { toast } from "sonner";

export default function Schedule() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [viewType, setViewType] = useState<string>("daily");
  const [activeTab, setActiveTab] = useState("schedule");
  const [checkedInPatients, setCheckedInPatients] = useState<any[]>([]);
  
  // Check if we were redirected from adding a new patient
  useEffect(() => {
    const newPatientMrn = searchParams.get("newPatient");
    if (newPatientMrn) {
      // Switch to the check-in tab automatically
      setActiveTab("check-in");
      toast.info(`Ready to check in patient with MRN: ${newPatientMrn}. Please select the patient from the search results.`);
    }
  }, [searchParams]);
  
  // Handle check-in completion
  const handleCheckInComplete = (checkInData: any) => {
    // Add the checked-in patient to the list
    setCheckedInPatients(prev => [checkInData, ...prev]);
    // Switch back to the schedule tab
    setActiveTab("schedule");
  };

  // Generate dates for the week
  const today = new Date();
  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      display: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };
  });

  // Format the schedule time slots
  const timeSlots = [
    "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM",
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
  ];

  // Generate mock schedule data
  const providers = ["Dr. Johnson", "Dr. Smith", "Dr. Wilson", "Dr. Thompson", "Dr. Harris"];
  
  // Generate scheduled patients (a mix of mockPatients and some appointments)
  const generateScheduledPatients = () => {
    const scheduledPatients = [...mockPatients].filter(p => p.status !== "discharged").map(patient => ({
      ...patient,
      appointmentTime: timeSlots[Math.floor(Math.random() * timeSlots.length)],
      appointmentType: ["Follow-up", "New Patient", "Urgent Care", "Consult"][Math.floor(Math.random() * 4)],
      provider: patient.assignedProvider || providers[Math.floor(Math.random() * providers.length)],
      checkInStatus: ["Checked In", "Waiting", "In Room", "With Provider", "Completed"][Math.floor(Math.random() * 5)]
    }));
    
    // Add some additional scheduled patients who aren't in the ED yet
    const additionalPatients: any[] = [];
    for (let i = 0; i < 5; i++) {
      additionalPatients.push({
        id: `scheduled-${i}`,
        name: ["Alexander Peterson", "Maria Rodriguez", "Thomas Johnson", "Samantha Williams", "Kevin Chen"][i],
        age: 20 + Math.floor(Math.random() * 50),
        gender: Math.random() > 0.5 ? "Male" : "Female",
        appointmentTime: timeSlots[Math.floor(Math.random() * timeSlots.length)],
        appointmentType: ["Follow-up", "New Patient", "Urgent Care", "Consult"][Math.floor(Math.random() * 4)],
        provider: providers[Math.floor(Math.random() * providers.length)],
        chiefComplaint: ["Annual Physical", "Medication Refill", "Back Pain", "Hypertension Follow-up", "Allergy Consultation"][i],
        mrn: `MRN${100000 + Math.floor(Math.random() * 900000)}`,
        checkInStatus: ["Scheduled", "Confirmed", "Rescheduled"][Math.floor(Math.random() * 3)]
      });
    }
    
    return [...scheduledPatients, ...additionalPatients];
  };

  const scheduledPatients = generateScheduledPatients();
  
  // Filter patients based on search text and selected provider
  const filteredPatients = scheduledPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchText.toLowerCase()) ||
      patient.chiefComplaint.toLowerCase().includes(searchText.toLowerCase()) ||
      (patient.mrn && patient.mrn.toLowerCase().includes(searchText.toLowerCase()));
    
    const matchesProvider = selectedProvider === "all" || patient.provider === selectedProvider;
    
    return matchesSearch && matchesProvider;
  });
  
  // Sort patients by appointment time
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    // Convert appointment times to comparable values
    const timeA = a.appointmentTime;
    const timeB = b.appointmentTime;
    return timeA.localeCompare(timeB);
  });

  return (
    <div className="container mx-auto py-4 max-w-7xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="check-in">Patient Check-In</TabsTrigger>
        </TabsList>
      
        <TabsContent value="schedule" className="mt-0">
          <Card className="mb-6">
            <CardHeader className="bg-white border-b pb-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CuraLogo size={24} showText={false} />
                  <CardTitle className="text-xl font-semibold text-gray-800">Daily Schedule</CardTitle>
                </div>
                <div className="flex gap-2 items-center">
                  {user && (
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <span className="font-medium">{user.name}</span>
                      <span className="px-2 py-1 bg-sky-100 text-sky-800 rounded-full text-xs">
                        {user.role}
                      </span>
                    </div>
                  )}
                  <Button variant="outline" onClick={() => navigate("/")}>
                    <List className="h-4 w-4 mr-2" />
                    Track Board
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {/* Controls */}
              <div className="flex flex-wrap justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-[300px]">
                    {/* TabsList moved to main Tabs component below */}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative w-[300px]">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search patients..."
                      className="pl-8"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>
                  
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">All Providers</SelectItem>
                        {providers.map(provider => (
                          <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                
                {viewType === "daily" && (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Today
                    </Button>
                    
                    <Select value={selectedDate} onValueChange={setSelectedDate}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {weekDates.map(date => (
                            <SelectItem key={date.date} value={date.date}>{date.display}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              <Tabs value={viewType} onValueChange={setViewType}>
                <TabsList className="mb-4">
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>
                <TabsContent value="daily" className="mt-6 border rounded-md">
                  {/* Daily schedule view */}
                  <Table>
                    <TableHeader className="bg-sky-50">
                      <TableRow>
                        <TableHead className="w-[120px] font-medium text-sky-700">Time</TableHead>
                        <TableHead className="font-medium text-sky-700">Patient</TableHead>
                        <TableHead className="font-medium text-sky-700">Type</TableHead>
                        <TableHead className="font-medium text-sky-700">Chief Complaint</TableHead>
                        <TableHead className="font-medium text-sky-700">Status</TableHead>
                        <TableHead className="font-medium text-sky-700">Provider</TableHead>
                        <TableHead className="font-medium text-sky-700 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timeSlots.map(timeSlot => {
                        const patientsAtTime = sortedPatients.filter(p => p.appointmentTime === timeSlot);
                        
                        if (patientsAtTime.length === 0) {
                          return (
                            <TableRow key={timeSlot}>
                              <TableCell className="font-medium text-slate-600">{timeSlot}</TableCell>
                              <TableCell colSpan={6} className="text-slate-400 italic">
                                No appointments scheduled
                              </TableCell>
                            </TableRow>
                          );
                        }
                        
                        return patientsAtTime.map((patient, idx) => (
                          <TableRow key={`${timeSlot}-${patient.id}`} className="hover:bg-sky-50">
                            {idx === 0 && (
                              <TableCell rowSpan={patientsAtTime.length} className="font-medium text-slate-600 align-top">
                                {timeSlot}
                              </TableCell>
                            )}
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{patient.name}</span>
                                <span className="text-xs text-slate-500">{patient.age}y, {patient.gender} • {patient.mrn}</span>
                              </div>
                            </TableCell>
                            <TableCell>{patient.appointmentType}</TableCell>
                            <TableCell>{patient.chiefComplaint}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                patient.checkInStatus === "Checked In" ? "bg-yellow-100 text-yellow-800" :
                                patient.checkInStatus === "Waiting" ? "bg-orange-100 text-orange-800" :
                                patient.checkInStatus === "In Room" ? "bg-blue-100 text-blue-800" :
                                patient.checkInStatus === "With Provider" ? "bg-purple-100 text-purple-800" :
                                patient.checkInStatus === "Completed" ? "bg-green-100 text-green-800" :
                                "bg-gray-100 text-gray-800"
                              }`}>
                                {patient.checkInStatus}
                              </span>
                            </TableCell>
                            <TableCell>{patient.provider}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                                  View
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => {
                                    setActiveTab("check-in");
                                    toast.info(`Select ${patient.name} to check in`);
                                  }}
                                >
                                  Check In
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ));
                      })}
                    </TableBody>
                  </Table>
                </TabsContent>
                
                <TabsContent value="weekly" className="mt-6 border rounded-md p-4">
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-sky-800">Weekly Schedule View</h3>
                    <p className="text-slate-500 mt-2">Calendar view will be displayed here with all appointments for the week</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="list" className="mt-6 border rounded-md">
                  <Table>
                    <TableHeader className="bg-sky-50">
                      <TableRow>
                        <TableHead className="font-medium text-sky-700">Patient</TableHead>
                        <TableHead className="font-medium text-sky-700">Time</TableHead>
                        <TableHead className="font-medium text-sky-700">Type</TableHead>
                        <TableHead className="font-medium text-sky-700">Chief Complaint</TableHead>
                        <TableHead className="font-medium text-sky-700">Status</TableHead>
                        <TableHead className="font-medium text-sky-700">Provider</TableHead>
                        <TableHead className="font-medium text-sky-700 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedPatients.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                            No patients match your search criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        sortedPatients.map(patient => (
                          <TableRow key={patient.id} className="hover:bg-sky-50">
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-medium">{patient.name}</span>
                                <span className="text-xs text-slate-500">{patient.age}y, {patient.gender} • {patient.mrn}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-slate-600">{patient.appointmentTime}</TableCell>
                            <TableCell>{patient.appointmentType}</TableCell>
                            <TableCell>{patient.chiefComplaint}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                patient.checkInStatus === "Checked In" ? "bg-yellow-100 text-yellow-800" :
                                patient.checkInStatus === "Waiting" ? "bg-orange-100 text-orange-800" :
                                patient.checkInStatus === "In Room" ? "bg-blue-100 text-blue-800" :
                                patient.checkInStatus === "With Provider" ? "bg-purple-100 text-purple-800" :
                                patient.checkInStatus === "Completed" ? "bg-green-100 text-green-800" :
                                "bg-gray-100 text-gray-800"
                              }`}>
                                {patient.checkInStatus}
                              </span>
                            </TableCell>
                            <TableCell>{patient.provider}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                                  View
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => {
                                    setActiveTab("check-in");
                                    toast.info(`Select ${patient.name} to check in`);
                                  }}
                                >
                                  Check In
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="check-in" className="mt-0">
          <div className="flex flex-col gap-6">
            <PatientCheckIn onCheckInComplete={handleCheckInComplete} />
            
            {checkedInPatients.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Check-Ins</CardTitle>
                  <CardDescription>Patients recently checked in</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>MRN</TableHead>
                        <TableHead>Chief Complaint</TableHead>
                        <TableHead>Triage Level</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {checkedInPatients.map((patient, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{patient.patientName}</TableCell>
                          <TableCell>{patient.patientMrn}</TableCell>
                          <TableCell>{patient.chiefComplaint}</TableCell>
                          <TableCell>{patient.triageLevel}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                              Waiting
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}