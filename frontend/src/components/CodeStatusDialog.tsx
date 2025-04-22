import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Shield, Clock, User, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export interface CodeStatusHistoryEntry {
  timestamp: string;
  status: string;
  provider: string;
  reason: string;
  decisionMaker: string;
  decisionMakerRelationship?: string;
  decisionMakerContact?: string;
}

export interface CodeStatusData {
  status: "Full Code" | "DNR" | "DNR/DNI" | "Comfort Care Only";
  lastUpdated: string;
  updatedBy: string;
  reason?: string;
  decisionMaker?: string;
  decisionMakerRelationship?: string;
  decisionMakerContact?: string;
  history?: CodeStatusHistoryEntry[];
}

interface CodeStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  codeStatus: CodeStatusData;
  onSave: (updatedCodeStatus: CodeStatusData) => void;
  currentProvider: string;
}

export function CodeStatusDialog({
  open,
  onOpenChange,
  codeStatus,
  onSave,
  currentProvider,
}: CodeStatusDialogProps) {
  // Local state for form
  const [selectedStatus, setSelectedStatus] = useState<string>(codeStatus.status);
  const [reason, setReason] = useState<string>("");
  const [decisionMaker, setDecisionMaker] = useState<string>("");
  const [decisionMakerRelationship, setDecisionMakerRelationship] = useState<string>("");
  const [decisionMakerContact, setDecisionMakerContact] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  // Status hasn't changed if it's the same as current
  const statusChanged = selectedStatus !== codeStatus.status;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Reset form
  const resetForm = () => {
    setSelectedStatus(codeStatus.status);
    setReason("");
    setDecisionMaker("");
    setDecisionMakerRelationship("");
    setDecisionMakerContact("");
    setShowConfirmation(false);
  };

  // Handle cancel
  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!statusChanged) {
      onOpenChange(false);
      return;
    }

    // Validate form if status is changing
    if (!reason) {
      toast.error("Please provide a reason for the change");
      return;
    }

    if (selectedStatus !== "Full Code" && !decisionMaker) {
      toast.error("Please provide the medical decision maker information");
      return;
    }

    // Show confirmation before saving
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    // Create new history entry
    const newHistoryEntry: CodeStatusHistoryEntry = {
      timestamp: new Date().toISOString(),
      status: selectedStatus,
      provider: currentProvider,
      reason,
      decisionMaker,
      decisionMakerRelationship,
      decisionMakerContact,
    };

    // Create updated code status object
    const updatedCodeStatus: CodeStatusData = {
      status: selectedStatus as CodeStatusData["status"],
      lastUpdated: new Date().toISOString(),
      updatedBy: currentProvider,
      reason,
      decisionMaker,
      decisionMakerRelationship,
      decisionMakerContact,
      history: [...(codeStatus.history || []), newHistoryEntry],
    };

    // Save changes
    onSave(updatedCodeStatus);
    toast.success(`Code status updated to ${selectedStatus}`);
    resetForm();
    onOpenChange(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Full Code":
        return <Badge className="bg-green-500">Full Code</Badge>;
      case "DNR":
        return <Badge className="bg-red-500">DNR</Badge>;
      case "DNR/DNI":
        return <Badge className="bg-red-500">DNR/DNI</Badge>;
      case "Comfort Care Only":
        return <Badge className="bg-yellow-500">Comfort Care Only</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Code Status Management
          </DialogTitle>
          <DialogDescription>
            Update patient code status with appropriate documentation and approvals
          </DialogDescription>
        </DialogHeader>

        {!showConfirmation ? (
          <div className="space-y-6">
            {/* Current Status Display */}
            <div className="bg-slate-50 p-4 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-slate-700" />
                <h3 className="font-medium">Current Status</h3>
                {getStatusBadge(codeStatus.status)}
              </div>
              <div className="text-sm text-slate-600 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Last updated: {formatDate(codeStatus.lastUpdated)} by {codeStatus.updatedBy}
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <Label className="text-base font-medium">Select Code Status</Label>
              <RadioGroup 
                className="mt-2 space-y-3" 
                value={selectedStatus} 
                onValueChange={setSelectedStatus}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Full Code" id="fullcode" />
                  <Label htmlFor="fullcode" className="cursor-pointer flex-1 font-normal">
                    <div className="flex items-center gap-1">
                      Full Code
                      <Badge className="bg-green-100 text-green-800 border-green-300 ml-1">Default</Badge>
                    </div>
                    <p className="text-sm text-slate-500">Full resuscitative efforts including CPR, intubation, and medications</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="DNR" id="dnr" />
                  <Label htmlFor="dnr" className="cursor-pointer flex-1 font-normal">
                    <div>DNR (Do Not Resuscitate)</div>
                    <p className="text-sm text-slate-500">No chest compressions or cardiac resuscitation, may include intubation</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="DNR/DNI" id="dnrdni" />
                  <Label htmlFor="dnrdni" className="cursor-pointer flex-1 font-normal">
                    <div>DNR/DNI (Do Not Resuscitate/Intubate)</div>
                    <p className="text-sm text-slate-500">No chest compressions, cardiac resuscitation, or intubation</p>
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Comfort Care Only" id="comfort" />
                  <Label htmlFor="comfort" className="cursor-pointer flex-1 font-normal">
                    <div>Comfort Care Only</div>
                    <p className="text-sm text-slate-500">Focus on comfort measures and symptom management only</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Documentation Section - only shown if status is changing */}
            {statusChanged && (
              <div className="space-y-4">
                <Separator />
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                  <h3 className="font-medium text-amber-700">Changing code status requires documentation</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="reason">Reason for Change <span className="text-red-500">*</span></Label>
                    <Textarea 
                      id="reason" 
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Document clinical reasoning for code status change"
                      className="mt-1"
                      rows={2}
                    />
                  </div>

                  {selectedStatus !== "Full Code" && (
                    <>
                      <div className="pt-1">
                        <Label>Medical Decision Maker <span className="text-red-500">*</span></Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                          <div>
                            <Input 
                              placeholder="Name"
                              value={decisionMaker}
                              onChange={(e) => setDecisionMaker(e.target.value)}
                            />
                          </div>
                          <div>
                            <Input 
                              placeholder="Relationship to Patient"
                              value={decisionMakerRelationship}
                              onChange={(e) => setDecisionMakerRelationship(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="mt-2">
                          <Input 
                            placeholder="Contact Information"
                            value={decisionMakerContact}
                            onChange={(e) => setDecisionMakerContact(e.target.value)}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-md text-blue-800 text-sm mt-2">
                    <User className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <div>Changes will be recorded as made by: <strong>{currentProvider}</strong></div>
                  </div>
                </div>
              </div>
            )}

            {/* History Section */}
            {codeStatus.history && codeStatus.history.length > 0 && (
              <div className="pt-2">
                <Separator className="mb-3" />
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-slate-600" />
                  <h3 className="font-medium text-sm">Code Status History</h3>
                </div>
                <div className="max-h-40 overflow-y-auto text-sm space-y-2">
                  {codeStatus.history.slice().reverse().map((entry, index) => (
                    <div key={index} className="border-l-2 border-slate-300 pl-3 py-1">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{entry.status}</span>
                        <span className="text-slate-500 text-xs">• {formatDate(entry.timestamp)}</span>
                      </div>
                      <div className="text-xs text-slate-600">Changed by {entry.provider}</div>
                      <div className="text-xs text-slate-600 italic mt-1">Reason: {entry.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Confirmation View */
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Please confirm code status change</h3>
                  <p className="text-sm text-amber-700">You are about to change the patient's code status from <strong>{codeStatus.status}</strong> to <strong>{selectedStatus}</strong>.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-md p-4 space-y-3">
              <div>
                <h4 className="text-sm font-medium">New Status</h4>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(selectedStatus)}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium">Reason for Change</h4>
                <p className="text-sm text-slate-700 mt-1">{reason}</p>
              </div>

              {selectedStatus !== "Full Code" && decisionMaker && (
                <div>
                  <h4 className="text-sm font-medium">Medical Decision Maker</h4>
                  <div className="text-sm text-slate-700 mt-1">
                    <p>{decisionMaker}{decisionMakerRelationship ? ` (${decisionMakerRelationship})` : ''}</p>
                    {decisionMakerContact && <p className="text-xs text-slate-600 mt-0.5">{decisionMakerContact}</p>}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium">Provider Making Change</h4>
                <p className="text-sm text-slate-700 mt-1">{currentProvider}</p>
              </div>
            </div>

            <div className="text-sm text-slate-600 italic">
              This change will be permanently documented in the patient's medical record with a timestamp and cannot be deleted.
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>

          {showConfirmation ? (
            <>
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                Edit Changes
              </Button>
              <Button variant="destructive" onClick={handleSubmit}>
                Confirm Change
              </Button>
            </>
          ) : (
            <Button onClick={handleSubmit} disabled={!statusChanged}>
              {statusChanged ? "Review Change" : "Close"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
