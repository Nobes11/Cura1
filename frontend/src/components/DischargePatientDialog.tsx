import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  patientName: string;
  isOpen: boolean;
  onClose: () => void;
  onDischarge: (notes: string) => void;
}

export const DischargePatientDialog: React.FC<Props> = ({
  patientName,
  isOpen,
  onClose,
  onDischarge,
}) => {
  const [dischargeNotes, setDischargeNotes] = useState("");
  const [tasksCompleted, setTasksCompleted] = useState({
    medicationReviewed: false,
    instructionsProvided: false,
    followUpScheduled: false,
    prescriptionsSent: false
  });

  const allTasksCompleted = Object.values(tasksCompleted).every(task => task);

  const handleDischarge = () => {
    onDischarge(dischargeNotes);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Discharge Patient</DialogTitle>
          <DialogDescription>
            Complete discharge process for {patientName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-3">
            <Label className="text-base font-medium">Discharge Checklist</Label>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="medicationReviewed" 
                  checked={tasksCompleted.medicationReviewed}
                  onCheckedChange={(checked) => 
                    setTasksCompleted({...tasksCompleted, medicationReviewed: checked as boolean})
                  }
                />
                <Label htmlFor="medicationReviewed" className="cursor-pointer">
                  Medication reviewed with patient
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="instructionsProvided" 
                  checked={tasksCompleted.instructionsProvided}
                  onCheckedChange={(checked) => 
                    setTasksCompleted({...tasksCompleted, instructionsProvided: checked as boolean})
                  }
                />
                <Label htmlFor="instructionsProvided" className="cursor-pointer">
                  Discharge instructions provided
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="followUpScheduled" 
                  checked={tasksCompleted.followUpScheduled}
                  onCheckedChange={(checked) => 
                    setTasksCompleted({...tasksCompleted, followUpScheduled: checked as boolean})
                  }
                />
                <Label htmlFor="followUpScheduled" className="cursor-pointer">
                  Follow-up appointment scheduled
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="prescriptionsSent" 
                  checked={tasksCompleted.prescriptionsSent}
                  onCheckedChange={(checked) => 
                    setTasksCompleted({...tasksCompleted, prescriptionsSent: checked as boolean})
                  }
                />
                <Label htmlFor="prescriptionsSent" className="cursor-pointer">
                  Prescriptions sent to pharmacy
                </Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dischargeNotes">Discharge Notes</Label>
            <Textarea
              id="dischargeNotes"
              placeholder="Enter any additional discharge notes..."
              value={dischargeNotes}
              onChange={(e) => setDischargeNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleDischarge} 
            disabled={!allTasksCompleted}
            title={!allTasksCompleted ? "Complete all checklist items first" : ""}
          >
            Complete Discharge
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
