const BeakerIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 3v4c0 1.1-.9 2-2 2H3" />
    <path d="M16 3v4c0 1.1.9 2 2 2h3" />
    <path d="M12 3v10" />
    <path d="M3 10v3c0 1.1.9 2 2 2h3" />
    <path d="M21 10v3c0 1.1-.9 2-2 2h-3" />
    <path d="M8 15h8" />
    <path d="M8 19h8" />
  </svg>
);import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, FileText, Pill, FlaskConical, Activity, User, MapPin, ClipboardList, Stethoscope, Image, Circle } from "lucide-react";
import { formatDateTime } from '../utils/formatting';

interface EncounterItem {
  id: string;
  type: "note" | "medication" | "lab" | "vitals" | "order" | "procedure" | "imaging";
  title: string;
  timestamp: string;
  details?: string;
  provider?: string;
  status?: string;
  encounterType?: string;
  location?: string;
  encounterDateTime?: string;
}

interface Encounter {
  id: string;
  type: string; // ED, Clinic, Inpatient, etc.
  startDateTime: string;
  endDateTime?: string;
  location: string;
  provider: string;
  reason: string;
  status: "active" | "completed" | "scheduled" | "cancelled";
  items: EncounterItem[];
}

interface EncounterThreadingProps {
  encounters: Encounter[];
  currentEncounterId?: string;
  onSelectEncounter?: (encounterId: string) => void;
  onViewItem?: (item: EncounterItem) => void;
}

