import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlaskConical, Image, Heart, Calendar, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LabResult {
  id: string;
  name: string;
  date: string;
  provider: string;
  tests: {
    test: string;
    value: string;
    unit: string;
    normalRange: string;
    flag: "high" | "low" | null;
  }[];
}

interface ImagingResult {
  id: string;
  name: string;
  date: string;
  provider: string;
  impression: string;
  images?: string[];
}

interface CardioResult {
  id: string;
  name: string;
  date: string;
  provider: string;
  findings: string;
  interpretation: string;
}

export function ResultsView() {
  const [activeTab, setActiveTab] = useState("lab");
  
  // Mock data for lab results
  const labResults: LabResult[] = [
    {
      id: "lr-1",
      name: "Complete Blood Count",
      date: "2025-04-16T11:45:00",
      provider: "Dr. Johnson",
      tests: [
        { test: "WBC", value: "12.5", unit: "10^3/μL", normalRange: "4.5-11.0", flag: "high" },
        { test: "RBC", value: "4.8", unit: "10^6/μL", normalRange: "4.5-5.9", flag: null },
        { test: "Hemoglobin", value: "14.2", unit: "g/dL", normalRange: "13.5-17.5", flag: null },
        { test: "Hematocrit", value: "42", unit: "%", normalRange: "41-50", flag: null },
        { test: "Platelets", value: "140", unit: "10^3/μL", normalRange: "150-450", flag: "low" },
      ]
    },
    {
      id: "lr-2",
      name: "Basic Metabolic Panel",
      date: "2025-04-16T12:30:00",
      provider: "Dr. Johnson",
      tests: [
        { test: "Sodium", value: "138", unit: "mmol/L", normalRange: "135-145", flag: null },
        { test: "Potassium", value: "5.2", unit: "mmol/L", normalRange: "3.5-5.0", flag: "high" },
        { test: "Chloride", value: "101", unit: "mmol/L", normalRange: "98-107", flag: null },
        { test: "CO2", value: "24", unit: "mmol/L", normalRange: "22-29", flag: null },
        { test: "BUN", value: "18", unit: "mg/dL", normalRange: "7-20", flag: null },
        { test: "Creatinine", value: "0.9", unit: "mg/dL", normalRange: "0.7-1.3", flag: null },
        { test: "Glucose", value: "65", unit: "mg/dL", normalRange: "70-100", flag: "low" },
      ]
    },
    {
      id: "lr-3",
      name: "Cardiac Enzymes",
      date: "2025-04-16T14:15:00",
      provider: "Dr. Johnson",
      tests: [
        { test: "Troponin I", value: "0.02", unit: "ng/mL", normalRange: "0.00-0.04", flag: null },
        { test: "CK-MB", value: "3.6", unit: "ng/mL", normalRange: "0.0-5.0", flag: null },
      ]
    }
  ];
  
  // Mock data for imaging results
  const imagingResults: ImagingResult[] = [
    {
      id: "ir-1",
      name: "Chest X-Ray",
      date: "2025-04-16T13:00:00",
      provider: "Dr. Smith",
      impression: "No acute cardiopulmonary process. No evidence of pneumonia or effusion."
    }
  ];
  
  // Mock data for cardio results
  const cardioResults: CardioResult[] = [
    {
      id: "cr-1",
      name: "EKG",
      date: "2025-04-16T10:30:00",
      provider: "Dr. Garcia",
      findings: "Normal sinus rhythm at 72 bpm. Normal axis. Normal intervals.",
      interpretation: "Normal EKG."
    }
  ];

  // Function to format date and time
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Results</h2>
      </div>
      
      {/* Tab navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="lab">Laboratory</TabsTrigger>
          <TabsTrigger value="imaging">Imaging</TabsTrigger>
          <TabsTrigger value="cardio">Cardiovascular</TabsTrigger>
          <TabsTrigger value="all">All Results</TabsTrigger>
        </TabsList>
        
        {/* Laboratory Results */}
        <TabsContent value="lab" className="mt-0">
          <Card>
            <CardContent className="p-6">
              {labResults.length > 0 ? (
                <div className="space-y-8">
                  {labResults.map(result => (
                    <div key={result.id} className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <FlaskConical className="h-5 w-5 text-blue-500" />
                            {result.name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {formatDateTime(result.date)} • Ordered by {result.provider}
                          </p>
                        </div>
                      </div>
                      
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Test</TableHead>
                            <TableHead>Result</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Reference Range</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {result.tests.map((test, index) => (
                            <TableRow key={index}>
                              <TableCell>{test.test}</TableCell>
                              <TableCell>
                                <span className={test.flag === "high" ? "text-red-600 font-medium" : 
                                               test.flag === "low" ? "text-blue-600 font-medium" : 
                                               "text-slate-900"}>
                                  {test.value}
                                </span>
                                {test.flag && (
                                  <Badge variant="outline" className={`ml-2 ${test.flag === "high" ? "bg-red-100 text-red-800 border-red-200" : "bg-blue-100 text-blue-800 border-blue-200"}`}>
                                    {test.flag === "high" ? "H" : "L"}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>{test.unit}</TableCell>
                              <TableCell>{test.normalRange}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertCircle className="mx-auto h-12 w-12 text-slate-300" />
                  <h3 className="mt-2 text-lg font-medium">No Laboratory Results</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    There are no laboratory results available at this time.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Imaging Results */}
        <TabsContent value="imaging" className="mt-0">
          <Card>
            <CardContent className="p-6">
              {imagingResults.length > 0 ? (
                <div className="space-y-8">
                  {imagingResults.map(result => (
                    <div key={result.id} className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Image className="h-5 w-5 text-purple-500" />
                            {result.name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {formatDateTime(result.date)} • Ordered by {result.provider}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-slate-50 p-4 rounded-md">
                        <div className="text-sm mb-1 text-slate-700 font-medium">Impression</div>
                        <p className="text-slate-700">{result.impression}</p>
                      </div>
                      
                      {/* Image placeholder */}
                      <div className="border border-dashed border-slate-200 rounded-md p-8 text-center">
                        <Image className="mx-auto h-12 w-12 text-slate-300 mb-2" />
                        <p className="text-slate-500">Image preview would appear here</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertCircle className="mx-auto h-12 w-12 text-slate-300" />
                  <h3 className="mt-2 text-lg font-medium">No Imaging Results</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    There are no imaging results available at this time.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Cardiovascular Results */}
        <TabsContent value="cardio" className="mt-0">
          <Card>
            <CardContent className="p-6">
              {cardioResults.length > 0 ? (
                <div className="space-y-8">
                  {cardioResults.map(result => (
                    <div key={result.id} className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Heart className="h-5 w-5 text-red-500" />
                            {result.name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {formatDateTime(result.date)} • Ordered by {result.provider}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-md">
                          <div className="text-sm mb-1 text-slate-700 font-medium">Findings</div>
                          <p className="text-slate-700">{result.findings}</p>
                        </div>
                        
                        <div className="bg-slate-50 p-4 rounded-md">
                          <div className="text-sm mb-1 text-slate-700 font-medium">Interpretation</div>
                          <p className="text-slate-700">{result.interpretation}</p>
                        </div>
                      </div>
                      
                      {/* EKG placeholder */}
                      <div className="border border-dashed border-slate-200 rounded-md p-8 text-center">
                        <Heart className="mx-auto h-12 w-12 text-slate-300 mb-2" />
                        <p className="text-slate-500">EKG waveform would appear here</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertCircle className="mx-auto h-12 w-12 text-slate-300" />
                  <h3 className="mt-2 text-lg font-medium">No Cardiovascular Results</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    There are no cardiovascular test results available at this time.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* All Results */}
        <TabsContent value="all" className="mt-0">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FlaskConical className="h-5 w-5 text-blue-500" />
                    Laboratory Results
                  </h3>
                  
                  {labResults.length > 0 ? (
                    <div className="space-y-2">
                      {labResults.map(result => (
                        <div key={result.id} className="p-3 bg-slate-50 rounded-md flex justify-between items-center">
                          <div>
                            <div className="font-medium">{result.name}</div>
                            <div className="text-sm text-slate-500">{formatDateTime(result.date)}</div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No laboratory results available</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Image className="h-5 w-5 text-purple-500" />
                    Imaging Results
                  </h3>
                  
                  {imagingResults.length > 0 ? (
                    <div className="space-y-2">
                      {imagingResults.map(result => (
                        <div key={result.id} className="p-3 bg-slate-50 rounded-md flex justify-between items-center">
                          <div>
                            <div className="font-medium">{result.name}</div>
                            <div className="text-sm text-slate-500">{formatDateTime(result.date)}</div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No imaging results available</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Cardiovascular Results
                  </h3>
                  
                  {cardioResults.length > 0 ? (
                    <div className="space-y-2">
                      {cardioResults.map(result => (
                        <div key={result.id} className="p-3 bg-slate-50 rounded-md flex justify-between items-center">
                          <div>
                            <div className="font-medium">{result.name}</div>
                            <div className="text-sm text-slate-500">{formatDateTime(result.date)}</div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 italic">No cardiovascular results available</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
