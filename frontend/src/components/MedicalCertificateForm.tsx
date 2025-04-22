import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface MedicalCertificateFormProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
  onSign: (data: any) => void;
}

export const MedicalCertificateForm: React.FC<MedicalCertificateFormProps> = ({
  isOpen,
  onClose,
  patientName,
  patientId,
  onSign,
}) => {
  const currentDate = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    // Certificate Information
    certificateDate: currentDate,
    certificateType: "medical", // medical, fitness, school
    validFrom: currentDate,
    validTo: "", // If blank, it's indefinite
    
    // Patient Information
    patientName,
    patientId,
    dateOfBirth: "1980-01-15", // Mock data
    
    // Medical Information
    diagnosis: "",
    diagnosisICD10: "", // Optional ICD-10 code
    condition: "",
    
    // Certification Details
    certificationType: "illness", // illness, injury, surgery, pregnancy, other
    certificateStatement: "",
    
    // Work/School Related
    absenceRequired: false,
    absenceFrom: "",
    absenceTo: "",
    
    // Activity Restrictions
    activityRestrictions: {
      noHeavyLifting: false,
      noSportsActivities: false,
      limitedStanding: false,
      limitedSitting: false,
      other: false,
      otherDescription: ""
    },
    
    // Return Details
    returnDetails: {
      canReturn: "full", // full, restricted, unable
      returnDate: "",
      restrictions: "",
      followUpRequired: false,
      followUpDate: ""
    },
    
    // Additional Information
    additionalInformation: "",
    
    // Provider Information
    providerName: "Dr. Patterson",
    providerTitle: "Emergency Physician",
    providerLicense: "MD12345",
    providerSignature: false
  });

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleNestedChange = (section: string, field: string, value: any) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section as keyof typeof formData],
        [field]: value,
      },
    });
  };

  const handleSubmit = () => {
    const timestamp = new Date().toISOString();
    const certificateData = {
      ...formData,
      type: "medicalCertificate",
      timestamp,
      authorName: formData.providerName
    };
    onSign(certificateData);
    onClose();
  };

  // Determine if the form is valid for submission
  const isFormValid = 
    formData.diagnosis && 
    formData.certificateStatement &&
    formData.providerSignature;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-sky-800">
            Medical Certificate - {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Certificate Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-md">
            <div>
              <Label htmlFor="certificateDate" className="font-medium">Certificate Date</Label>
              <Input
                id="certificateDate"
                type="date"
                value={formData.certificateDate}
                onChange={(e) => handleChange('certificateDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="certificateType" className="font-medium">Certificate Type</Label>
              <Select
                value={formData.certificateType}
                onValueChange={(value) => handleChange('certificateType', value)}
              >
                <SelectTrigger id="certificateType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medical">Medical Certificate</SelectItem>
                  <SelectItem value="fitness">Fitness to Work/Return</SelectItem>
                  <SelectItem value="school">School Absence</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="validFrom" className="font-medium">Valid From</Label>
              <Input
                id="validFrom"
                type="date"
                value={formData.validFrom}
                onChange={(e) => handleChange('validFrom', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="validTo" className="font-medium">Valid To (leave blank if indefinite)</Label>
              <Input
                id="validTo"
                type="date"
                value={formData.validTo}
                onChange={(e) => handleChange('validTo', e.target.value)}
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
          </div>

          {/* Medical Information */}
          <div>
            <h3 className="font-medium text-sky-700 mb-3">Medical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="diagnosis" className="font-medium">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  placeholder="Primary medical diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) => handleChange('diagnosis', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="diagnosisICD10" className="font-medium">ICD-10 Code (optional)</Label>
                <Input
                  id="diagnosisICD10"
                  placeholder="e.g., J45.909"
                  value={formData.diagnosisICD10}
                  onChange={(e) => handleChange('diagnosisICD10', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="condition" className="font-medium">Medical Condition</Label>
                <Textarea
                  id="condition"
                  placeholder="Description of the medical condition"
                  value={formData.condition}
                  onChange={(e) => handleChange('condition', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>

          {/* Certification Details */}
          <div>
            <h3 className="font-medium text-sky-700 mb-3">Certification Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="certificationType" className="font-medium">Type of Certification</Label>
                <RadioGroup
                  value={formData.certificationType}
                  onValueChange={(value) => handleChange('certificationType', value)}
                  className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="illness" id="cert-illness" />
                    <Label htmlFor="cert-illness">Illness</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="injury" id="cert-injury" />
                    <Label htmlFor="cert-injury">Injury</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="surgery" id="cert-surgery" />
                    <Label htmlFor="cert-surgery">Surgery</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pregnancy" id="cert-pregnancy" />
                    <Label htmlFor="cert-pregnancy">Pregnancy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="cert-other" />
                    <Label htmlFor="cert-other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div>
                <Label htmlFor="certificateStatement" className="font-medium">Certificate Statement</Label>
                <Textarea
                  id="certificateStatement"
                  placeholder="Official statement for the certificate"
                  value={formData.certificateStatement}
                  onChange={(e) => handleChange('certificateStatement', e.target.value)}
                  className="min-h-[80px]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Work/School Related */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id="absenceRequired"
                checked={formData.absenceRequired}
                onCheckedChange={(checked) => handleChange('absenceRequired', !!checked)}
              />
              <Label htmlFor="absenceRequired" className="font-medium text-sky-700">Absence from Work/School Required</Label>
            </div>
            
            {formData.absenceRequired && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                <div>
                  <Label htmlFor="absenceFrom" className="font-medium">Absence Start Date</Label>
                  <Input
                    id="absenceFrom"
                    type="date"
                    value={formData.absenceFrom}
                    onChange={(e) => handleChange('absenceFrom', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="absenceTo" className="font-medium">Absence End Date</Label>
                  <Input
                    id="absenceTo"
                    type="date"
                    value={formData.absenceTo}
                    onChange={(e) => handleChange('absenceTo', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Activity Restrictions */}
          <div>
            <h3 className="font-medium text-sky-700 mb-3">Activity Restrictions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="noHeavyLifting"
                  checked={formData.activityRestrictions.noHeavyLifting}
                  onCheckedChange={(checked) => handleNestedChange('activityRestrictions', 'noHeavyLifting', !!checked)}
                />
                <Label htmlFor="noHeavyLifting" className="font-medium">No Heavy Lifting</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="noSportsActivities"
                  checked={formData.activityRestrictions.noSportsActivities}
                  onCheckedChange={(checked) => handleNestedChange('activityRestrictions', 'noSportsActivities', !!checked)}
                />
                <Label htmlFor="noSportsActivities" className="font-medium">No Sports Activities</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="limitedStanding"
                  checked={formData.activityRestrictions.limitedStanding}
                  onCheckedChange={(checked) => handleNestedChange('activityRestrictions', 'limitedStanding', !!checked)}
                />
                <Label htmlFor="limitedStanding" className="font-medium">Limited Standing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="limitedSitting"
                  checked={formData.activityRestrictions.limitedSitting}
                  onCheckedChange={(checked) => handleNestedChange('activityRestrictions', 'limitedSitting', !!checked)}
                />
                <Label htmlFor="limitedSitting" className="font-medium">Limited Sitting</Label>
              </div>
              <div className="flex items-start space-x-2 md:col-span-2">
                <div className="flex h-5 items-center">
                  <Checkbox
                    id="otherRestriction"
                    checked={formData.activityRestrictions.other}
                    onCheckedChange={(checked) => handleNestedChange('activityRestrictions', 'other', !!checked)}
                  />
                </div>
                <div className="flex flex-col w-full">
                  <Label htmlFor="otherRestriction" className="font-medium">Other Restrictions</Label>
                  {formData.activityRestrictions.other && (
                    <div className="mt-1">
                      <Textarea
                        id="otherRestrictionDescription"
                        placeholder="Describe other activity restrictions"
                        value={formData.activityRestrictions.otherDescription}
                        onChange={(e) => handleNestedChange('activityRestrictions', 'otherDescription', e.target.value)}
                        className="min-h-[60px]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Return Details */}
          <div>
            <h3 className="font-medium text-sky-700 mb-3">Return to Work/School Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="canReturn" className="font-medium">Return Status</Label>
                <RadioGroup
                  value={formData.returnDetails.canReturn}
                  onValueChange={(value) => handleNestedChange('returnDetails', 'canReturn', value)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="full" id="return-full" />
                    <Label htmlFor="return-full">Full Return</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="restricted" id="return-restricted" />
                    <Label htmlFor="return-restricted">Restricted Return</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unable" id="return-unable" />
                    <Label htmlFor="return-unable">Unable to Return</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {formData.returnDetails.canReturn !== 'unable' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="returnDate" className="font-medium">Return Date</Label>
                    <Input
                      id="returnDate"
                      type="date"
                      value={formData.returnDetails.returnDate}
                      onChange={(e) => handleNestedChange('returnDetails', 'returnDate', e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {formData.returnDetails.canReturn === 'restricted' && (
                <div>
                  <Label htmlFor="restrictions" className="font-medium">Restrictions</Label>
                  <Textarea
                    id="restrictions"
                    placeholder="Details of return restrictions"
                    value={formData.returnDetails.restrictions}
                    onChange={(e) => handleNestedChange('returnDetails', 'restrictions', e.target.value)}
                    className="min-h-[60px]"
                  />
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="followUpRequired"
                  checked={formData.returnDetails.followUpRequired}
                  onCheckedChange={(checked) => handleNestedChange('returnDetails', 'followUpRequired', !!checked)}
                />
                <Label htmlFor="followUpRequired" className="font-medium">Follow-up Required</Label>
              </div>
              
              {formData.returnDetails.followUpRequired && (
                <div>
                  <Label htmlFor="followUpDate" className="font-medium">Follow-up Date</Label>
                  <Input
                    id="followUpDate"
                    type="date"
                    value={formData.returnDetails.followUpDate}
                    onChange={(e) => handleNestedChange('returnDetails', 'followUpDate', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <Label htmlFor="additionalInformation" className="font-medium">Additional Information</Label>
            <Textarea
              id="additionalInformation"
              placeholder="Any additional information or special instructions"
              value={formData.additionalInformation}
              onChange={(e) => handleChange('additionalInformation', e.target.value)}
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
                onChange={(e) => handleChange('providerName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="providerTitle" className="font-medium">Provider Title</Label>
              <Input
                id="providerTitle"
                value={formData.providerTitle}
                onChange={(e) => handleChange('providerTitle', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="providerLicense" className="font-medium">License Number</Label>
              <Input
                id="providerLicense"
                value={formData.providerLicense}
                onChange={(e) => handleChange('providerLicense', e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 mt-7">
              <Checkbox
                id="providerSignature"
                checked={formData.providerSignature}
                onCheckedChange={(checked) => handleChange('providerSignature', !!checked)}
              />
              <Label htmlFor="providerSignature" className="cursor-pointer">
                I certify that the above information is true and accurate
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
            disabled={!isFormValid}
            title={!isFormValid ? "Complete all required fields" : ""}
          >
            Sign & Print Certificate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