export function EncounterThreading({
  encounters,
  currentEncounterId,
  onSelectEncounter,
  onViewItem
}: EncounterThreadingProps) {
  const [activeView, setActiveView] = useState<"thisEncounter" | "allTime">("thisEncounter");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  // Sort encounters by date (newest first)
  const sortedEncounters = [...encounters].sort(
    (a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()
  );
  
  const currentEncounter = currentEncounterId 
    ? encounters.find(e => e.id === currentEncounterId) 
    : sortedEncounters[0];
  
  const getItemsToDisplay = () => {
    if (!currentEncounter) return [];
    
    let items = activeView === "thisEncounter" 
      ? currentEncounter.items 
      : encounters.flatMap(e => e.items);
    
    // Filter by type if needed
    if (activeFilter !== "all") {
      items = items.filter(item => item.type === activeFilter);
    }
    
    // Sort by timestamp (newest first)
    return items.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };
  
  const getItemIcon = (type: string) => {
    switch(type) {
      case "note":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "medication":
        return <Pill className="h-4 w-4 text-purple-500" />;
      case "lab":
        return <BeakerIcon className="h-4 w-4 text-green-500" />;
      case "vitals":
        return <Activity className="h-4 w-4 text-red-500" />;
      case "order":
        return <ClipboardList className="h-4 w-4 text-amber-500" />;
      case "procedure":
        return <Stethoscope className="h-4 w-4 text-indigo-500" />;
      case "imaging":
        return <Image className="h-4 w-4 text-slate-500" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };
  
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch(status.toLowerCase()) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "active":
        return <Badge className="bg-blue-500">Active</Badge>;
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleItemClick = (item: EncounterItem) => {
    onViewItem?.(item);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-500" />
            <span>Patient Encounters</span>
          </CardTitle>
          
          <div className="flex gap-2">
            <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "thisEncounter" | "allTime")} className="h-8">
              <TabsList className="h-8">
                <TabsTrigger value="thisEncounter" className="h-8 text-xs">This Encounter</TabsTrigger>
                <TabsTrigger value="allTime" className="h-8 text-xs">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Encounter Selector */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Current Encounter:</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sortedEncounters.slice(0, 3).map(encounter => (
              <Button
                key={encounter.id}
                variant={encounter.id === (currentEncounter?.id || "") ? "default" : "outline"}
                className={`w-full h-auto py-2 px-3 justify-start items-start text-left ${encounter.id === (currentEncounter?.id || "") ? "bg-[#7b9d8f] hover:bg-[#c1632f]" : ""}`}
                onClick={() => onSelectEncounter?.(encounter.id)}
              >
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-1">
                    {encounter.type === "ED" && <Ambulance className="h-3.5 w-3.5" />}
                    {encounter.type === "Inpatient" && <BedIcon className="h-3.5 w-3.5" />}
                    {encounter.type === "Clinic" && <Stethoscope className="h-3.5 w-3.5" />}
                    <span className="font-medium">{encounter.type}</span>
                    {getStatusBadge(encounter.status)}
                  </div>
                  <div className="text-xs flex items-start gap-1">
                    <Clock className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>{formatDateTime(encounter.startDateTime)}</span>
                  </div>
                  <div className="text-xs flex items-start gap-1 mt-1">
                    <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>{encounter.location}</span>
                  </div>
                  <div className="text-xs flex items-start gap-1 mt-1">
                    <User className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>{encounter.provider}</span>
                  </div>
                </div>
              </Button>
            ))}
          </div>
          {sortedEncounters.length > 3 && (
            <Button variant="link" className="mt-1 h-6 p-0 text-xs text-blue-500">
              View {sortedEncounters.length - 3} more encounters
            </Button>
          )}
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            size="sm"
            className={`h-7 text-xs ${activeFilter === "all" ? "bg-[#7b9d8f] hover:bg-[#c1632f]" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All Items
          </Button>
          <Button
            variant={activeFilter === "note" ? "default" : "outline"}
            size="sm"
            className={`h-7 text-xs ${activeFilter === "note" ? "bg-[#7b9d8f] hover:bg-[#c1632f]" : ""}`}
            onClick={() => setActiveFilter("note")}
          >
            <FileText className="h-3 w-3 mr-1" />
            Notes
          </Button>
          <Button
            variant={activeFilter === "medication" ? "default" : "outline"}
            size="sm"
            className={`h-7 text-xs ${activeFilter === "medication" ? "bg-[#7b9d8f] hover:bg-[#c1632f]" : ""}`}
            onClick={() => setActiveFilter("medication")}
          >
            <Pill className="h-3 w-3 mr-1" />
            Medications
          </Button>
          <Button
            variant={activeFilter === "lab" ? "default" : "outline"}
            size="sm"
            className={`h-7 text-xs ${activeFilter === "lab" ? "bg-[#7b9d8f] hover:bg-[#c1632f]" : ""}`}
            onClick={() => setActiveFilter("lab")}
          >
            <FlaskConical className="h-3 w-3 mr-1" />
            Labs
          </Button>
          <Button
            variant={activeFilter === "vitals" ? "default" : "outline"}
            size="sm"
            className={`h-7 text-xs ${activeFilter === "vitals" ? "bg-[#7b9d8f] hover:bg-[#c1632f]" : ""}`}
            onClick={() => setActiveFilter("vitals")}
          >
            <Activity className="h-3 w-3 mr-1" />
            Vitals
          </Button>
        </div>
        
        {/* Timeline items */}
        <div className="space-y-3 mt-2">
          {getItemsToDisplay().length > 0 ? (
            getItemsToDisplay().map((item, index) => (
              <div 
                key={item.id} 
                className="flex items-start gap-3 border-b pb-3 last:border-0 cursor-pointer hover:bg-slate-50 p-2 rounded-md transition-colors"
                onClick={() => handleItemClick(item)}
              >
                <div className="mt-1">
                  {getItemIcon(item.type)}
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-1">
                    <div className="font-medium text-slate-800">{item.title}</div>
                    <div className="text-xs text-slate-500">{formatDateTime(item.timestamp)}</div>
                  </div>
                  {item.details && (
                    <p className="text-sm text-slate-600 mb-1">{item.details}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.provider && (
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {item.provider}
                      </div>
                    )}
                    {item.status && getStatusBadge(item.status)}
                    {(item.encounterType || item.location) && (
                      <Badge variant="outline" className="text-xs">
                        {item.encounterType}{item.encounterType && item.location ? ", " : ""}{item.location}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-500">
              No {activeFilter === "all" ? "items" : activeFilter + "s"} found for the{" "}
              {activeView === "thisEncounter" ? "current encounter" : "patient's history"}.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const Ambulance = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8h2a2 2 0 0 1 2 2v2m-4-4H2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>
    <circle cx="5" cy="17" r="1"/>
    <circle cx="17" cy="17" r="1"/>
    <path d="M10 6h4"/>
    <path d="M12 4v4"/>
  </svg>
);

const BedIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 4v16"/>
    <path d="M22 4v16"/>
    <path d="M2 8h20"/>
    <path d="M2 16h20"/>
  </svg>
);

const Stethoscope = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 15c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    <path d="M2 9a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5h-1a3 3 0 1 1-6 0H9"/>
    <path d="M7 9h10"/>
  </svg>
);

const ClipboardList = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <path d="M12 11h4"/>
    <path d="M12 16h4"/>
    <path d="M8 11h.01"/>
    <path d="M8 16h.01"/>
  </svg>
);

const Image = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polygon points="21 15 16 10 5 21"/>
  </svg>
);

const Circle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/>
  </svg>
);
