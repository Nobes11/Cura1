import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Props {
  holdStatus?: boolean;
  consulted?: boolean;
  patientName: string;
  currentStatus: "waiting" | "in-progress" | "discharge-ready" | "discharged";
  isOpen: boolean;
  onClose: () => void;
  onSave: (newStatus: "waiting" | "in-progress" | "discharge-ready" | "discharged", holdStatus?: boolean, consulted?: boolean) => void;
}

export const StatusUpdateDialog: React.FC<Props> = ({
  patientName,
  currentStatus,
  holdStatus,
  consulted,
  isOpen,
  onClose,
  onSave,
}) => {
  const [newStatus, setNewStatus] = useState<"waiting" | "in-progress" | "discharge-ready" | "discharged">(currentStatus);
  const [isHolding, setIsHolding] = useState<boolean>(holdStatus || false);
  const [isConsulted, setIsConsulted] = useState<boolean>(consulted || false);

  const handleSave = () => {
    // Only pass the hold status if the patient is in-progress
    // This enables both setting and clearing the hold status
    const holdStatus = newStatus === "in-progress" ? isHolding : false;
    const consultedStatus = isConsulted; // Consult status can be applied regardless of patient status
    onSave(newStatus, holdStatus, consultedStatus);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Update Patient Status</DialogTitle>
          <DialogDescription>
            Change status for {patientName}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label>Select New Status</Label>
          <RadioGroup defaultValue={currentStatus} onValueChange={(value) => setNewStatus(value as any)}>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-slate-50">
              <RadioGroupItem value="waiting" id="waiting" />
              <Label htmlFor="waiting" className="cursor-pointer flex-1">
                <div className="font-medium">Waiting</div>
                <div className="text-sm text-slate-500">Patient is waiting to be seen</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-slate-50">
              <RadioGroupItem value="in-progress" id="in-progress" />
              <Label htmlFor="in-progress" className="cursor-pointer flex-1">
                <div className="font-medium">In Progress</div>
                <div className="text-sm text-slate-500">Patient is being evaluated or treated</div>
              </Label>
            </div>

            {newStatus === "in-progress" && (
              <div className="flex items-center space-x-2 ml-6 p-2 rounded bg-amber-50 border border-amber-200">
                <div className="flex items-center h-5">
                  <input
                    id="holding-status"
                    name="holding-status"
                    type="checkbox"
                    checked={isHolding}
                    onChange={(e) => setIsHolding(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                </div>
                <Label htmlFor="holding-status" className="cursor-pointer flex-1">
                  <div className="font-medium flex items-center">
                    <span className="mr-1">Holding</span>
                    <span className="bg-amber-500 text-white text-xs px-1 rounded-sm">HOLD</span>
                  </div>
                  <div className="text-xs text-slate-500">Patient is waiting for bed placement or admission</div>
                </Label>
              </div>
            )}

            {/* Consult Status Toggle - Available for any status */}
            <div className="flex items-center space-x-2 ml-6 p-2 rounded bg-blue-50 border border-blue-200">
              <div className="flex items-center h-5">
                <input
                  id="consult-status"
                  name="consult-status"
                  type="checkbox"
                  checked={isConsulted}
                  onChange={(e) => setIsConsulted(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <Label htmlFor="consult-status" className="cursor-pointer flex-1">
                <div className="font-medium flex items-center">
                  <span className="mr-1">Consulted</span>
                  <span className="bg-blue-500 text-white text-xs px-1 rounded-sm">CONSULT</span>
                </div>
                <div className="text-xs text-slate-500">Patient has been consulted or requires a specialty consult</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-slate-50">
              <RadioGroupItem value="discharge-ready" id="discharge-ready" />
              <Label htmlFor="discharge-ready" className="cursor-pointer flex-1">
                <div className="font-medium">Discharge Ready</div>
                <div className="text-sm text-slate-500">Patient is ready to be discharged</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-2 rounded hover:bg-slate-50">
              <RadioGroupItem value="discharged" id="discharged" />
              <Label htmlFor="discharged" className="cursor-pointer flex-1">
                <div className="font-medium">Discharged</div>
                <div className="text-sm text-slate-500">Patient has been discharged</div>
              </Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={newStatus === currentStatus && isHolding === (holdStatus || false) && isConsulted === (consulted || false)}>Update Status</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
