import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Patient, TriageData } from "../utils/mockData";
import { usePatientStore } from "../utils/patientStore";

interface TriageCheckInFormProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}

export const TriageCheckInForm: React.FC<TriageCheckInFormProps> = ({
  isOpen,
  onClose,
  patient,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("intake");
  const patientStore = usePatientStore();
  
  // General form state for check-in data
  const [checkInData, setCheckInData] = useState({
    chiefComplaint: "",
    preferredPharmacy: "",
    arrivalMode: "ambulatory"
  });
  
  // Triage form data
  const [triageData, setTriageData] = useState<TriageData>({
    // Default values
    triageNurse: "Nurse Smith",
    triageTimestamp: new Date().toISOString(),
    temperatureRoute: "oral",
    bloodPressureSite: "right arm",
    oxygenDeliveryMethod: "room air",
    acuityLevel: 3,
    medicationReconciliationStatus: "pending"
  });

  // Handle text inputs for check-in data
  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCheckInData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes for check-in data
  const handleCheckInSelectChange = (name: string, value: string) => {
    setCheckInData(prev => ({ ...prev, [name]: value }));
  };
  
  // Initialize form data when patient changes
  useEffect(() => {
    if (patient) {
      setCheckInData({
        chiefComplaint: patient.chiefComplaint || "",
        preferredPharmacy: patient.preferredPharmacy || "",
        arrivalMode: patient.arrivalMode || "ambulatory"
      });
      
      // If patient has existing triage data, load it
      if (patient.triageData) {
        setTriageData({
          ...patient.triageData,
          chiefComplaint: patient.chiefComplaint || patient.triageData.chiefComplaint || "",
          triageImpression: patient.triageImpression || patient.triageData.triageImpression || "",
          triageTimestamp: patient.triageData.triageTimestamp || new Date().toISOString()
        });
      } else {
        // Initialize with patient's chief complaint if available
        setTriageData(prev => ({
          ...prev,
          chiefComplaint: patient.chiefComplaint || "",
          triageImpression: patient.triageImpression || ""
        }));
      }
    }
  }, [patient]);

  // Handle text inputs for triage data
  const handleTriageInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTriageData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle numeric inputs with validation for triage data
  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>, field: keyof TriageData) => {
    const value = e.target.value;
    if (value === "") {
      // Allow empty values
      setTriageData(prev => ({
        ...prev,
        [field]: undefined
      }));
      return;
    }
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setTriageData(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };
  
  // Handle select changes for triage data
  const handleTriageSelectChange = (name: string, value: any) => {
    setTriageData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle checkbox changes for triage data
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setTriageData(prev => ({ ...prev, [name]: checked }));
  };
  
  // Handle adding a new medication
  const handleAddMedication = () => {
    const newMedication = {
      name: "",
      dosage: "",
      frequency: "",
      route: "",
      lastTaken: ""
    };
    
    setTriageData(prev => ({
      ...prev,
      currentMedications: [...(prev.currentMedications || []), newMedication]
    }));
  };
  
  // Handle updating a medication
  const handleUpdateMedication = (index: number, field: string, value: string) => {
    if (!triageData.currentMedications) return;
    
    const updatedMedications = [...triageData.currentMedications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value
    };
    
    setTriageData(prev => ({
      ...prev,
      currentMedications: updatedMedications
    }));
  };
  
  // Handle removing a medication
  const handleRemoveMedication = (index: number) => {
    if (!triageData.currentMedications) return;
    
    const updatedMedications = triageData.currentMedications.filter((_, i) => i !== index);
    
    setTriageData(prev => ({
      ...prev,
      currentMedications: updatedMedications
    }));
  };
  
  // Handle adding a new allergy
  const handleAddAllergy = () => {
    const newAllergy = {
      allergen: "",
      reaction: "",
      severity: "mild" as "mild" | "moderate" | "severe"
    };
    
    setTriageData(prev => ({
      ...prev,
      allergies: [...(prev.allergies || []), newAllergy]
    }));
  };
  
  // Handle updating an allergy
  const handleUpdateAllergy = (index: number, field: string, value: any) => {
    if (!triageData.allergies) return;
    
    const updatedAllergies = [...triageData.allergies];
    updatedAllergies[index] = {
      ...updatedAllergies[index],
      [field]: value
    };
    
    setTriageData(prev => ({
      ...prev,
      allergies: updatedAllergies
    }));
  };
  
  // Handle removing an allergy
  const handleRemoveAllergy = (index: number) => {
    if (!triageData.allergies) return;
    
    const updatedAllergies = triageData.allergies.filter((_, i) => i !== index);
    
    setTriageData(prev => ({
      ...prev,
      allergies: updatedAllergies
    }));
  };
  
  // Handle adding a new medical condition
  const handleAddCondition = () => {
    setTriageData(prev => ({
      ...prev,
      medicalConditions: [...(prev.medicalConditions || []), ""]
    }));
  };
  
  // Handle updating a medical condition
  const handleUpdateCondition = (index: number, value: string) => {
    if (!triageData.medicalConditions) return;
    
    const updatedConditions = [...triageData.medicalConditions];
    updatedConditions[index] = value;
    
    setTriageData(prev => ({
      ...prev,
      medicalConditions: updatedConditions
    }));
  };
  
  // Handle removing a medical condition
  const handleRemoveCondition = (index: number) => {
    if (!triageData.medicalConditions) return;
    
    const updatedConditions = triageData.medicalConditions.filter((_, i) => i !== index);
    
    setTriageData(prev => ({
      ...prev,
      medicalConditions: updatedConditions
    }));
  };

  // Skip check-in and go straight to triage
  const handleSkipToTriage = () => {
    // First handle the check-in part
    if (!patient) return;
    
    if (!checkInData.chiefComplaint) {
      toast.error("Chief complaint is required");
      return;
    }
    
    // Update patient data with check-in info, but don't close the modal
    patientStore.updatePatient(patient.id, {
      ...checkInData,
      registrationStatus: "checked-in",
      triageStatus: "in-triage",
      status: "waiting",
      // Move from schedule to lobby
      room: "Lobby", 
      // Set current time as check-in time
      checkInTime: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    });
    
    // Move to vitals tab - the first step of triage
    setActiveTab("vitals");
  };
  
  // Check in patient (without triage)
  const handleCheckInOnly = async () => {
    if (!patient) return;
    
    if (!checkInData.chiefComplaint) {
      toast.error("Chief complaint is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update patient data
      await patientStore.updatePatient(patient.id, {
        ...checkInData,
        registrationStatus: "checked-in",
        triageStatus: "not-triaged",
        status: "waiting",
        // Move from schedule to lobby
        room: "Lobby", 
        // Set current time as check-in time
        checkInTime: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      });
      
      toast.success("Patient checked in successfully");
      onClose();
    } catch (error) {
      console.error("Error checking in patient:", error);
      toast.error("Failed to check in patient");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Submit the full triage form
  const handleCompleteTriageForm = async () => {
    // Validate required fields
    if (!triageData.chiefComplaint) {
      toast.error("Chief complaint is required");
      setActiveTab("assessment");
      return;
    }

    // Make sure vital signs are present
    if (!triageData.temperature || !triageData.heartRate || !triageData.bloodPressureSystolic || !triageData.bloodPressureDiastolic) {
      toast.error("Basic vital signs are required");
      setActiveTab("vitals");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format vital signs for display
      const bloodPressure = triageData.bloodPressureSystolic && triageData.bloodPressureDiastolic
        ? `${triageData.bloodPressureSystolic}/${triageData.bloodPressureDiastolic}`
        : undefined;
      
      // Add formatted vital signs for easier display on tracking board
      const triageDataWithFormatting = {
        ...triageData,
        vitals: {
          temperature: triageData.temperature,
          heartRate: triageData.heartRate,
          respiratoryRate: triageData.respiratoryRate,
          bloodPressure,
          oxygenSaturation: triageData.oxygenSaturation
        }
      };

      // Update patient with triage data
      const now = new Date();
      const updates = {
        triageData: {
          ...triageDataWithFormatting,
          triageCompletedAt: now.toISOString(),
        },
        triageStatus: 'triaged' as 'not-triaged' | 'in-triage' | 'triaged',
        triageImpression: triageData.triageImpression,
        chiefComplaint: triageData.chiefComplaint,
        registrationStatus: "triaged" as 'pending' | 'checked-in' | 'triaged',
        lastUpdated: now.toISOString()
      };
      
      // Save to the patient store
      await patientStore.updatePatient(patient?.id || "", updates);
      
      toast.success("Triage completed successfully");
      onClose();
    } catch (error) {
      console.error("Error saving triage data:", error);
      toast.error("Failed to save triage data");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!patient) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-sky-800">
            Patient Check-In & Triage - {patient.name}
          </DialogTitle>
          <DialogDescription>
            {activeTab === "intake" ? 
              "Check in the patient and record chief complaint" : 
              "Complete triage assessment for this patient"}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="intake">Intake</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="medications">Meds</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
          </TabsList>
          
          {/* Initial Check-in Tab */}
          <TabsContent value="intake" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="chiefComplaint">Chief Complaint <span className="text-red-500">*</span></Label>
              <Textarea
                id="chiefComplaint"
                name="chiefComplaint"
                placeholder="Reason for visit"
                value={checkInData.chiefComplaint}
                onChange={handleCheckInChange}
                className="min-h-[80px]"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredPharmacy">Preferred Pharmacy</Label>
                <Select
                  value={checkInData.preferredPharmacy}
                  onValueChange={(value) => handleCheckInSelectChange("preferredPharmacy", value)}
                >
                  <SelectTrigger id="preferredPharmacy">
                    <SelectValue placeholder="Select pharmacy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Walgreens - Main St">Walgreens - Main St</SelectItem>
                    <SelectItem value="CVS - Downtown">CVS - Downtown</SelectItem>
                    <SelectItem value="Rite Aid - Westside">Rite Aid - Westside</SelectItem>
                    <SelectItem value="Hospital Pharmacy">Hospital Pharmacy</SelectItem>
                    <SelectItem value="Community Drugs">Community Drugs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="arrivalMode">Arrival Mode</Label>
                <Select
                  value={checkInData.arrivalMode}
                  onValueChange={(value) => handleCheckInSelectChange("arrivalMode", value)}
                >
                  <SelectTrigger id="arrivalMode">
                    <SelectValue placeholder="Select arrival mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ambulatory">Ambulatory</SelectItem>
                    <SelectItem value="wheelchair">Wheelchair</SelectItem>
                    <SelectItem value="stretcher">Stretcher</SelectItem>
                    <SelectItem value="ambulance">Ambulance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={handleCheckInOnly}>
                  Check In Only
                </Button>
                <Button onClick={handleSkipToTriage}>
                  Continue to Triage
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Vital Signs Tab */}
          <TabsContent value="vitals" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Temperature */}
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature <span className="text-red-500">*</span></Label>
                <div className="flex gap-2">
                  <Input
                    id="temperature"
                    className="flex-1"
                    placeholder="98.6"
                    value={triageData.temperature || ""}
                    onChange={(e) => handleNumericInput(e, "temperature")}
                  />
                  <Select
                    value={triageData.temperatureRoute || "oral"}
                    onValueChange={(value) => handleTriageSelectChange("temperatureRoute", value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Route" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oral">Oral</SelectItem>
                      <SelectItem value="rectal">Rectal</SelectItem>
                      <SelectItem value="temporal">Temporal</SelectItem>
                      <SelectItem value="axillary">Axillary</SelectItem>
                      <SelectItem value="tympanic">Tympanic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Heart Rate */}
              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart Rate <span className="text-red-500">*</span></Label>
                <Input
                  id="heartRate"
                  placeholder="80"
                  value={triageData.heartRate || ""}
                  onChange={(e) => handleNumericInput(e, "heartRate")}
                />
              </div>

              {/* Blood Pressure */}
              <div className="space-y-2">
                <Label htmlFor="bloodPressure">Blood Pressure <span className="text-red-500">*</span></Label>
                <div className="flex gap-2">
                  <Input
                    id="bloodPressureSystolic"
                    className="flex-1"
                    placeholder="120"
                    value={triageData.bloodPressureSystolic || ""}
                    onChange={(e) => handleNumericInput(e, "bloodPressureSystolic")}
                  />
                  <span className="flex items-center">/</span>
                  <Input
                    id="bloodPressureDiastolic"
                    className="flex-1"
                    placeholder="80"
                    value={triageData.bloodPressureDiastolic || ""}
                    onChange={(e) => handleNumericInput(e, "bloodPressureDiastolic")}
                  />
                  <Select
                    value={triageData.bloodPressureSite || "right arm"}
                    onValueChange={(value) => handleTriageSelectChange("bloodPressureSite", value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Site" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="right arm">Right Arm</SelectItem>
                      <SelectItem value="left arm">Left Arm</SelectItem>
                      <SelectItem value="right leg">Right Leg</SelectItem>
                      <SelectItem value="left leg">Left Leg</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Respiratory Rate */}
              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">Respiratory Rate <span className="text-red-500">*</span></Label>
                <Input
                  id="respiratoryRate"
                  placeholder="16"
                  value={triageData.respiratoryRate || ""}
                  onChange={(e) => handleNumericInput(e, "respiratoryRate")}
                />
              </div>

              {/* Oxygen Saturation */}
              <div className="space-y-2">
                <Label htmlFor="oxygenSaturation">Oxygen Saturation <span className="text-red-500">*</span></Label>
                <div className="flex gap-2">
                  <Input
                    id="oxygenSaturation"
                    className="flex-1"
                    placeholder="98"
                    value={triageData.oxygenSaturation || ""}
                    onChange={(e) => handleNumericInput(e, "oxygenSaturation")}
                  />
                  <Select
                    value={triageData.oxygenDeliveryMethod || "room air"}
                    onValueChange={(value) => handleTriageSelectChange("oxygenDeliveryMethod", value)}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Delivery Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="room air">Room Air</SelectItem>
                      <SelectItem value="nasal cannula">Nasal Cannula</SelectItem>
                      <SelectItem value="mask">Mask</SelectItem>
                      <SelectItem value="ventilator">Ventilator</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pain Level */}
              <div className="space-y-2">
                <Label htmlFor="painLevel">Pain Level (0-10)</Label>
                <Input
                  id="painLevel"
                  placeholder="0"
                  type="number"
                  min="0"
                  max="10"
                  value={triageData.painLevel !== undefined ? triageData.painLevel : ""}
                  onChange={(e) => handleNumericInput(e, "painLevel")}
                />
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  placeholder="70"
                  value={triageData.weight || ""}
                  onChange={(e) => handleNumericInput(e, "weight")}
                />
              </div>

              {/* Height */}
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  placeholder="170"
                  value={triageData.height || ""}
                  onChange={(e) => handleNumericInput(e, "height")}
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("intake")}>Back: Intake</Button>
              <Button onClick={() => setActiveTab("history")}>Next: Medical History</Button>
            </div>
          </TabsContent>
          
          {/* Medical History Tab */}
          <TabsContent value="history" className="space-y-4 py-4">
            {/* Allergies Section */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Allergies</Label>
                <Button variant="outline" size="sm" onClick={handleAddAllergy}>
                  Add Allergy
                </Button>
              </div>
              
              {triageData.allergies && triageData.allergies.length > 0 ? (
                <div className="space-y-3">
                  {triageData.allergies.map((allergy, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4 pb-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor={`allergen-${index}`}>Allergen</Label>
                            <Input
                              id={`allergen-${index}`}
                              value={allergy.allergen}
                              onChange={(e) => handleUpdateAllergy(index, "allergen", e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`reaction-${index}`}>Reaction</Label>
                            <Input
                              id={`reaction-${index}`}
                              value={allergy.reaction}
                              onChange={(e) => handleUpdateAllergy(index, "reaction", e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`severity-${index}`}>Severity</Label>
                            <Select
                              value={allergy.severity}
                              onValueChange={(value) => handleUpdateAllergy(index, "severity", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select severity" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="mild">Mild</SelectItem>
                                <SelectItem value="moderate">Moderate</SelectItem>
                                <SelectItem value="severe">Severe</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end mt-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveAllergy(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 border border-dashed rounded-lg">
                  <p className="text-gray-500">No allergies recorded</p>
                </div>
              )}
            </div>
            
            {/* Medical Conditions Section */}
            <div className="space-y-2 mt-6">
              <div className="flex justify-between items-center">
                <Label>Medical Conditions</Label>
                <Button variant="outline" size="sm" onClick={handleAddCondition}>
                  Add Condition
                </Button>
              </div>
              
              {triageData.medicalConditions && triageData.medicalConditions.length > 0 ? (
                <div className="space-y-2">
                  {triageData.medicalConditions.map((condition, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={condition}
                        onChange={(e) => handleUpdateCondition(index, e.target.value)}
                        className="flex-1"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveCondition(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 border border-dashed rounded-lg">
                  <p className="text-gray-500">No medical conditions recorded</p>
                </div>
              )}
            </div>
            
            {/* Surgical History */}
            <div className="space-y-2 mt-6">
              <Label htmlFor="surgicalHistory">Surgical History</Label>
              <Textarea
                id="surgicalHistory"
                placeholder="List previous surgeries"
                className="min-h-[100px]"
                value={triageData.surgicalHistory || ""}
                onChange={handleTriageInputChange}
                name="surgicalHistory"
              />
            </div>

            {/* Family History */}
            <div className="space-y-2">
              <Label htmlFor="familyHistory">Family History</Label>
              <Textarea
                id="familyHistory"
                placeholder="Relevant family medical history"
                className="min-h-[80px]"
                value={triageData.familyHistory || ""}
                onChange={handleTriageInputChange}
                name="familyHistory"
              />
            </div>
            
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("vitals")}>Back: Vital Signs</Button>
              <Button onClick={() => setActiveTab("medications")}>Next: Medications</Button>
            </div>
          </TabsContent>
          
          {/* Medications Tab */}
          <TabsContent value="medications" className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Current Medications</Label>
                <Button variant="outline" size="sm" onClick={handleAddMedication}>
                  Add Medication
                </Button>
              </div>
              
              {triageData.currentMedications && triageData.currentMedications.length > 0 ? (
                <div className="space-y-4">
                  {triageData.currentMedications.map((medication, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4 pb-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor={`med-name-${index}`}>Medication Name</Label>
                            <Input
                              id={`med-name-${index}`}
                              value={medication.name}
                              onChange={(e) => handleUpdateMedication(index, "name", e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`med-dosage-${index}`}>Dosage</Label>
                            <Input
                              id={`med-dosage-${index}`}
                              value={medication.dosage}
                              onChange={(e) => handleUpdateMedication(index, "dosage", e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`med-frequency-${index}`}>Frequency</Label>
                            <Input
                              id={`med-frequency-${index}`}
                              value={medication.frequency}
                              onChange={(e) => handleUpdateMedication(index, "frequency", e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`med-route-${index}`}>Route</Label>
                            <Input
                              id={`med-route-${index}`}
                              value={medication.route}
                              onChange={(e) => handleUpdateMedication(index, "route", e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor={`med-last-taken-${index}`}>Last Taken</Label>
                            <Input
                              id={`med-last-taken-${index}`}
                              value={medication.lastTaken}
                              onChange={(e) => handleUpdateMedication(index, "lastTaken", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end mt-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveMedication(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 border border-dashed rounded-lg">
                  <p className="text-gray-500">No medications recorded</p>
                </div>
              )}
            </div>
            
            <div className="space-y-2 mt-6">
              <Label htmlFor="medicationReconciliationStatus">Medication Reconciliation Status</Label>
              <Select
                value={triageData.medicationReconciliationStatus || "pending"}
                onValueChange={(value) => handleTriageSelectChange("medicationReconciliationStatus", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("history")}>Back: Medical History</Button>
              <Button onClick={() => setActiveTab("assessment")}>Next: Assessment</Button>
            </div>
          </TabsContent>
          
          {/* Assessment Tab */}
          <TabsContent value="assessment" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="chiefComplaint">Chief Complaint <span className="text-red-500">*</span></Label>
              <Input
                id="chiefComplaint"
                placeholder="Primary reason for visit"
                value={triageData.chiefComplaint || ""}
                onChange={handleTriageInputChange}
                name="chiefComplaint"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="onsetOfSymptoms">Onset of Symptoms</Label>
              <Input
                id="onsetOfSymptoms"
                placeholder="When symptoms began"
                value={triageData.onsetOfSymptoms || ""}
                onChange={handleTriageInputChange}
                name="onsetOfSymptoms"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="symptomDescription">Symptom Description</Label>
              <Textarea
                id="symptomDescription"
                placeholder="Detailed description of symptoms"
                className="min-h-[100px]"
                value={triageData.symptomDescription || ""}
                onChange={handleTriageInputChange}
                name="symptomDescription"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="triageImpression">Triage Impression</Label>
              <Textarea
                id="triageImpression"
                placeholder="Nurse's initial assessment"
                className="min-h-[80px]"
                value={triageData.triageImpression || ""}
                onChange={handleTriageInputChange}
                name="triageImpression"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Acuity Level</Label>
              <RadioGroup 
                value={triageData.acuityLevel?.toString() || "3"}
                onValueChange={(value) => handleTriageSelectChange("acuityLevel", parseInt(value))}
                className="grid grid-cols-5 gap-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="acuity-1" />
                  <Label htmlFor="acuity-1" className="text-red-600 font-bold">1 - Resuscitation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="acuity-2" />
                  <Label htmlFor="acuity-2" className="text-orange-500 font-bold">2 - Emergent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="acuity-3" />
                  <Label htmlFor="acuity-3" className="text-yellow-500 font-bold">3 - Urgent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4" id="acuity-4" />
                  <Label htmlFor="acuity-4" className="text-green-500 font-bold">4 - Less Urgent</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5" id="acuity-5" />
                  <Label htmlFor="acuity-5" className="text-blue-500 font-bold">5 - Non-Urgent</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("medications")}>Back: Medications</Button>
              <Button onClick={() => setActiveTab("social")}>Next: Social Assessment</Button>
            </div>
          </TabsContent>
          
          {/* Social/Cultural Tab */}
          <TabsContent value="social" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preferredLanguage">Preferred Language</Label>
                <Input
                  id="preferredLanguage"
                  placeholder="Primary language"
                  value={triageData.preferredLanguage || ""}
                  onChange={handleTriageInputChange}
                  name="preferredLanguage"
                />
              </div>
              
              <div className="space-y-2 flex items-end pb-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="needsInterpreter"
                    checked={triageData.needsInterpreter || false}
                    onCheckedChange={(checked) => handleCheckboxChange("needsInterpreter", !!checked)}
                  />
                  <Label htmlFor="needsInterpreter">Needs Interpreter</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="culturalConsiderations">Cultural Considerations</Label>
              <Textarea
                id="culturalConsiderations"
                placeholder="Any cultural factors affecting care"
                className="min-h-[80px]"
                value={triageData.culturalConsiderations || ""}
                onChange={handleTriageInputChange}
                name="culturalConsiderations"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="religiousConsiderations">Religious Considerations</Label>
              <Textarea
                id="religiousConsiderations"
                placeholder="Any religious factors affecting care"
                className="min-h-[80px]"
                value={triageData.religiousConsiderations || ""}
                onChange={handleTriageInputChange}
                name="religiousConsiderations"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mentalHealthStatus">Mental Health Status</Label>
              <Textarea
                id="mentalHealthStatus"
                placeholder="Current mental health status"
                className="min-h-[80px]"
                value={triageData.mentalHealthStatus || ""}
                onChange={handleTriageInputChange}
                name="mentalHealthStatus"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="substanceUseHistory">Substance Use History</Label>
              <Textarea
                id="substanceUseHistory"
                placeholder="Current or past substance use"
                className="min-h-[80px]"
                value={triageData.substanceUseHistory || ""}
                onChange={handleTriageInputChange}
                name="substanceUseHistory"
              />
            </div>
            
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("assessment")}>Back: Assessment</Button>
              <Button disabled={isSubmitting} onClick={handleCompleteTriageForm} className="bg-green-600 hover:bg-green-700">
                {isSubmitting ? "Saving..." : "Complete Triage"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          {activeTab !== "intake" && (
            <Button onClick={handleCompleteTriageForm} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
              {isSubmitting ? "Saving..." : "Sign & Complete Triage"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
