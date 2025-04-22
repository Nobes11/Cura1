import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { mockPatients } from "../utils/mockData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, FileText, LayoutGrid, Pill, Activity, Calendar, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PatientChartsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Extract patientId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get("patientId");
  
  // Find patient data
  const patient = patientId ? mockPatients.find(p => p.id === patientId) : null;
  
  // Redirect to dashboard if no patient found
  useEffect(() => {
    if (!patient) {
      navigate("/Dashboard");
    }
  }, [patient, navigate]);
  
  // If no patient is found, show loading state
  if (!patient) {
    return <div className="p-8">Loading patient data...</div>;
  }
  
  // Mock vitals data
  const mockVitals = [
    {
      timestamp: "2025-04-16T14:30:00",
      temperature: 98.6,
      heartRate: 72,
      respiratoryRate: 16,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      oxygenSaturation: 98,
      painLevel: 0
    },
    {
      timestamp: "2025-04-16T10:15:00",
      temperature: 99.1,
      heartRate: 86,
      respiratoryRate: 18,
      bloodPressureSystolic: 128,
      bloodPressureDiastolic: 84,
      oxygenSaturation: 96,
      painLevel: 3
    }
  ];

  // Main component rendering
  return (
    <div className="p-4 space-y-4">
      {/* Patient header */}
      <div className="bg-amber-50 rounded-lg shadow-sm border border-amber-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{patient.name}</h1>
              <span className="text-sm text-slate-600">{patient.age} yr, {patient.gender}</span>
              
              {/* DNR Status */}
              {patient.dnrStatus && (
                <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 ml-2">
                  DNR
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span>MRN: {patient.id}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/Dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
      
      {/* Patient summary */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Patient Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Demographics</h3>
              <p><strong>Name:</strong> {patient.name}</p>
              <p><strong>Age:</strong> {patient.age}</p>
              <p><strong>Gender:</strong> {patient.gender}</p>
            </div>
            
            <div>
              <h3 className="font-medium">Allergies</h3>
              {patient.allergies && patient.allergies.length > 0 ? (
                <ul className="list-disc list-inside">
                  {patient.allergies.map((allergy, index) => (
                    <li key={index}>
                      {allergy.allergen} - {allergy.reaction} ({allergy.severity})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No known allergies</p>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium">Recent Vitals</h3>
            {mockVitals.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                <div>
                  <p className="text-sm text-slate-500">Temperature</p>
                  <p className="font-medium">{mockVitals[0].temperature}°F</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Heart Rate</p>
                  <p className="font-medium">{mockVitals[0].heartRate} bpm</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Blood Pressure</p>
                  <p className="font-medium">{mockVitals[0].bloodPressureSystolic}/{mockVitals[0].bloodPressureDiastolic}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">O₂ Saturation</p>
                  <p className="font-medium">{mockVitals[0].oxygenSaturation}%</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Main tabs content */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start bg-slate-100 p-0 rounded-t-lg">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:bg-white rounded-none data-[state=active]:rounded-tl-lg data-[state=active]:shadow-none"
            >
              <LayoutGrid className="h-4 w-4 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="documentation" 
              className="data-[state=active]:bg-white rounded-none data-[state=active]:shadow-none"
            >
              <FileText className="h-4 w-4 mr-1" />
              Documentation
            </TabsTrigger>
            <TabsTrigger 
              value="medications" 
              className="data-[state=active]:bg-white rounded-none data-[state=active]:shadow-none"
            >
              <Pill className="h-4 w-4 mr-1" />
              Medications
            </TabsTrigger>
            <TabsTrigger 
              value="vitals" 
              className="data-[state=active]:bg-white rounded-none data-[state=active]:shadow-none"
            >
              <Activity className="h-4 w-4 mr-1" />
              Vitals
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-white rounded-none data-[state=active]:shadow-none"
            >
              <ClipboardList className="h-4 w-4 mr-1" />
              Orders
            </TabsTrigger>
          </TabsList>
          
          {/* Tab contents */}
          <TabsContent value="overview" className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Active Problems</h2>
                <Card>
                  <CardContent className="py-4">
                    <ul className="space-y-2">
                      <li>
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">Chest Pain</p>
                            <p className="text-sm text-slate-500">Onset: Today</p>
                          </div>
                          <Badge>Active</Badge>
                        </div>
                      </li>
                      <li>
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">Hypertension</p>
                            <p className="text-sm text-slate-500">Onset: 2023-05-10</p>
                          </div>
                          <Badge>Active</Badge>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-2">Recent Vitals Trend</h2>
                <Card>
                  <CardContent className="py-4">
                    <div className="space-y-4">
                      {mockVitals.map((vital, index) => (
                        <div key={index}>
                          <p className="text-sm text-slate-500">
                            {new Date(vital.timestamp).toLocaleString()}
                          </p>
                          <div className="grid grid-cols-4 gap-2 mt-1">
                            <div>
                              <p className="text-xs text-slate-500">Temp</p>
                              <p>{vital.temperature}°F</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">HR</p>
                              <p>{vital.heartRate} bpm</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">BP</p>
                              <p>{vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">O₂</p>
                              <p>{vital.oxygenSaturation}%</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-2">Active Medications</h2>
                <Card>
                  <CardContent className="py-4">
                    <ul className="space-y-2">
                      <li>
                        <div>
                          <p className="font-medium">Acetaminophen 500mg</p>
                          <p className="text-sm text-slate-500">PO Q6H PRN for pain</p>
                        </div>
                      </li>
                      <li>
                        <div>
                          <p className="font-medium">Ondansetron 4mg</p>
                          <p className="text-sm text-slate-500">IV Q8H PRN for nausea</p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documentation" className="p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Documentation</h2>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-1" />
                New Note
              </Button>
            </div>
            <Card>
              <CardContent className="py-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-medium">Emergency Department Note</h3>
                      <span className="text-sm text-slate-500">2025-04-16 14:45</span>
                    </div>
                    <p className="text-sm">Dr. Sarah Johnson</p>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-medium">Triage Assessment</h3>
                      <span className="text-sm text-slate-500">2025-04-16 06:15</span>
                    </div>
                    <p className="text-sm">Nurse Michael Chen</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="medications" className="p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Medications</h2>
              <Button variant="outline" size="sm">
                <Pill className="h-4 w-4 mr-1" />
                Reconcile Meds
              </Button>
            </div>
            <Card>
              <CardContent className="py-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Active Medications</h3>
                    <ul className="space-y-3">
                      <li className="p-2 bg-slate-50 rounded">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">Acetaminophen 500mg</p>
                            <p className="text-sm text-slate-500">PO Q6H PRN for pain</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Last given: 2025-04-16 06:30 | Next due: 2025-04-16 12:30
                        </div>
                      </li>
                      <li className="p-2 bg-slate-50 rounded">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">Ondansetron 4mg</p>
                            <p className="text-sm text-slate-500">IV Q8H PRN for nausea</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Last given: 2025-04-16 06:35 | Next due: 2025-04-16 14:35
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Completed Medications</h3>
                    <ul className="space-y-3">
                      <li className="p-2 bg-slate-50 rounded">
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">Normal Saline 1000mL</p>
                            <p className="text-sm text-slate-500">IV X1</p>
                          </div>
                          <Badge className="bg-slate-100 text-slate-800 border-slate-200">Completed</Badge>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Completed: 2025-04-16 10:40
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Home Medications</h3>
                    <ul className="space-y-3">
                      <li className="p-2 bg-slate-50 rounded">
                        <p className="font-medium">Lisinopril 10mg</p>
                        <p className="text-sm text-slate-500">PO Daily</p>
                      </li>
                      <li className="p-2 bg-slate-50 rounded">
                        <p className="font-medium">Atorvastatin 20mg</p>
                        <p className="text-sm text-slate-500">PO Daily at bedtime</p>
                      </li>
                      <li className="p-2 bg-slate-50 rounded">
                        <p className="font-medium">Metformin 500mg</p>
                        <p className="text-sm text-slate-500">PO BID</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vitals" className="p-6">
            <h2 className="text-lg font-semibold mb-4">Vitals</h2>
            <Card>
              <CardContent className="py-4">
                <div className="space-y-6">
                  {mockVitals.map((vital, index) => (
                    <div key={index} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium">Vital Signs</h3>
                        <span className="text-sm text-slate-500">
                          {new Date(vital.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-slate-500">Temperature</p>
                          <p className="font-medium">{vital.temperature}°F</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Heart Rate</p>
                          <p className="font-medium">{vital.heartRate} bpm</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Respiratory Rate</p>
                          <p className="font-medium">{vital.respiratoryRate} bpm</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Blood Pressure</p>
                          <p className="font-medium">{vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic} mmHg</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">O₂ Saturation</p>
                          <p className="font-medium">{vital.oxygenSaturation}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Pain Level</p>
                          <p className="font-medium">{vital.painLevel}/10</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders" className="p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Orders</h2>
              <Button variant="outline" size="sm">
                <ClipboardList className="h-4 w-4 mr-1" />
                New Order
              </Button>
            </div>
            <Card>
              <CardContent className="py-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-medium">CBC with Differential</h3>
                      <Badge>Completed</Badge>
                    </div>
                    <p className="text-sm text-slate-500">Lab - Ordered 2025-04-16 07:15</p>
                    <p className="text-sm">Dr. Sarah Johnson</p>
                    <div className="mt-1 p-2 bg-slate-50 rounded text-sm">
                      <p>Result: WBC: 7.8 K/uL, RBC: 4.5 M/uL, Hgb: 13.2 g/dL, Plt: 250 K/uL</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <h3 className="font-medium">Chest X-Ray</h3>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>
                    </div>
                    <p className="text-sm text-slate-500">Imaging - Ordered 2025-04-16 08:30</p>
                    <p className="text-sm">Dr. Sarah Johnson</p>
                    <p className="text-sm italic mt-1">Note: Rule out pneumonia</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}