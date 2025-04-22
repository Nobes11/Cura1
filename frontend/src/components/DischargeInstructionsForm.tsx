import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DischargeInstructionsFormProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
  onSign: (data: any) => void;
}

export const DischargeInstructionsForm: React.FC<DischargeInstructionsFormProps> = ({
  isOpen,
  onClose,
  patientName,
  patientId,
  onSign,
}) => {
  const currentDate = new Date().toISOString().slice(0, 10);

  const [formData, setFormData] = useState({
    // Basic information
    dischargeDate: currentDate,
    dischargeDiagnosis: "",
    dischargeTime: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
    dischargedTo: "home", // home, facility, other
    transportMode: "self", // self, ambulance, family, other
    
    // Follow-up information
    followUp: {
      required: true,
      timeframe: "1-week", // 1-week, 2-weeks, 1-month, as-needed
      provider: "Primary care provider",
      specialInstructions: ""
    },
    
    // Medication instructions
    medications: [
      {
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        special: ""
      }
    ],
    
    // Activity restrictions
    activityRestrictions: {
      bedRest: false,
      limitedActivity: false,
      noHeavyLifting: false,
      noDriving: false,
      other: false,
      otherDescription: ""
    },
    
    // Diet
    diet: {
      regular: true,
      liquid: false,
      soft: false,
      lowSodium: false,
      diabetic: false,
      other: false,
      otherDescription: ""
    },
    
    // Wound care
    woundCare: {
      required: false,
      instructions: "",
      dressings: "",
      frequency: ""
    },
    
    // Return to ED instructions
    returnToED: "Return to the Emergency Department if you experience severe pain, fever over 101°F, difficulty breathing, increased swelling, redness or drainage from wounds, or any concerning symptoms.",
    
    // Additional information
    additionalInstructions: "",
    
    // Provider information
    providerName: "Dr. Patterson",
    providerSignature: true
  });

  const handleChange = (section: string, field: string, value: any) => {
    if (field.includes('.')) {
      const [subSection, subField] = field.split('.');
      setFormData({
        ...formData,
        [section]: {
          ...formData[section as keyof typeof formData],
          [subSection]: {
            ...(formData[section as keyof typeof formData] as any)[subSection],
            [subField]: value
          }
        }
      });
    } else {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section as keyof typeof formData],
          [field]: value,
        },
      });
    }
  };

  const handleTopLevelChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleMedicationChange = (index: number, field: string, value: string) => {
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
          name: "",
          dosage: "",
          frequency: "",
          duration: "",
          special: ""
        }
      ]
    });
  };

  const removeMedication = (index: number) => {
    const updatedMedications = [...formData.medications];
    updatedMedications.splice(index, 1);
    setFormData({
      ...formData,
      medications: updatedMedications
    });
  };

  const handleSubmit = () => {
    const timestamp = new Date().toISOString();
    const dischargeData = {
      ...formData,
      patientId,
      patientName,
      timestamp,
      type: "dischargeInstructions",
    };
    onSign(dischargeData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-sky-800">
            Discharge Instructions - {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Discharge Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dischargeDate" className="font-medium">Discharge Date</Label>
              <Input
                id="dischargeDate"
                type="date"
                value={formData.dischargeDate}
                onChange={(e) => handleTopLevelChange('dischargeDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dischargeTime" className="font-medium">Discharge Time</Label>
              <Input
                id="dischargeTime"
                type="time"
                value={formData.dischargeTime}
                onChange={(e) => handleTopLevelChange('dischargeTime', e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="dischargeDiagnosis" className="font-medium">Discharge Diagnosis</Label>
              <Input
                id="dischargeDiagnosis"
                placeholder="Primary diagnosis or reason for visit"
                value={formData.dischargeDiagnosis}
                onChange={(e) => handleTopLevelChange('dischargeDiagnosis', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dischargedTo" className="font-medium">Discharged To</Label>
              <Select
                value={formData.dischargedTo}
                onValueChange={(value) => handleTopLevelChange('dischargedTo', value)}
              >
                <SelectTrigger id="dischargedTo">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="skilled-nursing">Skilled Nursing Facility</SelectItem>
                  <SelectItem value="rehab">Rehabilitation Facility</SelectItem>
                  <SelectItem value="hospital">Another Hospital</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="transportMode" className="font-medium">Mode of Transport</Label>
              <Select
                value={formData.transportMode}
                onValueChange={(value) => handleTopLevelChange('transportMode', value)}
              >
                <SelectTrigger id="transportMode">
                  <SelectValue placeholder="Select transport" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">Self/Family</SelectItem>
                  <SelectItem value="ambulance">Ambulance</SelectItem>
                  <SelectItem value="wheelchair">Wheelchair Van</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Follow-up Section */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id="followUpRequired"
                checked={formData.followUp.required}
                onCheckedChange={(checked) => handleChange('followUp', 'required', !!checked)}
              />
              <Label htmlFor="followUpRequired" className="font-medium text-sky-700">Follow-up Required</Label>
            </div>
            
            {formData.followUp.required && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                <div>
                  <Label htmlFor="followUpTimeframe" className="font-medium">Timeframe</Label>
                  <Select
                    value={formData.followUp.timeframe}
                    onValueChange={(value) => handleChange('followUp', 'timeframe', value)}
                  >
                    <SelectTrigger id="followUpTimeframe">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24-hours">Within 24 hours</SelectItem>
                      <SelectItem value="48-hours">Within 48 hours</SelectItem>
                      <SelectItem value="1-week">Within 1 week</SelectItem>
                      <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                      <SelectItem value="1-month">Within 1 month</SelectItem>
                      <SelectItem value="as-needed">As needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="followUpProvider" className="font-medium">Provider</Label>
                  <Input
                    id="followUpProvider"
                    placeholder="e.g., Primary care provider, Specialist"
                    value={formData.followUp.provider}
                    onChange={(e) => handleChange('followUp', 'provider', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="followUpSpecialInstructions" className="font-medium">Special Instructions</Label>
                  <Textarea
                    id="followUpSpecialInstructions"
                    placeholder="Any special instructions for follow-up"
                    value={formData.followUp.specialInstructions}
                    onChange={(e) => handleChange('followUp', 'specialInstructions', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Medications */}
          <div>
            <h3 className="font-medium text-sky-700 mb-3">Medication Instructions</h3>
            {formData.medications.map((medication, index) => (
              <div key={index} className="border p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Medication #{index + 1}</h4>
                  {formData.medications.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeMedication(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-8 w-8"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`medicationName-${index}`} className="font-medium">Medication Name</Label>
                    <Input
                      id={`medicationName-${index}`}
                      placeholder="e.g., Acetaminophen"
                      value={medication.name}
                      onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`medicationDosage-${index}`} className="font-medium">Dosage</Label>
                    <Input
                      id={`medicationDosage-${index}`}
                      placeholder="e.g., 500mg"
                      value={medication.dosage}
                      onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`medicationFrequency-${index}`} className="font-medium">Frequency</Label>
                    <Input
                      id={`medicationFrequency-${index}`}
                      placeholder="e.g., Every 6 hours"
                      value={medication.frequency}
                      onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`medicationDuration-${index}`} className="font-medium">Duration</Label>
                    <Input
                      id={`medicationDuration-${index}`}
                      placeholder="e.g., 7 days"
                      value={medication.duration}
                      onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor={`medicationSpecial-${index}`} className="font-medium">Special Instructions</Label>
                    <Textarea
                      id={`medicationSpecial-${index}`}
                      placeholder="e.g., Take with food"
                      value={medication.special}
                      onChange={(e) => handleMedicationChange(index, 'special', e.target.value)}
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              type="button" 
              size="sm"
              onClick={addMedication}
              className="mt-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M12 5v14M5 12h14"></path></svg>
              Add Medication
            </Button>
          </div>

          {/* Activity Restrictions */}
          <div>
            <h3 className="font-medium text-sky-700 mb-3">Activity Restrictions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="bedRest"
                  checked={formData.activityRestrictions.bedRest}
                  onCheckedChange={(checked) => handleChange('activityRestrictions', 'bedRest', !!checked)}
                />
                <Label htmlFor="bedRest" className="font-medium">Bed Rest</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="limitedActivity"
                  checked={formData.activityRestrictions.limitedActivity}
                  onCheckedChange={(checked) => handleChange('activityRestrictions', 'limitedActivity', !!checked)}
                />
                <Label htmlFor="limitedActivity" className="font-medium">Limited Activity</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="noHeavyLifting"
                  checked={formData.activityRestrictions.noHeavyLifting}
                  onCheckedChange={(checked) => handleChange('activityRestrictions', 'noHeavyLifting', !!checked)}
                />
                <Label htmlFor="noHeavyLifting" className="font-medium">No Heavy Lifting</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="noDriving"
                  checked={formData.activityRestrictions.noDriving}
                  onCheckedChange={(checked) => handleChange('activityRestrictions', 'noDriving', !!checked)}
                />
                <Label htmlFor="noDriving" className="font-medium">No Driving</Label>
              </div>
              <div className="flex items-start space-x-2 md:col-span-2">
                <div className="flex h-5 items-center">
                  <Checkbox
                    id="otherActivityRestriction"
                    checked={formData.activityRestrictions.other}
                    onCheckedChange={(checked) => handleChange('activityRestrictions', 'other', !!checked)}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <Label htmlFor="otherActivityRestriction" className="font-medium">Other Restrictions</Label>
                  {formData.activityRestrictions.other && (
                    <div className="mt-1">
                      <Textarea
                        id="otherActivityRestrictionDescription"
                        placeholder="Describe other activity restrictions"
                        value={formData.activityRestrictions.otherDescription}
                        onChange={(e) => handleChange('activityRestrictions', 'otherDescription', e.target.value)}
                        className="min-h-[60px]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Diet */}
          <div>
            <h3 className="font-medium text-sky-700 mb-3">Diet Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="regularDiet"
                  checked={formData.diet.regular}
                  onCheckedChange={(checked) => handleChange('diet', 'regular', !!checked)}
                />
                <Label htmlFor="regularDiet" className="font-medium">Regular Diet</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="liquidDiet"
                  checked={formData.diet.liquid}
                  onCheckedChange={(checked) => handleChange('diet', 'liquid', !!checked)}
                />
                <Label htmlFor="liquidDiet" className="font-medium">Liquid Diet</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="softDiet"
                  checked={formData.diet.soft}
                  onCheckedChange={(checked) => handleChange('diet', 'soft', !!checked)}
                />
                <Label htmlFor="softDiet" className="font-medium">Soft Diet</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lowSodiumDiet"
                  checked={formData.diet.lowSodium}
                  onCheckedChange={(checked) => handleChange('diet', 'lowSodium', !!checked)}
                />
                <Label htmlFor="lowSodiumDiet" className="font-medium">Low Sodium Diet</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="diabeticDiet"
                  checked={formData.diet.diabetic}
                  onCheckedChange={(checked) => handleChange('diet', 'diabetic', !!checked)}
                />
                <Label htmlFor="diabeticDiet" className="font-medium">Diabetic Diet</Label>
              </div>
              <div className="flex items-start space-x-2">
                <div className="flex h-5 items-center">
                  <Checkbox
                    id="otherDiet"
                    checked={formData.diet.other}
                    onCheckedChange={(checked) => handleChange('diet', 'other', !!checked)}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <Label htmlFor="otherDiet" className="font-medium">Other Diet</Label>
                  {formData.diet.other && (
                    <div className="mt-1">
                      <Textarea
                        id="otherDietDescription"
                        placeholder="Describe other dietary recommendations"
                        value={formData.diet.otherDescription}
                        onChange={(e) => handleChange('diet', 'otherDescription', e.target.value)}
                        className="min-h-[60px]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Wound Care */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id="woundCareRequired"
                checked={formData.woundCare.required}
                onCheckedChange={(checked) => handleChange('woundCare', 'required', !!checked)}
              />
              <Label htmlFor="woundCareRequired" className="font-medium text-sky-700">Wound Care Instructions</Label>
            </div>
            
            {formData.woundCare.required && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                <div className="md:col-span-2">
                  <Label htmlFor="woundCareInstructions" className="font-medium">Care Instructions</Label>
                  <Textarea
                    id="woundCareInstructions"
                    placeholder="Detailed wound care instructions"
                    value={formData.woundCare.instructions}
                    onChange={(e) => handleChange('woundCare', 'instructions', e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <div>
                  <Label htmlFor="woundCareDressings" className="font-medium">Dressings</Label>
                  <Input
                    id="woundCareDressings"
                    placeholder="e.g., Sterile gauze, Non-adherent pad"
                    value={formData.woundCare.dressings}
                    onChange={(e) => handleChange('woundCare', 'dressings', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="woundCareFrequency" className="font-medium">Frequency</Label>
                  <Input
                    id="woundCareFrequency"
                    placeholder="e.g., Twice daily, Every 48 hours"
                    value={formData.woundCare.frequency}
                    onChange={(e) => handleChange('woundCare', 'frequency', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Return to ED Instructions */}
          <div>
            <Label htmlFor="returnToED" className="font-medium">Return to ED Instructions</Label>
            <Textarea
              id="returnToED"
              value={formData.returnToED}
              onChange={(e) => handleTopLevelChange('returnToED', e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Additional Instructions */}
          <div>
            <Label htmlFor="additionalInstructions" className="font-medium">Additional Instructions</Label>
            <Textarea
              id="additionalInstructions"
              placeholder="Any additional discharge instructions or patient education"
              value={formData.additionalInstructions}
              onChange={(e) => handleTopLevelChange('additionalInstructions', e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Provider Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="providerName" className="font-medium">Provider Name</Label>
              <Input
                id="providerName"
                value={formData.providerName}
                onChange={(e) => handleTopLevelChange('providerName', e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 mt-7">
              <Checkbox
                id="providerSignature"
                checked={formData.providerSignature}
                onCheckedChange={(checked) => handleTopLevelChange('providerSignature', !!checked)}
              />
              <Label htmlFor="providerSignature" className="cursor-pointer">
                I confirm these instructions are accurate and complete
              </Label>
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
            disabled={!formData.providerSignature || !formData.dischargeDiagnosis}
          >
            Sign & Print Instructions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
