import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Patient } from "../utils/mockData";
import { Check, Edit, HandMetal, MapPin, User, ClipboardList, MessageSquare, AlertTriangle, Heart } from "lucide-react";

interface Props {
  children: React.ReactNode;
  patient: Patient;
  onAction: (action: string, patient: Patient) => void;
}

export const PatientContextMenu: React.FC<Props> = ({ children, patient, onAction }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel className="font-medium">
          {patient.name}
          <span className="block text-xs text-muted-foreground mt-1">
            {patient.age}y, {patient.gender} • Room {patient.room}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onAction("assignProvider", patient)}>
            <User className="mr-2 h-4 w-4" />
            <span>{patient.assignedProvider ? "Reassign Provider" : "Assign Provider"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction("updateLocation", patient)}>
            <MapPin className="mr-2 h-4 w-4" />
            <span>Update Location</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction("updateStatus", patient)}>
            <Edit className="mr-2 h-4 w-4" />
            <span>Update Status</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction("intriage", patient)}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            <span>Set In Triage</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onAction("placeOrders", patient)}>
            <ClipboardList className="mr-2 h-4 w-4" />
            <span>Place Orders</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction("addNote", patient)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Add Note</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction("toggleProtocol", patient)}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            <span>Toggle Protocol</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onAction("startDischarge", patient)}>
            <Check className="mr-2 h-4 w-4" />
            <span>Start Discharge</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction("escalate", patient)}>
            <HandMetal className="mr-2 h-4 w-4" />
            <span>Escalate</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAction("vitalSigns", patient)}>
            <Heart className="mr-2 h-4 w-4" />
            <span>Record Vital Signs</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
