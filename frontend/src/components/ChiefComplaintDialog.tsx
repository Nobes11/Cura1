import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  patientName: string;
  chiefComplaint: string;
  triageImpression: string | undefined;
  isOpen: boolean;
  onClose: () => void;
  onSave: (chiefComplaint: string, triageImpression: string) => void;
}

export const ChiefComplaintDialog: React.FC<Props> = ({
  patientName,
  chiefComplaint,
  triageImpression,
  isOpen,
  onClose,
  onSave,
}) => {
  const [complaint, setComplaint] = useState(chiefComplaint || "");
  const [isComplaintEditable, setIsComplaintEditable] = useState(false);
  const [impression, setImpression] = useState(triageImpression || "");

  const handleSave = () => {
    if (complaint.trim()) {
      onSave(complaint, impression);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Complaint & Triage for {patientName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="chief-complaint">Chief Complaint</Label>
            <div className="relative">
              <Textarea
                id="chief-complaint"
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                placeholder="Enter patient's chief complaint"
                readOnly={!isComplaintEditable}
                className={!isComplaintEditable ? "bg-slate-50" : ""}
              />
              <div className="absolute right-2 top-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0"
                  onClick={() => setIsComplaintEditable(!isComplaintEditable)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                </Button>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="triage-impression">Triage Impression</Label>
            <Textarea
              id="triage-impression"
              value={impression}
              onChange={(e) => setImpression(e.target.value)}
              placeholder="Enter triage clinical impression"
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={!complaint.trim()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
