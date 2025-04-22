import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, AlertTriangle, PhoneCall } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Allergy {
  allergen: string;
  reaction: string;
  severity: "Mild" | "Moderate" | "Severe";
  noted: string;
}

interface HipaaContact {
  name: string;
  relationship: string;
  phone: string;
  authorized: boolean;
}

interface PatientHeaderProps {
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientMRN: string;
  roomNumber: string;
  allergies: Allergy[];
  dnrStatus: boolean;
  hipaaContacts: HipaaContact[];
  restrictedContacts?: HipaaContact[];
}

export const PatientHeader: React.FC<PatientHeaderProps> = ({
  patientName,
  patientAge,
  patientGender,
  patientMRN,
  roomNumber,
  allergies,
  dnrStatus,
  hipaaContacts,
  restrictedContacts = []
}) => {
  return (
    <div className="sticky top-0 z-50 w-full bg-amber-50 border-b border-amber-200 shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
          {/* Patient identifiers */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{patientName}</h1>
              <span className="text-sm text-slate-600">{patientAge} yr, {patientGender}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>MRN: {patientMRN}</span>
              <span>Room: {roomNumber}</span>
            </div>
          </div>

          {/* Clinical alerts */}
          <div className="flex items-center gap-4">
            {/* Allergies */}
            <div className="flex items-center gap-2">
              {allergies && allergies.length > 0 ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Allergies: {allergies.length}</span>
                        </Badge>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white p-2 max-w-xs">
                      <div className="text-sm space-y-1">
                        <p className="font-medium text-red-600">Allergies:</p>
                        <ul className="list-disc pl-4">
                          {allergies.map((allergy, idx) => (
                            <li key={idx}>
                              <span className="font-medium">{allergy.allergen}</span>: {allergy.reaction} ({allergy.severity})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200">
                  No Known Allergies
                </Badge>
              )}
            </div>

            {/* DNR Status */}
            {dnrStatus && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                <span>DNR</span>
              </Badge>
            )}
          </div>

          {/* HIPAA Information */}
          <div className="flex flex-col gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs border-teal-200 hover:bg-teal-100 text-teal-800 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    <span>HIPAA Info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-white p-2 max-w-xs">
                  <div className="text-sm space-y-2">
                    <div>
                      <p className="font-medium text-teal-700">Authorized Contacts:</p>
                      <ul className="list-disc pl-4">
                        {hipaaContacts.filter(c => c.authorized).map((contact, idx) => (
                          <li key={idx} className="flex items-center justify-between">
                            <span>{contact.name} ({contact.relationship})</span>
                            <span className="text-xs text-slate-500">{contact.phone}</span>
                          </li>
                        ))}
                      </ul>
                      {hipaaContacts.filter(c => c.authorized).length === 0 && (
                        <p className="text-xs italic text-slate-500">No authorized contacts</p>
                      )}
                    </div>
                    
                    {restrictedContacts.length > 0 && (
                      <div>
                        <p className="font-medium text-red-700">Restricted Contacts:</p>
                        <ul className="list-disc pl-4">
                          {restrictedContacts.map((contact, idx) => (
                            <li key={idx}>
                              <span className="text-red-600">{contact.name} ({contact.relationship})</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
