import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface Vital {
  id: string;
  timestamp: string;
  temperature: number;
  heartRate: number;
  respiratoryRate: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  oxygenSaturation: number;
  painLevel: number;
}

interface PatientVitalsDisplayProps {
  vitals: Vital[];
}

export const PatientVitalsDisplay: React.FC<PatientVitalsDisplayProps> = ({ vitals }) => {
  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Sort vitals by timestamp (newest first)
  const sortedVitals = [...vitals].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Prepare data for charts
  const chartData = [...vitals].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  ).map(vital => ({
    name: formatTimestamp(vital.timestamp),
    temperature: vital.temperature,
    heartRate: vital.heartRate,
    respiratoryRate: vital.respiratoryRate,
    bpSystolic: vital.bloodPressureSystolic,
    bpDiastolic: vital.bloodPressureDiastolic,
    oxygenSaturation: vital.oxygenSaturation,
    painLevel: vital.painLevel
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          <span>Patient Vitals</span>
          <Button size="sm" variant="outline" className="h-7 text-xs">
            Record New Vitals
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="table">
          <TabsList className="mb-4">
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="trend">Trend View</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table">
            <div className="overflow-auto max-h-80">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Temp (°F)</TableHead>
                    <TableHead>HR (bpm)</TableHead>
                    <TableHead>RR (bpm)</TableHead>
                    <TableHead>BP (mmHg)</TableHead>
                    <TableHead>O₂ Sat (%)</TableHead>
                    <TableHead>Pain (0-10)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedVitals.map((vital) => (
                    <TableRow key={vital.id}>
                      <TableCell>{formatTimestamp(vital.timestamp)}</TableCell>
                      <TableCell>{vital.temperature.toFixed(1)}</TableCell>
                      <TableCell>{vital.heartRate}</TableCell>
                      <TableCell>{vital.respiratoryRate}</TableCell>
                      <TableCell>{vital.bloodPressureSystolic}/{vital.bloodPressureDiastolic}</TableCell>
                      <TableCell>{vital.oxygenSaturation}%</TableCell>
                      <TableCell>{vital.painLevel}/10</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="trend">
            <div className="space-y-6">
              <div className="h-64">
                <p className="text-sm font-medium mb-2">Temperature & Heart Rate</p>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="temperature" stroke="#ff8c00" name="Temp (°F)" />
                    <Line yAxisId="right" type="monotone" dataKey="heartRate" stroke="#ff0000" name="HR (bpm)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-64">
                <p className="text-sm font-medium mb-2">Blood Pressure</p>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bpSystolic" stroke="#8884d8" name="Systolic" />
                    <Line type="monotone" dataKey="bpDiastolic" stroke="#82ca9d" name="Diastolic" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="h-64">
                <p className="text-sm font-medium mb-2">Oxygen Saturation & Respiratory Rate</p>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" domain={[85, 100]} />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="oxygenSaturation" stroke="#00bfff" name="O₂ Sat (%)" />
                    <Line yAxisId="right" type="monotone" dataKey="respiratoryRate" stroke="#00a86b" name="RR (bpm)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
