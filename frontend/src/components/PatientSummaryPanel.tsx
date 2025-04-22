import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Activity, ClipboardList, Pill } from "lucide-react";
import { formatDate } from '../utils/formatting';

interface Allergy {
  allergen: string;
  reaction: string;
  severity: string;
  documented?: string;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  status: string;
  prescribedDate: string;
}

interface Problem {
  problem: string;
  icd10: string;
  onset: string;
  status: string;
}

interface Vital {
  timestamp: string;
  temperature?: string;
  heartRate?: string;
  respiratoryRate?: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bloodPressure?: string;
  oxygenSaturation?: number | string;
  painLevel?: number;
}

interface PatientSummaryPanelProps {
  patientName: string;
  patientId: string;
  dnrStatus?: boolean | string;
  isolationStatus?: string;
  allergies: Allergy[];
  medications: any[];
  problems: Problem[];
  vitals: Vital[];
  admitReason?: string;
  encounterType?: string;
}

export function PatientSummaryPanel({
  patientName,
  patientId,
  dnrStatus,
  isolationStatus,
  allergies,
  medications,
  problems,
  vitals,
  admitReason,
  encounterType
}: PatientSummaryPanelProps) {
  // Get the most recent vitals
  const mostRecentVitals = vitals.length > 0 
    ? vitals.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0] 
    : null;
  
  // Get active medications only
  const activeMedications = medications.filter(med => med.status === "Active");
  
  // Get active problems only
  const activeProblems = problems.filter(problem => problem.status === "Active");
  
  // Format blood pressure
  const formatBloodPressure = (vital: Vital) => {
    if (vital.bloodPressure) return vital.bloodPressure;
    if (vital.bloodPressureSystolic && vital.bloodPressureDiastolic) {
      return `${vital.bloodPressureSystolic}/${vital.bloodPressureDiastolic}`;
    }
    return "--/--";
  };

  return (
    <Card className="border-l-4 border-amber-500 mb-4 bg-amber-50/70 shadow-sm">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-slate-800">Patient Summary</h3>
          <div className="flex gap-1">
            {dnrStatus && (
              <Badge className="bg-red-500 hover:bg-red-600 px-2 py-0 h-5">
                DNR
              </Badge>
            )}
            {isolationStatus && (
              <Badge className="bg-yellow-500 hover:bg-yellow-600 px-2 py-0 h-5">
                {isolationStatus}
              </Badge>
            )}
            {encounterType && (
              <Badge className="bg-blue-500 hover:bg-blue-600 px-2 py-0 h-5">
                {encounterType}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Admission Info */}
        {admitReason && (
          <div className="mb-2">
            <p className="text-xs text-slate-600"><span className="font-medium">Reason:</span> {admitReason}</p>
          </div>
        )}
        
        <div className="grid grid-cols-4 gap-3 text-xs">
          {/* Allergies Section */}
          <div className="col-span-1">
            <div className="flex items-center gap-1 mb-1">
              <AlertTriangle className="h-3 w-3 text-red-500" />
              <span className="font-semibold text-slate-700">Allergies</span>
            </div>
            {allergies.length > 0 ? (
              <ul className="space-y-1">
                {allergies.slice(0, 3).map((allergy, index) => (
                  <li key={index} className="text-red-600 font-medium">
                    {allergy.allergen}{allergy.severity === "Severe" && "*"}
                  </li>
                ))}
                {allergies.length > 3 && (
                  <li className="italic text-slate-500">+{allergies.length - 3} more</li>
                )}
              </ul>
            ) : (
              <p className="text-green-600 italic">No known allergies</p>
            )}
          </div>
          
          {/* Medications Section */}
          <div className="col-span-1">
            <div className="flex items-center gap-1 mb-1">
              <Pill className="h-3 w-3 text-blue-500" />
              <span className="font-semibold text-slate-700">Medications</span>
            </div>
            {activeMedications.length > 0 ? (
              <ul className="space-y-1">
                {activeMedications.slice(0, 3).map((med, index) => (
                  <li key={index} className="text-slate-700">
                    {med.name} {med.dosage}
                  </li>
                ))}
                {activeMedications.length > 3 && (
                  <li className="italic text-slate-500">+{activeMedications.length - 3} more</li>
                )}
              </ul>
            ) : (
              <p className="text-slate-500 italic">No active medications</p>
            )}
          </div>
          
          {/* Problems Section */}
          <div className="col-span-1">
            <div className="flex items-center gap-1 mb-1">
              <ClipboardList className="h-3 w-3 text-amber-500" />
              <span className="font-semibold text-slate-700">Problems</span>
            </div>
            {activeProblems.length > 0 ? (
              <ul className="space-y-1">
                {activeProblems.slice(0, 3).map((problem, index) => (
                  <li key={index} className="text-slate-700">
                    {problem.problem}
                  </li>
                ))}
                {activeProblems.length > 3 && (
                  <li className="italic text-slate-500">+{activeProblems.length - 3} more</li>
                )}
              </ul>
            ) : (
              <p className="text-slate-500 italic">No active problems</p>
            )}
          </div>
          
          {/* Recent Vitals Section */}
          <div className="col-span-1">
            <div className="flex items-center gap-1 mb-1">
              <Activity className="h-3 w-3 text-green-500" />
              <span className="font-semibold text-slate-700">Recent Vitals</span>
            </div>
            {mostRecentVitals ? (
              <div className="space-y-1">
                <p className="text-xs text-slate-500">
                  {new Date(mostRecentVitals.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  <p className="text-slate-700">Temp: {mostRecentVitals.temperature || '--'}</p>
                  <p className="text-slate-700">HR: {mostRecentVitals.heartRate || '--'}</p>
                  <p className="text-slate-700">BP: {formatBloodPressure(mostRecentVitals)}</p>
                  <p className="text-slate-700">SpO2: {mostRecentVitals.oxygenSaturation || '--'}%</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 italic">No recent vitals</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
