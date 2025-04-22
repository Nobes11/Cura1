import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pill, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

// Types
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  reconciled?: "continue" | "modify" | "discontinue" | null;
  reason?: string;
}

interface MedicationReconciliationProps {
  patientId: string;
  patientName: string;
  homeMedications: Medication[];
  onSave: (reconciliation: any) => void;
  onCancel: () => void;
}

export const MedicationReconciliation: React.FC<MedicationReconciliationProps> = ({
  patientId,
  patientName,
  homeMedications,
  onSave,
  onCancel
}) => {
  const [medications, setMedications] = useState<Medication[]>(homeMedications);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    name: "",
    dosage: "",
    frequency: "",
    route: "PO"
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const updateMedicationReconciliation = (id: string, field: string, value: any) => {
    setMedications(meds => 
      meds.map(med => 
        med.id === id ? { ...med, [field]: value } : med
      )
    );
  };

  const addNewMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.frequency) {
      toast.error("Please fill in all required fields");
      return; // Don't add incomplete medications
    }

    const newMed: Medication = {
      id: `med_${Date.now()}`,
      name: newMedication.name || "",
      dosage: newMedication.dosage || "",
      frequency: newMedication.frequency || "",
      route: newMedication.route || "PO",
      reconciled: "continue"
    };

    setMedications([...medications, newMed]);
    setNewMedication({
      name: "",
      dosage: "",
      frequency: "",
      route: "PO"
    });
    setShowAddForm(false);
    toast.success("Medication added");
  };

  const handleSave = () => {
    // Check if all medications have been reconciled
    const unreconciledMeds = medications.filter(med => !med.reconciled);
    if (unreconciledMeds.length > 0) {
      toast.warning(`Please reconcile all medications (${unreconciledMeds.length} remaining)`);
      return;
    }
    
    const reconciliation = {
      patientId,
      timestamp: new Date().toISOString(),
      medications: medications,
      provider: "Dr. Current User", // In a real app, this would be the logged-in user
      status: "completed"
    };
    
    toast.success("Medication reconciliation completed");
    onSave(reconciliation);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Medication Reconciliation for {patientName}</span>
          <Button 
            size="sm" 
            onClick={() => setShowAddForm(true)} 
            disabled={showAddForm}
          >
            <Pill className="h-4 w-4 mr-2" /> Add Medication
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <div className="border p-4 rounded-md mb-6">
            <h3 className="font-medium mb-3">Add New Medication</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="med-name">Medication Name</Label>
                <Input 
                  id="med-name" 
                  value={newMedication.name} 
                  onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                  placeholder="Medication name"
                />
              </div>
              <div>
                <Label htmlFor="med-dosage">Dosage</Label>
                <Input 
                  id="med-dosage" 
                  value={newMedication.dosage} 
                  onChange={(e) => setNewMedication({...newMedication, dosage: e.target.value})}
                  placeholder="e.g., 500mg"
                />
              </div>
              <div>
                <Label htmlFor="med-frequency">Frequency</Label>
                <Input 
                  id="med-frequency" 
                  value={newMedication.frequency} 
                  onChange={(e) => setNewMedication({...newMedication, frequency: e.target.value})}
                  placeholder="e.g., BID, Q8H"
                />
              </div>
              <div>
                <Label htmlFor="med-route">Route</Label>
                <Select 
                  value={newMedication.route} 
                  onValueChange={(value) => setNewMedication({...newMedication, route: value})}
                >
                  <SelectTrigger id="med-route">
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PO">PO (Oral)</SelectItem>
                    <SelectItem value="IV">IV (Intravenous)</SelectItem>
                    <SelectItem value="IM">IM (Intramuscular)</SelectItem>
                    <SelectItem value="SC">SC (Subcutaneous)</SelectItem>
                    <SelectItem value="SL">SL (Sublingual)</SelectItem>
                    <SelectItem value="PR">PR (Rectal)</SelectItem>
                    <SelectItem value="INH">INH (Inhaled)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button onClick={addNewMedication}>Add Medication</Button>
            </div>
          </div>
        )}
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medication</TableHead>
              <TableHead>Dosage</TableHead>
              <TableHead>Frequency/Route</TableHead>
              <TableHead>Continue</TableHead>
              <TableHead>Modify</TableHead>
              <TableHead>Discontinue</TableHead>
              <TableHead>Reason/Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-slate-500">
                  No medications available for reconciliation
                </TableCell>
              </TableRow>
            ) : (
              medications.map(med => (
                <TableRow key={med.id}>
                  <TableCell className="font-medium">{med.name}</TableCell>
                  <TableCell>{med.dosage}</TableCell>
                  <TableCell>{med.frequency} ({med.route})</TableCell>
                  <TableCell>
                    <Checkbox 
                      checked={med.reconciled === "continue"}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateMedicationReconciliation(med.id, "reconciled", "continue");
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox 
                      checked={med.reconciled === "modify"}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateMedicationReconciliation(med.id, "reconciled", "modify");
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox 
                      checked={med.reconciled === "discontinue"}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          updateMedicationReconciliation(med.id, "reconciled", "discontinue");
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      placeholder="Reason for change"
                      value={med.reason || ""}
                      onChange={(e) => updateMedicationReconciliation(med.id, "reason", e.target.value)}
                      className="h-8 text-sm"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <div className="mt-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <p className="text-sm text-slate-600">
            Medication reconciliation must be completed for all patients within 24 hours of admission.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>Complete Reconciliation</Button>
      </CardFooter>
    </Card>
  );
};