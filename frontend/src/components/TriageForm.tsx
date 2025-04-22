import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Patient, TriageData } from "../utils/mockData";
import { usePatientStore } from "../utils/patientStore";

interface TriageFormProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
  onSign: (data: any) => void;
}

export const TriageForm: React.FC<TriageFormProps> = ({
  isOpen,
  onClose,
  patientName,
  patientId,
  onSign,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("vitals");
  const patientStore = usePatientStore();
  
  // Get patient from store
  const patient = patientStore.patients.find(p => p.id === patientId);
  
  // Initialize with default triage data
  const [formData, setFormData] = useState<TriageData>({
    // Default values
    triageNurse: "Nurse Smith",
    triageTimestamp: new Date().toISOString(),
    temperatureRoute: "oral",
    bloodPressureSite: "right arm",
    oxygenDeliveryMethod: "room air",
    acuityLevel: 3,
    medicationReconciliationStatus: "pending"
  });
  
  // Load existing data if patient has triage data
  useEffect(() => {
    if (patient) {
      // Set the patient status to 'in-triage'
      if (patient.triageStatus !== 'triaged') {
        patientStore.updatePatient(patientId, {
          triageStatus: 'in-triage',
          lastUpdated: new Date().toISOString()
        });
      }
      
      // Load existing triage data if available
      if (patient.triageData) {
        setFormData({
          ...patient.triageData,
          // Make sure required fields exist
          chiefComplaint: patient.chiefComplaint || patient.triageData.chiefComplaint || "",
          triageImpression: patient.triageImpression || patient.triageData.triageImpression || "",
          triageTimestamp: patient.triageData.triageTimestamp || new Date().toISOString()
        });
      } else {
        // Initialize with patient's chief complaint if available
        setFormData(prev => ({
          ...prev,
          chiefComplaint: patient.chiefComplaint || "",
          triageImpression: patient.triageImpression || ""
        }));
      }
    }
  }, [patient, patientId, patientStore]);
  
  // Handle text inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle numeric inputs with validation
  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>, field: keyof TriageData) => {
    const value = e.target.value;
    if (value === "") {
      // Allow empty values
      setFormData(prev => ({
        ...prev,
        [field]: undefined
      }));
      return;
    }
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setFormData(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
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
    
    setFormData(prev => ({
      ...prev,
      currentMedications: [...(prev.currentMedications || []), newMedication]
    }));
  };
  
  // Handle updating a medication
  const handleUpdateMedication = (index: number, field: string, value: string) => {
    if (!formData.currentMedications) return;
    
    const updatedMedications = [...formData.currentMedications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      currentMedications: updatedMedications
    }));
  };
  
  // Handle removing a medication
  const handleRemoveMedication = (index: number) => {
    if (!formData.currentMedications) return;
    
    const updatedMedications = formData.currentMedications.filter((_, i) => i !== index);
    
    setFormData(prev => ({
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
    
    setFormData(prev => ({
      ...prev,
      allergies: [...(prev.allergies || []), newAllergy]
    }));
  };
  
  // Handle updating an allergy
  const handleUpdateAllergy = (index: number, field: string, value: any) => {
    if (!formData.allergies) return;
    
    const updatedAllergies = [...formData.allergies];
    updatedAllergies[index] = {
      ...updatedAllergies[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      allergies: updatedAllergies
    }));
  };
  
  // Handle removing an allergy
  const handleRemoveAllergy = (index: number) => {
    if (!formData.allergies) return;
    
    const updatedAllergies = formData.allergies.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      allergies: updatedAllergies
    }));
  };
  
  // Handle adding a new medical condition
  const handleAddCondition = () => {
    setFormData(prev => ({
      ...prev,
      medicalConditions: [...(prev.medicalConditions || []), ""]
    }));
  };
  
  // Handle updating a medical condition
  const handleUpdateCondition = (index: number, value: string) => {
    if (!formData.medicalConditions) return;
    
    const updatedConditions = [...formData.medicalConditions];
    updatedConditions[index] = value;
    
    setFormData(prev => ({
      ...prev,
      medicalConditions: updatedConditions
    }));
  };
  
  // Handle removing a medical condition
  const handleRemoveCondition = (index: number) => {
    if (!formData.medicalConditions) return;
    
    const updatedConditions = formData.medicalConditions.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      medicalConditions: updatedConditions
    }));
  };
  
  // Submit the triage form
  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.chiefComplaint) {
      toast.error("Chief complaint is required");
      setActiveTab("assessment");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update patient with triage data
      const now = new Date();
      const updates = {
        triageData: {
          ...formData,
          triageCompletedAt: now.toISOString(),
        },
        triageStatus: 'triaged' as 'not-triaged' | 'in-triage' | 'triaged',
        triageImpression: formData.triageImpression,
        chiefComplaint: formData.chiefComplaint,
        lastUpdated: now.toISOString()
      };
      
      // Save to the patient store
      await patientStore.updatePatient(patientId, updates);
      
      // Also pass the data to the onSign callback for any additional processing
      onSign({
        ...formData,
        timestamp: now.toISOString(),
        type: "triageForm",
        patientId
      });
      
      toast.success("Triage completed successfully");
      onClose();
    } catch (error) {
      console.error("Error saving triage data:", error);
      toast.error("Failed to save triage data");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-sky-800">
            ED Triage Assessment - {patientName}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="vitals" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="social">Social/Cultural</TabsTrigger>
          </TabsList>
          
          {/* Vital Signs Tab */}
          <TabsContent value="vitals" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Temperature */}
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <div className="flex gap-2">
                  <Input
                    id="temperature"
                    className="flex-1"
                    placeholder="98.6"
                    value={formData.temperature || ""}
                    onChange={(e) => handleNumericInput(e, "temperature")}
                  />
                  <Select
                    value={formData.temperatureRoute || "oral"}
                    onValueChange={(value) => handleSelectChange("temperatureRoute", value)}
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
                <Label htmlFor="heartRate">Heart Rate</Label>
                <Input
                  id="heartRate"
                  placeholder="80"
                  value={formData.heartRate || ""}
                  onChange={(e) => handleNumericInput(e, "heartRate")}
                />
              </div>

              {/* Blood Pressure */}
              <div className="space-y-2">
                <Label htmlFor="bloodPressure">Blood Pressure</Label>
                <div className="flex gap-2">
                  <Input
                    id="bloodPressureSystolic"
                    className="flex-1"
                    placeholder="120"
                    value={formData.bloodPressureSystolic || ""}
                    onChange={(e) => handleNumericInput(e, "bloodPressureSystolic")}
                  />
                  <span className="flex items-center">/</span>
                  <Input
                    id="bloodPressureDiastolic"
                    className="flex-1"
                    placeholder="80"
                    value={formData.bloodPressureDiastolic || ""}
                    onChange={(e) => handleNumericInput(e, "bloodPressureDiastolic")}
                  />
                  <Select
                    value={formData.bloodPressureSite || "right arm"}
                    onValueChange={(value) => handleSelectChange("bloodPressureSite", value)}
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
                <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                <Input
                  id="respiratoryRate"
                  placeholder="16"
                  value={formData.respiratoryRate || ""}
                  onChange={(e) => handleNumericInput(e, "respiratoryRate")}
                />
              </div>

              {/* Oxygen Saturation */}
              <div className="space-y-2">
                <Label htmlFor="oxygenSaturation">Oxygen Saturation</Label>
                <div className="flex gap-2">
                  <Input
                    id="oxygenSaturation"
                    className="flex-1"
                    placeholder="98"
                    value={formData.oxygenSaturation || ""}
                    onChange={(e) => handleNumericInput(e, "oxygenSaturation")}
                  />
                  <Select
                    value={formData.oxygenDeliveryMethod || "room air"}
                    onValueChange={(value) => handleSelectChange("oxygenDeliveryMethod", value)}
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
                  value={formData.painLevel !== undefined ? formData.painLevel : ""}
                  onChange={(e) => handleNumericInput(e, "painLevel")}
                />
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  placeholder="70"
                  value={formData.weight || ""}
                  onChange={(e) => handleNumericInput(e, "weight")}
                />
              </div>

              {/* Height */}
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  placeholder="170"
                  value={formData.height || ""}
                  onChange={(e) => handleNumericInput(e, "height")}
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
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
              
              {formData.allergies && formData.allergies.length > 0 ? (
                <div className="space-y-3">
                  {formData.allergies.map((allergy, index) => (
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
              
              {formData.medicalConditions && formData.medicalConditions.length > 0 ? (
                <div className="space-y-2">
                  {formData.medicalConditions.map((condition, index) => (
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
                value={formData.surgicalHistory || ""}
                onChange={handleInputChange}
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
                value={formData.familyHistory || ""}
                onChange={handleInputChange}
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
              
              {formData.currentMedications && formData.currentMedications.length > 0 ? (
                <div className="space-y-4">
                  {formData.currentMedications.map((medication, index) => (
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
                value={formData.medicationReconciliationStatus || "pending"}
                onValueChange={(value) => handleSelectChange("medicationReconciliationStatus", value)}
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
                value={formData.chiefComplaint || ""}
                onChange={handleInputChange}
                name="chiefComplaint"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="onsetOfSymptoms">Onset of Symptoms</Label>
              <Input
                id="onsetOfSymptoms"
                placeholder="When symptoms began"
                value={formData.onsetOfSymptoms || ""}
                onChange={handleInputChange}
                name="onsetOfSymptoms"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="symptomDescription">Symptom Description</Label>
              <Textarea
                id="symptomDescription"
                placeholder="Detailed description of symptoms"
                className="min-h-[100px]"
                value={formData.symptomDescription || ""}
                onChange={handleInputChange}
                name="symptomDescription"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="triageImpression">Triage Impression</Label>
              <Textarea
                id="triageImpression"
                placeholder="Nurse's initial assessment"
                className="min-h-[80px]"
                value={formData.triageImpression || ""}
                onChange={handleInputChange}
                name="triageImpression"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Acuity Level</Label>
              <RadioGroup 
                value={formData.acuityLevel?.toString() || "3"}
                onValueChange={(value) => handleSelectChange("acuityLevel", parseInt(value))}
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
                  value={formData.preferredLanguage || ""}
                  onChange={handleInputChange}
                  name="preferredLanguage"
                />
              </div>
              
              <div className="space-y-2 flex items-end pb-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="needsInterpreter"
                    checked={formData.needsInterpreter || false}
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
                value={formData.culturalConsiderations || ""}
                onChange={handleInputChange}
                name="culturalConsiderations"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="religiousConsiderations">Religious Considerations</Label>
              <Textarea
                id="religiousConsiderations"
                placeholder="Any religious factors affecting care"
                className="min-h-[80px]"
                value={formData.religiousConsiderations || ""}
                onChange={handleInputChange}
                name="religiousConsiderations"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mentalHealthStatus">Mental Health Status</Label>
              <Textarea
                id="mentalHealthStatus"
                placeholder="Current mental health status"
                className="min-h-[80px]"
                value={formData.mentalHealthStatus || ""}
                onChange={handleInputChange}
                name="mentalHealthStatus"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="substanceUseHistory">Substance Use History</Label>
              <Textarea
                id="substanceUseHistory"
                placeholder="Current or past substance use"
                className="min-h-[80px]"
                value={formData.substanceUseHistory || ""}
                onChange={handleInputChange}
                name="substanceUseHistory"
              />
            </div>
            
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("assessment")}>Back: Assessment</Button>
              <Button disabled={isSubmitting} onClick={handleSubmit}>
                {isSubmitting ? "Saving..." : "Complete Triage"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
            {isSubmitting ? "Saving..." : "Sign Triage Form"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};