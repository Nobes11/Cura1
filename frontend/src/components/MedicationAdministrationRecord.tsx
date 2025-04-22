import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus } from "lucide-react";

interface MedicationAdministrationRecordProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
  onSign: (data: any) => void;
}

interface MedicationDose {
  medicationName: string;
  dose: string;
  route: string;
  time: string;
  administeredBy: string;
  status: "administered" | "withheld" | "delayed" | "refused";
  notes: string;
}

export const MedicationAdministrationRecord: React.FC<MedicationAdministrationRecordProps> = ({
  isOpen,
  onClose,
  patientName,
  patientId,
  onSign,
}) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  const [formData, setFormData] = useState({
    // Record Information
    recordDate: currentDate,
    recordTime: currentTime,
    nurseName: "Jane Smith, RN", // In a real app, this would come from the logged-in user
    
    // Patient Information
    patientName,
    patientId,
    dateOfBirth: "1980-01-15", // Mock data
    weight: "70", // kg
    height: "175", // cm
    allergies: "Penicillin",
    
    // Medications
    medications: [
      {
        medicationName: "",
        dose: "",
        route: "IV", // IV, PO, IM, SQ, etc.
        time: currentTime,
        administeredBy: "Jane Smith, RN",
        status: "administered" as const,
        notes: ""
      }
    ]
  });

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleMedicationChange = (index: number, field: keyof MedicationDose, value: any) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      medications: updatedMedications
    });
  };
  
  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [
        ...formData.medications,
        {
          medicationName: "",
          dose: "",
          route: "IV",
          time: currentTime,
          administeredBy: formData.nurseName,
          status: "administered" as const,
          notes: ""
        }
      ]
    });
  };
  
  const removeMedication = (index: number) => {
    if (formData.medications.length > 1) {
      const updatedMedications = [...formData.medications];
      updatedMedications.splice(index, 1);
      
      setFormData({
        ...formData,
        medications: updatedMedications
      });
    }
  };

  const handleSubmit = () => {
    const timestamp = new Date().toISOString();
    const marData = {
      ...formData,
      type: "medicationAdministrationRecord",
      timestamp,
      authorName: formData.nurseName
    };
    onSign(marData);
    onClose();
  };

  // Determine if the form is valid for submission
  const isFormValid = formData.medications.every(med => 
    med.medicationName.trim() !== "" && 
    med.dose.trim() !== ""
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-sky-800">
            Medication Administration Record - {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Record Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-md">
            <div>
              <Label htmlFor="recordDate" className="font-medium">Record Date</Label>
              <Input
                id="recordDate"
                type="date"
                value={formData.recordDate}
                onChange={(e) => handleChange('recordDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="recordTime" className="font-medium">Record Time</Label>
              <Input
                id="recordTime"
                type="time"
                value={formData.recordTime}
                onChange={(e) => handleChange('recordTime', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="nurseName" className="font-medium">Nurse Name</Label>
              <Input
                id="nurseName"
                value={formData.nurseName}
                onChange={(e) => handleChange('nurseName', e.target.value)}
              />
            </div>
          </div>

          {/* Patient Information */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-md">
            <div>
              <Label className="text-sm text-slate-500">Patient Name</Label>
              <div className="font-medium">{patientName}</div>
            </div>
            <div>
              <Label className="text-sm text-slate-500">Patient ID</Label>
              <div className="font-medium">{patientId}</div>
            </div>
            <div>
              <Label className="text-sm text-slate-500">Date of Birth</Label>
              <div className="font-medium">{formData.dateOfBirth}</div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="allergies" className="text-sm text-slate-500">Allergies</Label>
              <Input
                id="allergies"
                value={formData.allergies}
                onChange={(e) => handleChange('allergies', e.target.value)}
                className="h-7 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="weight" className="text-sm text-slate-500">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                className="h-7 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="height" className="text-sm text-slate-500">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => handleChange('height', e.target.value)}
                className="h-7 text-sm"
              />
            </div>
          </div>

          {/* Medications */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-sky-700">Medications Administered</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addMedication}
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Medication
              </Button>
            </div>
            
            <div className="space-y-4">
              {formData.medications.map((medication, index) => (
                <div key={index} className="border rounded-md p-5 relative">
                  {formData.medications.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeMedication(index)}
                      className="absolute top-2 right-2 text-red-500 h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label htmlFor={`medication-${index}`} className="font-medium">Medication Name</Label>
                      <Input
                        id={`medication-${index}`}
                        placeholder="e.g., Morphine Sulfate"
                        value={medication.medicationName}
                        onChange={(e) => handleMedicationChange(index, 'medicationName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`dose-${index}`} className="font-medium">Dose</Label>
                      <Input
                        id={`dose-${index}`}
                        placeholder="e.g., 4mg"
                        value={medication.dose}
                        onChange={(e) => handleMedicationChange(index, 'dose', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`route-${index}`} className="font-medium">Route</Label>
                      <Select
                        value={medication.route}
                        onValueChange={(value) => handleMedicationChange(index, 'route', value)}
                      >
                        <SelectTrigger id={`route-${index}`}>
                          <SelectValue placeholder="Select route" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IV">IV (Intravenous)</SelectItem>
                          <SelectItem value="PO">PO (Oral)</SelectItem>
                          <SelectItem value="IM">IM (Intramuscular)</SelectItem>
                          <SelectItem value="SQ">SQ (Subcutaneous)</SelectItem>
                          <SelectItem value="PR">PR (Rectal)</SelectItem>
                          <SelectItem value="SL">SL (Sublingual)</SelectItem>
                          <SelectItem value="TD">TD (Transdermal)</SelectItem>
                          <SelectItem value="INH">INH (Inhalation)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`time-${index}`} className="font-medium">Time Administered</Label>
                      <Input
                        id={`time-${index}`}
                        type="time"
                        value={medication.time}
                        onChange={(e) => handleMedicationChange(index, 'time', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`administeredBy-${index}`} className="font-medium">Administered By</Label>
                      <Input
                        id={`administeredBy-${index}`}
                        value={medication.administeredBy}
                        onChange={(e) => handleMedicationChange(index, 'administeredBy', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`status-${index}`} className="font-medium">Status</Label>
                      <Select
                        value={medication.status}
                        onValueChange={(value: "administered" | "withheld" | "delayed" | "refused") => 
                          handleMedicationChange(index, 'status', value)
                        }
                      >
                        <SelectTrigger id={`status-${index}`}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="administered">Administered</SelectItem>
                          <SelectItem value="withheld">Withheld</SelectItem>
                          <SelectItem value="delayed">Delayed</SelectItem>
                          <SelectItem value="refused">Refused by Patient</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-3">
                      <Label htmlFor={`notes-${index}`} className="font-medium">Notes</Label>
                      <Textarea
                        id={`notes-${index}`}
                        placeholder="Any additional information about this medication administration"
                        value={medication.notes}
                        onChange={(e) => handleMedicationChange(index, 'notes', e.target.value)}
                        className="h-28"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="bg-green-600 hover:bg-green-700"
            disabled={!isFormValid}
            title={!isFormValid ? "Complete all required fields" : ""}
          >
            Sign & Save Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
