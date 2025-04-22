import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ProcedureConsentFormProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
  onSign: (data: any) => void;
}

export const ProcedureConsentForm: React.FC<ProcedureConsentFormProps> = ({
  isOpen,
  onClose,
  patientName,
  patientId,
  onSign,
}) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  const [formData, setFormData] = useState({
    // Patient Information (would be pre-filled in a real app)
    patientName,
    patientId,
    dateOfBirth: "1980-01-15", // Mock data
    
    // Procedure Information
    procedureDate: currentDate,
    procedureTime: currentTime,
    procedureName: "",
    procedureDescription: "",
    reasonForProcedure: "",
    alternativeTreatments: "",
    
    // Risks and Benefits
    risks: "",
    benefits: "",
    
    // Anesthesia
    anesthesiaType: "local", // local, moderate, general, none
    anesthesiaRisks: "Potential risks include allergic reaction, bruising at the injection site, and temporary numbness or tingling.",
    
    // Consent Confirmation
    consentStatement: "I understand that I have the right to ask questions about any part of the procedure and to withdraw my consent at any time prior to the procedure. I am satisfied with the explanation and have had all my questions answered.",
    patientConsent: false,
    patientSignature: "",
    patientSignatureDate: currentDate,
    
    // Provider Information
    providerName: "Dr. Patterson",
    providerSignature: false,
    providerSignatureDate: currentDate,
    
    // Witness Information (optional)
    witnessNeeded: false,
    witnessName: "",
    witnessSignature: false,
    witnessSignatureDate: currentDate,
  });

  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = () => {
    const timestamp = new Date().toISOString();
    const consentData = {
      ...formData,
      type: "procedureConsent",
      timestamp,
      authorName: formData.providerName
    };
    onSign(consentData);
    onClose();
  };

  const isFormValid = 
    formData.procedureName && 
    formData.risks && 
    formData.procedureDescription && 
    formData.patientConsent && 
    formData.patientSignature && 
    formData.providerSignature && 
    (!formData.witnessNeeded || (formData.witnessNeeded && formData.witnessName && formData.witnessSignature));

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-sky-800">
            Procedure Consent Form - {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
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
            <div>
              <Label className="text-sm text-slate-500">Date</Label>
              <div className="font-medium">{currentDate}</div>
            </div>
          </div>

          {/* Procedure Information */}
          <div>
            <h3 className="font-medium text-sky-700 mb-3">Procedure Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="procedureName" className="font-medium">Procedure Name</Label>
                <Input
                  id="procedureName"
                  placeholder="e.g., Laceration Repair"
                  value={formData.procedureName}
                  onChange={(e) => handleChange('procedureName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="procedureDate" className="font-medium">Procedure Date</Label>
                <Input
                  id="procedureDate"
                  type="date"
                  value={formData.procedureDate}
                  onChange={(e) => handleChange('procedureDate', e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="procedureDescription" className="font-medium">Procedure Description</Label>
                <Textarea
                  id="procedureDescription"
                  placeholder="Detailed description of the procedure to be performed..."
                  value={formData.procedureDescription}
                  onChange={(e) => handleChange('procedureDescription', e.target.value)}
                  className="min-h-[80px]"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="reasonForProcedure" className="font-medium">Reason for Procedure</Label>
                <Textarea
                  id="reasonForProcedure"
                  placeholder="Why this procedure is being recommended..."
                  value={formData.reasonForProcedure}
                  onChange={(e) => handleChange('reasonForProcedure', e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="alternativeTreatments" className="font-medium">Alternative Treatments</Label>
                <Textarea
                  id="alternativeTreatments"
                  placeholder="Other treatment options that were considered..."
                  value={formData.alternativeTreatments}
                  onChange={(e) => handleChange('alternativeTreatments', e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
            </div>
          </div>

          {/* Risks and Benefits */}
          <div>
            <h3 className="font-medium text-sky-700 mb-3">Risks and Benefits</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="risks" className="font-medium">Potential Risks and Complications</Label>
                <Textarea
                  id="risks"
                  placeholder="Detailed list of potential risks and complications..."
                  value={formData.risks}
                  onChange={(e) => handleChange('risks', e.target.value)}
                  className="min-h-[80px]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="benefits" className="font-medium">Expected Benefits</Label>
                <Textarea
                  id="benefits"
                  placeholder="Expected benefits of the procedure..."
                  value={formData.benefits}
                  onChange={(e) => handleChange('benefits', e.target.value)}
                  className="min-h-[60px]"
                />
              </div>
            </div>
          </div>

          {/* Anesthesia */}
          <div>
            <h3 className="font-medium text-sky-700 mb-3">Anesthesia</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="anesthesiaType" className="font-medium">Type of Anesthesia</Label>
                <RadioGroup
                  value={formData.anesthesiaType}
                  onValueChange={(value) => handleChange('anesthesiaType', value)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="anesthesia-none" />
                    <Label htmlFor="anesthesia-none">None</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="local" id="anesthesia-local" />
                    <Label htmlFor="anesthesia-local">Local Anesthesia</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="anesthesia-moderate" />
                    <Label htmlFor="anesthesia-moderate">Moderate Sedation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="general" id="anesthesia-general" />
                    <Label htmlFor="anesthesia-general">General Anesthesia</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {formData.anesthesiaType !== 'none' && (
                <div>
                  <Label htmlFor="anesthesiaRisks" className="font-medium">Anesthesia Risks</Label>
                  <Textarea
                    id="anesthesiaRisks"
                    value={formData.anesthesiaRisks}
                    onChange={(e) => handleChange('anesthesiaRisks', e.target.value)}
                    className="min-h-[60px]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Consent Confirmation */}
          <div>
            <h3 className="font-medium text-sky-700 mb-3">Consent</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="consentStatement" className="font-medium">Consent Statement</Label>
                <Textarea
                  id="consentStatement"
                  value={formData.consentStatement}
                  onChange={(e) => handleChange('consentStatement', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="patientConsent"
                  checked={formData.patientConsent}
                  onCheckedChange={(checked) => handleChange('patientConsent', !!checked)}
                />
                <Label htmlFor="patientConsent" className="font-medium cursor-pointer">
                  I understand the procedure, its risks, benefits, and alternatives as explained to me. I have had my questions answered and consent to this procedure.
                </Label>
              </div>
              
              <div>
                <Label htmlFor="patientSignature" className="font-medium">Patient Signature</Label>
                <Input
                  id="patientSignature"
                  placeholder="Type full name to sign"
                  value={formData.patientSignature}
                  onChange={(e) => handleChange('patientSignature', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="patientSignatureDate" className="font-medium">Date</Label>
                <Input
                  id="patientSignatureDate"
                  type="date"
                  value={formData.patientSignatureDate}
                  onChange={(e) => handleChange('patientSignatureDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Provider Information */}
          <div>
            <h3 className="font-medium text-sky-700 mb-3">Provider Confirmation</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="providerName" className="font-medium">Provider Name</Label>
                <Input
                  id="providerName"
                  value={formData.providerName}
                  onChange={(e) => handleChange('providerName', e.target.value)}
                />
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="providerSignature"
                  checked={formData.providerSignature}
                  onCheckedChange={(checked) => handleChange('providerSignature', !!checked)}
                />
                <Label htmlFor="providerSignature" className="font-medium cursor-pointer">
                  I have explained the procedure, its risks, benefits, and alternatives to the patient. The patient has had an opportunity to ask questions and has given informed consent.
                </Label>
              </div>
              
              <div>
                <Label htmlFor="providerSignatureDate" className="font-medium">Date</Label>
                <Input
                  id="providerSignatureDate"
                  type="date"
                  value={formData.providerSignatureDate}
                  onChange={(e) => handleChange('providerSignatureDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Witness Information */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id="witnessNeeded"
                checked={formData.witnessNeeded}
                onCheckedChange={(checked) => handleChange('witnessNeeded', !!checked)}
              />
              <Label htmlFor="witnessNeeded" className="font-medium text-sky-700">Witness Required</Label>
            </div>
            
            {formData.witnessNeeded && (
              <div className="space-y-4 pl-6">
                <div>
                  <Label htmlFor="witnessName" className="font-medium">Witness Name</Label>
                  <Input
                    id="witnessName"
                    placeholder="Full name of witness"
                    value={formData.witnessName}
                    onChange={(e) => handleChange('witnessName', e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="witnessSignature"
                    checked={formData.witnessSignature}
                    onCheckedChange={(checked) => handleChange('witnessSignature', !!checked)}
                  />
                  <Label htmlFor="witnessSignature" className="font-medium cursor-pointer">
                    I witnessed the patient signing this consent form voluntarily and of their own free will.
                  </Label>
                </div>
                
                <div>
                  <Label htmlFor="witnessSignatureDate" className="font-medium">Date</Label>
                  <Input
                    id="witnessSignatureDate"
                    type="date"
                    value={formData.witnessSignatureDate}
                    onChange={(e) => handleChange('witnessSignatureDate', e.target.value)}
                  />
                </div>
              </div>
            )}
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
            Sign & Save Consent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
