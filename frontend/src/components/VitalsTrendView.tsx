import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface VitalReading {
  timestamp: string;
  bp: string;
  hr: number;
  rr: number;
  temp: number;
  spo2: number;
}

interface VitalsTrendViewProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
}

export const VitalsTrendView: React.FC<VitalsTrendViewProps> = ({
  isOpen,
  onClose,
  patientName,
  patientId
}) => {
  // Mock data for vital sign trends
  const vitalHistory: VitalReading[] = [
    {
      timestamp: "10:30 AM",
      bp: "120/80",
      hr: 72,
      rr: 16,
      temp: 98.6,
      spo2: 99
    },
    {
      timestamp: "1:45 PM",
      bp: "122/82",
      hr: 75,
      rr: 18,
      temp: 98.8,
      spo2: 98
    },
    {
      timestamp: "4:15 PM",
      bp: "118/78",
      hr: 70,
      rr: 16,
      temp: 98.4,
      spo2: 99
    },
    {
      timestamp: "7:30 PM",
      bp: "124/84",
      hr: 78,
      rr: 17,
      temp: 99.0,
      spo2: 97
    }
  ];

  // Transform BP data for charting
  const chartData = vitalHistory.map(reading => {
    const bpParts = reading.bp.split("/");
    return {
      time: reading.timestamp,
      systolic: parseInt(bpParts[0]),
      diastolic: parseInt(bpParts[1]),
      hr: reading.hr,
      rr: reading.rr,
      temp: reading.temp,
      spo2: reading.spo2
    };
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vital Signs Trend - {patientName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 my-4">
          {/* Blood Pressure Chart */}
          <div>
            <h3 className="font-medium text-slate-800 mb-2">Blood Pressure</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic" />
                  <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" name="Diastolic" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Heart Rate, Resp Rate, and SpO2 Chart */}
          <div>
            <h3 className="font-medium text-slate-800 mb-2">Heart Rate, Respiratory Rate, and SpO2</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="hr" stroke="#f97316" name="Heart Rate" />
                  <Line type="monotone" dataKey="rr" stroke="#84cc16" name="Respiratory Rate" />
                  <Line type="monotone" dataKey="spo2" stroke="#06b6d4" name="SpO2" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Temperature Chart */}
          <div>
            <h3 className="font-medium text-slate-800 mb-2">Temperature</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[97, 102]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temp" stroke="#8b5cf6" name="Temperature" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};