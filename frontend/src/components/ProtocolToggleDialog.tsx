import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckSquare, Square } from "lucide-react";

interface Protocol {
  id: string;
  label: string;
  active: boolean;
}

interface Props {
  patientName: string;
  protocols: Protocol[];
  isOpen: boolean;
  onClose: () => void;
  onToggle: (protocolId: string) => void;
}

export const ProtocolToggleDialog: React.FC<Props> = ({
  patientName,
  protocols,
  isOpen,
  onClose,
  onToggle,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Manage Protocols for {patientName}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            {protocols.map((protocol) => (
              <div
                key={protocol.id}
                className="flex items-center justify-between p-3 rounded-md hover:bg-slate-50 cursor-pointer"
                onClick={() => onToggle(protocol.id)}
              >
                <div className="flex-1">
                  <div className="font-medium">{protocol.label}</div>
                  <div className="text-sm text-slate-500">
                    {protocol.active ? "Active" : "Inactive"}
                  </div>
                </div>
                <div className="text-sky-600">
                  {protocol.active ? (
                    <CheckSquare className="h-6 w-6" />
                  ) : (
                    <Square className="h-6 w-6" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
