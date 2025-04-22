import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Props {
  patientName: string;
  currentPriority: "low" | "medium" | "high" | "urgent";
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPriority: "low" | "medium" | "high" | "urgent") => void;
}

export const PriorityDialog: React.FC<Props> = ({
  patientName,
  currentPriority,
  isOpen,
  onClose,
  onSave,
}) => {
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high" | "urgent">(currentPriority);

  const handleSave = () => {
    onSave(newPriority);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Priority for {patientName}</DialogTitle>
          <DialogDescription>
            Set the patient priority level based on clinical assessment.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup
            value={newPriority}
            onValueChange={(value) => setNewPriority(value as "low" | "medium" | "high" | "urgent")}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2 rounded-md p-2 hover:bg-slate-100">
              <RadioGroupItem value="urgent" id="urgent" />
              <Label
                htmlFor="urgent"
                className="flex flex-1 cursor-pointer items-center justify-between p-1 font-semibold text-red-600"
              >
                Urgent
                <span className="text-xs text-slate-500 font-normal">
                  Immediate attention needed
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-md p-2 hover:bg-slate-100">
              <RadioGroupItem value="high" id="high" />
              <Label
                htmlFor="high"
                className="flex flex-1 cursor-pointer items-center justify-between p-1 font-semibold text-amber-600"
              >
                High
                <span className="text-xs text-slate-500 font-normal">
                  Requires prompt attention
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-md p-2 hover:bg-slate-100">
              <RadioGroupItem value="medium" id="medium" />
              <Label
                htmlFor="medium"
                className="flex flex-1 cursor-pointer items-center justify-between p-1 font-semibold text-blue-600"
              >
                Medium
                <span className="text-xs text-slate-500 font-normal">
                  Can wait after high priority cases
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 rounded-md p-2 hover:bg-slate-100">
              <RadioGroupItem value="low" id="low" />
              <Label
                htmlFor="low"
                className="flex flex-1 cursor-pointer items-center justify-between p-1 font-semibold text-green-600"
              >
                Low
                <span className="text-xs text-slate-500 font-normal">
                  Non-urgent case
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
