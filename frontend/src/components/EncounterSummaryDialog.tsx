import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Patient } from "../utils/mockData";

interface EncounterSummaryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EncounterSummaryData) => void;
  patientData: Patient;
}

interface EncounterSummaryData {
  chiefComplaint: string;
  status: "waiting" | "in-progress" | "discharge-ready" | "discharged";
  priority: "low" | "medium" | "high" | "urgent";
  disposition?: "To Be Admitted" | "Discharge" | "Transfer" | null;
  notes?: string;
}

export const EncounterSummaryDialog: React.FC<EncounterSummaryDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  patientData
}) => {
  const [encounterData, setEncounterData] = useState<EncounterSummaryData>({
    chiefComplaint: patientData.chiefComplaint,
    status: patientData.status,
    priority: patientData.priority,
    disposition: patientData.disposition || null,
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEncounterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    onSave(encounterData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Encounter Summary</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="chiefComplaint" className="text-sm font-medium">Chief Complaint</label>
            <input
              id="chiefComplaint"
              name="chiefComplaint"
              className="w-full p-2 border rounded"
              value={encounterData.chiefComplaint}
              onChange={handleInputChange}
              placeholder="Chief complaint"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">Status</label>
            <select
              id="status"
              name="status"
              className="w-full p-2 border rounded"
              value={encounterData.status}
              onChange={handleInputChange}
            >
              <option value="waiting">Waiting</option>
              <option value="in-progress">In Progress</option>
              <option value="discharge-ready">Ready for Discharge</option>
              <option value="discharged">Discharged</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm font-medium">Priority</label>
            <select
              id="priority"
              name="priority"
              className="w-full p-2 border rounded"
              value={encounterData.priority}
              onChange={handleInputChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="disposition" className="text-sm font-medium">Disposition</label>
            <select
              id="disposition"
              name="disposition"
              className="w-full p-2 border rounded"
              value={encounterData.disposition || ""}
              onChange={handleInputChange}
            >
              <option value="">Not Set</option>
              <option value="To Be Admitted">To Be Admitted</option>
              <option value="Discharge">Discharge</option>
              <option value="Transfer">Transfer</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">Notes</label>
            <textarea
              id="notes"
              name="notes"
              className="w-full p-2 border rounded"
              value={encounterData.notes}
              onChange={handleInputChange}
              placeholder="Additional notes"
              rows={4}
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};