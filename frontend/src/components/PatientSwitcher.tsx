import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Users } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  room?: string;
  mrn?: string;
  status?: string;
}

interface PatientSwitcherProps {
  patients: Patient[];
  currentPatientId?: string;
}

export function PatientSwitcher({ patients, currentPatientId }: PatientSwitcherProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  const currentPatient = patients.find(p => p.id === currentPatientId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between h-8 bg-white border-slate-200"
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-500" />
            <span className="truncate">
              {currentPatient ? currentPatient.name : "Select Patient"}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search patients..." />
          <CommandEmpty>No patient found.</CommandEmpty>
          <CommandGroup heading="Recent Patients">
            {patients.map((patient) => (
              <CommandItem
                key={patient.id}
                value={patient.name}
                onSelect={() => {
                  navigate(`/patient-charts?id=${patient.id}`);
                  setOpen(false);
                }}
              >
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <Check
                      className={`mr-2 h-4 w-4 ${patient.id === currentPatientId ? "opacity-100" : "opacity-0"}`}
                    />
                    <span className="font-medium">{patient.name}</span>
                  </div>
                  {(patient.room || patient.mrn) && (
                    <div className="ml-6 text-xs text-slate-500">
                      {patient.room && <span>Room: {patient.room}</span>}
                      {patient.room && patient.mrn && <span> | </span>}
                      {patient.mrn && <span>MRN: {patient.mrn}</span>}
                    </div>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
